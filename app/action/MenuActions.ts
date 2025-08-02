"use server"
import { prisma } from "../../lib/Prisma"
import { MenuItemDTO, transformMenuItem } from "@/types/menu"

export async function getCategories(): Promise<{ success: boolean, data?: { id: string, name: string }[], message: string }> {
    try {

        const categories = await prisma.category.findMany({
            orderBy: {
                name: "desc"
            },
            select: {
                name: true,
                id: true
            }
        })


        const categoriesArray: {
            id: string,
            name: string
        }[] = categories.map((value) => ({
            name: value.name,
            id: value.id
        }))

        return {
            success: true,
            data: categoriesArray,
            message: "success"
        }

    } catch (error) {

        console.error("error happened while fetching categories", error)
        return { success: false, message: "error happened while fetching categories" }

    }
}

export async function createCategory(category:string):Promise<{success:boolean, message:string}>{
    try {
        const searchExisting = await prisma.category.findFirst({
            where:{
                ...(category && {
                    name:{
                        contains:category,
                        mode:"insensitive"
                    }
                })
                
            }
        })

        if(searchExisting){
            return {success:false, message:"category already exists"}
        }

        const newCategory = await prisma.category.create({
            data:{
                name:category
            }
        })

        return {success:true, message:`category created with id ${newCategory.id}`}

    } catch (error) {
        console.error("error happened while creating category", error)
        return {success:false, message:"internal server error"}
    }
}


export async function getMenuItems({ page = 1, limit = 10, search = "" }: { page?: number; limit?: number; search?: string; }): Promise<{ success: boolean, data?: MenuItemDTO[], totalPage?:number, message: string }> {

    try {

        const skip: number = (page - 1) * limit

        const [menuData, count] = await Promise.all([
            prisma.menuItem.findMany({
                where: {
                    ...(search && {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    }),
                },
                skip,
                take: limit,
                include: {
                    category: {
                        select: {
                            name: true,
                            id:true
                        },
                    },
                },
            }),

            prisma.menuItem.count({
                where: {
                    ...(search && {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    }),
                },
            }),
        ]);

        const formatData: MenuItemDTO[] = menuData.map(transformMenuItem);

        return {success:true, message:"data fetched successfully", totalPage: Math.ceil(count/limit), data:formatData }

    } catch (error) {

        console.error("error while getting intialData", error)
        return { success: false, message: `internal server error` }

    }
}
