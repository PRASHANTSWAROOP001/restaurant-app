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
  },

  secret: process.env.NEXTAUTH_SECRET,

  events: {
    createUser: async ({ user }) => {
      try {
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
      // Only runs the first time the token is issued
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email || "" },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser.id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Add custom fields to session
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
};
