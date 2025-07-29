import { NextResponse, NextMiddleware } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export const middleware: NextMiddleware = async (request: NextRequest) => {
    const token = await getToken({ req:request, secret:process.env.NEXTAUTH_SECRET})

    if(!token){
        return NextResponse.redirect(new URL("/signin", request.url))
    }

    console.log("Token:", token);

    console.log("middleware hit")

    const {pathname} = request.nextUrl;

    const userRole = token.role

    if(pathname.startsWith("/dashboard") && userRole !== "ADMIN" && userRole !== "STAFF"){
        return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    if(pathname.startsWith("/user") && userRole !== "USER"){
        return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    return NextResponse.next();

}

export const config = {
    matcher: ["/dashboard/:path*", "/user/:path*"]
};