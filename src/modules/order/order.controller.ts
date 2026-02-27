import { Request, Response } from "express";
import { orderService } from "./order.service";
import { success } from "better-auth/*";


const createOrder = async (req: Request, res: Response) => {
     try {
       const result = await orderService.createOrder(
        {
            customerId:req.user!.id,
            shippingAddress:req.body.shippingAddress,
            items:req.body.items
        }
       )
       res.status(201).json(result)
     }
     catch (e:any) {
        console.log("error",e)
        res.status(400).json({
         error: "Order creation failed",
         message:e.message,
         stack:e.stack
       })
     }
};

const getOwnOrder = async(req: Request, res: Response)=>{
  try{
    const user = req.user
    const result = await orderService.getOwnOrder(user?.id as string, user?.role as string
    )
    res.status(201).json(result)
  }
  catch(error){
    res.status(500).json({
        success:false,
         message: "Fetch order failed",
    })
  }
} 

const getOrderById=async(req: Request, res: Response)=>{
  try{
    
    const user = req.user
    if (!user){
       throw new Error("Unauthorized")
    }
     
    const {orderId} = req.params
    const result = await orderService.getOrderById(orderId as string,user?.id as string, user?.role as string )
    res.status(201).json(result)
  }
  catch(error){
    res.status(500).json({
        success:false,
         message: "Fetch order failed",
    })
  }
}

export const OrderController = {
 createOrder,
 getOwnOrder,
 getOrderById
}