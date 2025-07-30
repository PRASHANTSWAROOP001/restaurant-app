"use server"
import {prisma} from "@/lib/Prisma";
import  bcrypt from "bcrypt"
import { staffOnboardingSchema } from "@/lib/ZodValidations";
import type { StaffProfile, StaffTableData } from "../../types/prismaTypes";


export async function staffOnboardingAction(formData: FormData):Promise<{success:boolean, message:string}> {

    try {


        const parsedData = staffOnboardingSchema.safeParse(Object.fromEntries(formData.entries()))

        if(!parsedData.success){
            return {success:false, message:`invalid data provided: ${parsedData.error.flatten()}`}
        }
        
        const name = formData.get("name")?.toString();
        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();
        const position = formData.get("position")?.toString();

        if(!name || !email || !password || !position){
            return {
                success:false,
                message:"missing data"
            }
        }

        

        const searchEmail = await prisma.user.findUnique({
            where:{
                email:email
            }
        })

        if(searchEmail){
            return {
                success:false,
                message:`user already exist with this email with id ${searchEmail.id}`
            }
        }


       const hashedPassword = await bcrypt.hash(password, 10);

       const userData = await prisma.$transaction(async(tx)=>{
            const userData = await tx.user.create({
                data:{
                    name,
                    email,
                    password:hashedPassword,
                    role:"STAFF"
                }
            })

            await tx.staffProfile.create({
                data:{
                    name,
                    userId: userData.id,
                    position
                }
            })

            return userData

        })

        return {
            success: true,
            message:`successfully data saved, assigned userId ${userData.id}`
        };


    } catch (error) {
        console.error("error happened while onboarding staff: ", error)
        return {success:false, message:"error happened while onboarding staff"}
    }
}




export async function getAllStaff({page=1, limit=10, search=""}:{page?:number; limit?:number; search?:string;}):Promise<{success:boolean, data?:StaffTableData[],totalPage?:number , message:string}>{
    try {

        const skip:number = (page-1)*limit
        
        const data:StaffTableData[] = await prisma.staffProfile.findMany({
            where:{
                ...(search && {
                    name:{
                        contains:search,
                        mode:"insensitive"
                    }
                })
            },
            skip,
            take:limit,
            orderBy:{
                createdAt:"desc"
            },
            include:{
                user:{
                    select:{
                        email:true
                    }
                }
            }
            
        })

        const totalStaff = await prisma.staffProfile.count({
            where:{
                ...(search && {
                    name:{
                        contains:search,
                        mode:"insensitive"
                    }
                })
            }
        })
    

        return {success:true, message:"data fetched successfully", data:data, totalPage:totalStaff}
        
    } catch (error) {

        console.error("error happened while getting staff data: ", error)
        return{success:false, message:`error while getting staff data: ${error}`}
        
    }
}

export async function deleteStaffData(staffId:string):Promise<{success:boolean, message:string}>{
    try {

        if(!staffId){
            return {success:false, message:"missing userid"}
        }

        const searchStaff = await prisma.user.findUnique({
            where:{
                id:staffId
            }
        })

        if(!searchStaff){
            return {success:false, message:"404 error staff data does not exist"}
        }

        await prisma.user.delete({
            where:{
                id:staffId
            }
        })

        return {success:true, message:"data deleted successfully"}

        
    } catch (error) {
        console.error("error happened while deteleting staff data", error)
        return {success:false, message:`error happened`}
    }

}