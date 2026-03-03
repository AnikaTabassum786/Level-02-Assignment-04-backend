import { User } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const getProfileInfoByUser=async(userId:string)=>{
    const result = await prisma.user.findUnique({
        where:{id:userId},
        select:{
            id:true,
            name:true,
            email:true,
            phone:true,
            address:true,
            image:true,
            role:true,

            reviews:{
                select:{
                    id:true,
                    rating:true,
                    comment:true,
                    medicineId:true,
                    createdAt:true
                }
            }

        }
    })

    if(!result){
        throw new Error("User Not Found")
    }
    return result
}

const updateProfileInfo=async(userId:string,data: Partial<User>)=>{
    console.log("Update profile info",userId)

     const result = await prisma.user.update({
        where: {
            id: userId
        },
        data
    })
    return result
}

export const profileService = {
 getProfileInfoByUser,
 updateProfileInfo
};