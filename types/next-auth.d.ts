import NextAuth, {DefaultSession} from "next-auth";


declare module "next-auth" {
  interface Session {   
    user: {
      id: string;
      role: "USER" | "ADMIN" | "STAFF";
    } & DefaultSession["user"];
  } 

  interface User {
    id: string;
    role: "USER" | "ADMIN" | "STAFF";
  }
}

declare module "next-auth/jwt" {
  interface JWT {   
    id: string;
    role: "USER" | "ADMIN" | "STAFF";
  } 
}