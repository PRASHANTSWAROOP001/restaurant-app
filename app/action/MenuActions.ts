import {prisma} from "../../lib/Prisma"

export async function getCategories():Promise<{success:boolean, data?:string[], message:string}> {
    try {

        const categories = await prisma.category.findMany({
            orderBy:{
                name:"desc"   
            },
            select:{
                name:true
            }
        })


        const categoriesArray:string[] = categories.map((value)=>value.name)

        return {
            success:true,
            data:categoriesArray,
            message:"success"
        }
        
    } catch (error) {

        console.error("error happened while fetching categories", error)
        return {success:false, message:"error happened while fetching categories"}
        
    }
}