import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { zodSignupSchema } from "@/lib/ZodValidations";
import {prisma} from "@/lib/Prisma";

export async function POST(req:NextRequest){
    try {
        const body = await req.json();
        // Here you would typically handle the registration logic, such as saving the user to a database
        // For demonstration, we will just return a success message

        const parsedData = zodSignupSchema.safeParse(body);

        if(!parsedData.success) {
            return NextResponse.json({success:false ,mesage:"invalid data format", error: parsedData.error.flatten }, { status: 400 });
        }

        const hashPassword = await bcrypt.hash(body.password, 10);

        const checkUser = await prisma.user.findUnique({
            where:{
                email: body.email
            }
        })

        if(checkUser){
            return NextResponse.json({ success:false ,message: "User already exists" }, { status: 400 });
        }

        await prisma.user.create({
            data: {
                email: body.email,
                password: hashPassword,
            },
        });

        return NextResponse.json({ success:true,message: "User registered successfully" }, { status: 201 });
    } catch (error) {

        return NextResponse.json({ success:false,message: "Registration failed due to internal server error" }, { status: 500 });
    }
}