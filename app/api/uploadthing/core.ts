import {createUploadthing,type FileRouter} from "uploadthing/server"
import { getToken } from "next-auth/jwt"

const f = createUploadthing()

export const OurFileRouter = {
    imageUploader: f({image: {maxFileSize:"4MB"}})
    .middleware(async ({req})=>{
        const token = await getToken({
        req: {
          headers: Object.fromEntries(req.headers), // convert Headers to plain object
          cookies: Object.fromEntries(req.headers.get("cookie")?.split("; ").map(cookie => cookie.split("=")) ?? []),
        } as any, // you can safely cast here
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        throw new Error("Unauthorized");
      }

      if (token?.role !== "ADMIN") {
        throw new Error("Forbidden");
      }

      return {
        userId:token.id,
        email:token.email
      }

    })
    .onUploadComplete(async ({metadata, file})=>{
        console.log("File uploaded:", file.ufsUrl, "Metadata:", metadata);
        // You can perform additional actions here, like saving the file info to your database
    }),
} satisfies  FileRouter;

