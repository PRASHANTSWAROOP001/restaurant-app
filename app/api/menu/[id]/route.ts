import { NextRequest, NextResponse } from "next/server";
import { menuItemSchema } from "@/lib/ZodValidations";
import { prisma } from "@/lib/Prisma";
import { Label } from "../../../types/prismaTypes";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Request body:", body);

    const validateMenuItem = menuItemSchema.safeParse(body);

    if (!validateMenuItem.success) {
      return NextResponse.json({
        success: false,
        message: "Validation error",
        errors: validateMenuItem.error.flatten(),
      }, { status: 400 });
    }

    const validatedData = validateMenuItem.data;

    const discounted: boolean = validatedData.basePrice > validatedData.sellPrice ? false : true;

    // If categoryId is missing, create the category
    if (!validatedData.categoryId) {
      const menuData = await prisma.$transaction(async (tx) => {
        const categoryData = await tx.category.create({
          data: {
            name: validatedData.category,
          },
        });

        const menuItemAdded = await tx.menuItem.create({
          data: {
            name: validatedData.name,
            basePrice: validatedData.basePrice,
            sellPrice: validatedData.sellPrice,
            categoryId: categoryData.id,
            imageUrl: validatedData.imageUrl,
            label: validatedData.label as Label,
            discounted,
          },
        });

        return menuItemAdded;
      });

      return NextResponse.json({
        success: true,
        message: `Data added successfully with ID: ${menuData.id}`,
        data: menuData,
      });
    }

    // ✅ FIX: Only add `categoryId` if it exists
    const addMenuWithCategory = await prisma.menuItem.create({
      data: {
        name: validatedData.name,
        basePrice: validatedData.basePrice,
        sellPrice: validatedData.sellPrice,
        imageUrl: validatedData.imageUrl,
        label: validatedData.label as Label,
        discounted,
        categoryId: validatedData.categoryId, // this is now guaranteed to exist
      },
    });

    return NextResponse.json({
      success: true,
      message: `Menu item added with ID: ${addMenuWithCategory.id}`,
      data: addMenuWithCategory,
    });

  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}


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