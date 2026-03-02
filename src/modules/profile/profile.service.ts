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
            role:true

        }
    })

    if(!result){
        throw new Error("User Not Found")
    }
    return result
}

export const ProfileService = {
 getProfileInfoByUser,
};