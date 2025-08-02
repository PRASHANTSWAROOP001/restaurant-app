import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/Prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/NextAuthOptions";


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log("Deleting menu item with ID:", id);
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Menu item ID is required",
      }, { status: 400 });
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

    const searchMenuItem = await prisma.menuItem.findUnique({
      where:{
        id:id
      }
    })

    if(!searchMenuItem){
      return NextResponse.json({
        success: false,
        message: "Menu item not found",
      },  { status: 404 });
    }


    await prisma.menuItem.delete({
      where:{
        id:id
      }
    })  

    return NextResponse.json({
      success:true,
      message: `data with given id ${id} deleted successfully`
    })

    
  } catch (error) {

    console.error("Error deleting menu item:", error);
    return NextResponse.json({success:false, message:"Internal server error"}, { status: 500 });
  }
}