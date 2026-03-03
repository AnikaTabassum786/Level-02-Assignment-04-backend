import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
    const result = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    return result
}

const getAllOrders = async () => {
    const result = await prisma.order.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    return result
}

const toggleBanUser = async(userId:string)=>{
  const existingUser = await prisma.user.findUnique({
    where:{
        id:userId
    }
  })

   if(!existingUser){
       throw new Error("Admin can not be banned") 
    }


    const result = await prisma.user.update({
        where:{
            id:userId
        },
        data:{
           isBanned:!existingUser.isBanned
        }

    })
    return result
}

const getAllReviews = async()=>{
    const result = await prisma.review.findMany({
        orderBy:{
            createdAt:"desc"
        }
    })
    return result
}



export const adminService = {
    getAllUsers,
    getAllOrders,
    toggleBanUser,
    getAllReviews
};