import { prisma } from "../../lib/prisma";

interface CreatedCartPayload{
   medicineId: string;
   quantity: number;
}

const createCart = async (payload:CreatedCartPayload,userId:string) => {
   const {medicineId,quantity} = payload;

   if(!medicineId || !quantity){
    throw new Error("Medicine Id and quantity are required")
   }

   if(quantity <= 0){
    throw new Error("Quantity must be grater than 0")
   }

   const medicine = await prisma.medicine.findUnique({
    where:{
      id:medicineId
    }
   })

   if(!medicine){
    throw new Error("Medicine not found")
   }

   if(medicine.stock < quantity){
    throw new Error("Insufficient Stock")
   }

   let cart = await prisma.cart.findUnique({
    where:{
      userId
    }
   })

   if(!cart){
    cart = await prisma.cart.create({
      data:{userId}
    })
   }

   const existingItem = await prisma.cartItem.findFirst(
    {
      where:{
        cartId:cart.id,
        medicineId
      }
    })

    if(existingItem){
      if(medicine.stock < existingItem.quantity+quantity){
        throw new Error("Stock Limit exceeded")
      }
    }


  if(existingItem){
     const updateCartItem = await prisma.cartItem.update({
      where:{id:existingItem.id},
      data:{
        quantity:existingItem?.quantity+quantity
      }
    })
    return updateCartItem
  }

  const result = await prisma.cartItem.create({
    data:{
      cartId:cart.id,
      medicineId,
      quantity
    }
  })

  return result
 
};



export const cartService = {
  createCart,

};