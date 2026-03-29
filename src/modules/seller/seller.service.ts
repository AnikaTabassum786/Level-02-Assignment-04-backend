import { OrderStatus } from "../../../generated/prisma/enums";
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


const updateOrderStatusBySeller=async(orderId:string,sellerId:string,status:OrderStatus)=>{
    // console.log("Get Seller Order By Id",orderId)
    const orderResult = await prisma.order.findFirst({ // matches id with orderId,orderItem with medicine,medicine with seller
        where:{
        id:orderId,
        orderItems:{
            some:{
                medicine:{
                    sellerId:sellerId //At least one related record. It works like EXISTS 
                }
            }
        }
    }
    })

    if(!orderResult){
        throw new Error("Order not found or not authorized")
    }

    const result = await prisma.order.update({
        where:{
            id:orderId
        },
        data:{
            status:status
        }
    })

    return result
}

const updateMedicineBySeller = async(medicineId:string, sellerId:string, payload: any)=>{
       const existingMedicine = await prisma.medicine.findFirst({
    where: {
      id: medicineId,
      sellerId: sellerId,
    },
  });

  if (!existingMedicine) {
    throw new Error("Medicine not found or unauthorized");
  }
   const updatedMedicine = await prisma.medicine.update({
    where: {
      id: medicineId,
    },
    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.description && { description: payload.description }),
      ...(payload.price && { price: Number(payload.price) }),
      ...(payload.stock !== undefined && { stock: Number(payload.stock) }),
      ...(payload.manufacturer && { manufacturer: payload.manufacturer }),
      ...(payload.imageURL && { imageURL: payload.imageURL }),
      ...(payload.categoryId && { categoryId: payload.categoryId }),
    },
  });

  return updatedMedicine;
}



export const SellerService = {
 getSellerOrders,
 updateOrderStatusBySeller,
 updateMedicineBySeller
};