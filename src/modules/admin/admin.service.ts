import { prisma } from "../../lib/prisma";

const  getAllUsers=async()=>{
  const result = await prisma.user.findMany({
    orderBy:{
        createdAt:"desc"
    }
  })
  return result
}

export const adminService = {
 getAllUsers
};