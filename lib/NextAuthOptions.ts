import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Dummy login logic — replace this with DB lookup + bcrypt later
        if (
          credentials?.email === "admin@admin.com" &&
          credentials.password === "admin"
        ) {
          return { id: "1", name: "Admin", email: "admin@admin.com" };
        }
        return null; // return null if login fails
      },
    }),
  ],
};