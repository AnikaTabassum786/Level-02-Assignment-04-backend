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
            medicine:true,
        }
     }
    },
    orderBy:{
      createdAt:"desc"
    }
 })
 return result
}


const updateOrderStatusBySeller = async (
  orderId: string,
  sellerId: string,
  status: OrderStatus
) => {

  // 🔍 Check order belongs to this seller
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          medicine: true
        }
      }
    }
  })

  if (!order) {
    throw new Error("Order not found")
  }

  // 🔒 Ensure seller owns at least one medicine in order
  const isSellerOrder = order.orderItems.some(
    item => item.medicine.sellerId === sellerId
  )

  if (!isSellerOrder) {
    throw new Error("You are not allowed to update this order")
  }

  // ✅ Update order status
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status
    }
  })

  return updatedOrder
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