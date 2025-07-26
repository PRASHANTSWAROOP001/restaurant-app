import CredentialsProvider from "next-auth/providers/credentials";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/Prisma";
import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("User not found or has no password set");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role:user.role || "USER", // Default to USER if no role is set
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge:60*60,
    updateAge: 10*60 
  },

  secret: process.env.NEXTAUTH_SECRET,

  events: {
    createUser: async ({ user }) => {
      try {

        console.log("Creating user:", user);

        const superAdminEmail = process.env.ADMIN_EMAIL;
        
        if (!superAdminEmail) {
          console.warn("ADMIN_EMAIL not set in environment");
          return;
        }

        if( !user.email) {
          console.warn("User email is not defined, cannot assign role.");
          return;
        }

        const roleToSet = user.email === superAdminEmail ? "ADMIN" : "USER";

        await prisma.user.update({
          where: { email: user.email },
          data: { role: roleToSet },
        });

        console.log(`Assigned role '${roleToSet}' to user: ${user.email}`);
      } catch (err) {
        console.error("Error assigning role on createUser:", err);
      }
    },
  },

  callbacks: {
async jwt({ token, user }) {
  try {
    // Always get fresh user data from DB using token.email or user.email
    const email = token?.email || user?.email;

    if (!email) {
      console.warn("No email found on token or user");
      return token;
    }

    const dbUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!dbUser) {
      console.warn("User not found in DB for email:", email);
      return token;
    }

    // Always override with fresh DB values
    token.email = dbUser.email;
    token.id = dbUser.id;
    token.role = dbUser.role || "USER";

    return token;
  } catch (error) {
    console.error("Error in jwt callback:", error);
    return token;
  }
},
    async session({ session, token }) {
      // Add custom fields to session

      console.log("Session callback fired. Token:", token);
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
};
