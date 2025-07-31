// app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next";
import { OurFileRouter } from "./core"; // or wherever your router is

export const { GET, POST } = createRouteHandler({
  router: OurFileRouter,
});

