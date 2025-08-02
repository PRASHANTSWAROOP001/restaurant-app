import { NextRequest, NextResponse } from "next/server";
import { menuItemSchema, menuUpdateSchema } from "@/lib/ZodValidations";
import { prisma } from "@/lib/Prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/NextAuthOptions";





export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("body", body
    )


    const validateMenuItem = menuItemSchema.safeParse(body)

    if(!validateMenuItem.success){
      return NextResponse.json({
        success:false,
        message:`validation error: ${validateMenuItem.error.format()}`
      },{status:401})
    }
    
    const session = await getServerSession(authOptions)
    console.log(session)
    if(session == null){
      return NextResponse.redirect("/signin")
    }
    else if( session.user.role != "ADMIN"){
      return NextResponse.json({
        success:false,
        message:"unauthorized access. access denied."
      }, {status:400})
    }

    const validatedData = validateMenuItem.data;

    const discounted:boolean = validatedData.basePrice < validatedData.sellPrice ? false : true

    const saveMenu = await prisma.menuItem.create({
      data:{
        basePrice:validatedData.basePrice,
        sellPrice:validatedData.sellPrice,
        name:validatedData.name,
        categoryId:validatedData.categoryId,
        imageUrl:validatedData.imageUrl,
        label:validatedData.label,
        discounted
      }
    })

    return NextResponse.json({
      success:true,
      message:`data saved successfully with id: ${saveMenu.id}`
    })
 
  } 
  catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}

export async function PUT(req:NextRequest ){
  try {

    const body = await req.json();

    console.log("Request body:", body);

    const validateMenuItem = menuUpdateSchema.safeParse(body)

    if(!validateMenuItem.success){
      return NextResponse.json({
        success:false,
        message:`validation error: ${validateMenuItem.error.format()}`
      })
    }
    
    const session = await getServerSession(authOptions)

    if(session == null){
      return NextResponse.redirect("/signin")
    }
    else if( session.user.role != "ADMIN"){
      return NextResponse.json({
        success:false,
        message:"unauthorized access. access denied."
      }, {status:400})
    }


    const validatedUpdateData = validateMenuItem.data

    const searchMenu = await prisma.menuItem.findUnique({
      where:{
        id:validatedUpdateData.id
      }
    })

    if(!searchMenu){
      return NextResponse.json({
        success:false,
        message:`missing data with given id: ${validatedUpdateData.id}`
      },{status:404})
    }
      
    const updateMenu = await prisma.menuItem.update({
      where:{
        id: validatedUpdateData.id
      },
      data:{
        basePrice:validatedUpdateData.basePrice,
        categoryId:validatedUpdateData.categoryId,
        sellPrice:validatedUpdateData.sellPrice,
        discounted:validatedUpdateData.discounted,
        name:validatedUpdateData.name,
        imageUrl:validatedUpdateData.imageUrl,
        label:validatedUpdateData.label
      }
    })

    return NextResponse.json({
      success:true,
      message:`data with id ${updateMenu.id} is updated successfully`
    })

    
  } catch (error) {
    console.error("error happened while updating menuItem",error)
    return NextResponse.json({
      success:false,
      message:"internal server error"
    })
  }
}

