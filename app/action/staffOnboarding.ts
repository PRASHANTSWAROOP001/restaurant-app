"use server"
import {prisma} from "@/lib/Prisma";
import  bcrypt from "bcrypt"
import z from "zod"
import { staffOnboardingSchema, staffEditSchema } from "@/lib/ZodValidations";
import type { StaffTableData, Status } from "../../types/prismaTypes";


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

type StaffEdit = z.infer<typeof staffEditSchema>


export async function editStaffDetails({staffId, staffEditData}:{
    staffId:string;
    staffEditData:undefined | StaffEdit;
    
}){
    try {

        if(!staffId || !staffEditData){
            return {success:false, message:"missing data"}
        }

        const parsedData = staffEditSchema.safeParse(staffEditData)

        if(!parsedData.success){
            return {success:false, message:`invalid data provided: ${parsedData.error.flatten()}`}
        }

        const validatedEditData = parsedData.data;

        const searchStaff = await prisma.user.findUnique({
            where:{
                id:staffId
            }
        })

        if(!searchStaff){
            return {success:false, message:"404 error staff data does not exist"}
        }

        // if the password is not provided and the email is same as the existing one, we can update without changing the password

        if(!staffEditData.password && staffEditData.email === searchStaff.email){
               await prisma.staffProfile.update({
                where:{
                    userId:staffId,
                },
                data:{
                    name:validatedEditData.name,
                    position:validatedEditData.position,
                    status:validatedEditData.status as Status,
                }
              })
              return {success:true, messgae:"sata updated successfully"}
        }

        // now if either the email/ password is changed or provided we can update both tables

        const hashedPassword = validatedEditData.password ? await bcrypt.hash(validatedEditData.password, 10) : searchStaff.password; // if password is not provided, we keep the existing password
        

        await prisma.$transaction(async(tx)=>{
            await tx.user.update({
                where:{
                    id:staffId
                },
                data:{
                    name:validatedEditData.name,
                    email:validatedEditData.email,
                    password:hashedPassword,
                }
            })

            await tx.staffProfile.update({
                where:{
                    userId:staffId
                },
                data:{
                    name:validatedEditData.name,
                    position:validatedEditData.position,
                    status:validatedEditData.status as Status
                }
            })
        })

        return {success:true, message:"data updated successfully"}
        
    } catch (error) {

        console.error("error happened while editing staff details: ", error)
        return {success:false, message:"error happened while editing staff details"}
        
    }
}