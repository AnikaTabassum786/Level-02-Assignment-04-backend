import { prisma } from "../../lib/prisma";

const getSellerOrders = async(sellerId:string)=>{
//  console.log("Seller Order")
 const result = await prisma.order.findMany({
    where:{
        orderItems:{
            some:{
                medicine:{
                    sellerId:sellerId //DB medicine has sellerId
                }
            }
        }
    },
    include:{
     customer:{
        select:{
            id:true,
            name:true,
            email:true
        }
     },
     orderItems:{
        where:{
            medicine:{
                sellerId:sellerId
            }
        },
        include:{
            medicine:true
        }
     }
    }
 })
 return result
}

export const SellerService = {
 getSellerOrders
};