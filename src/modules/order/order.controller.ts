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
    res.status(200).json(result)
  }
  catch(error:any){
    res.status(400).json({
        success:false,
         message: error.message || "Fetch order failed",
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
    res.status(200).json(result)
  }
  catch(error:any){
    let statusCode = 500
    
  if (error.message === "Not Authorized") {
    statusCode = 403
  }

  if(error.message === "Order Not found"){
    statusCode = 404
  }
    res.status(statusCode).json({
      success:false,
      message:error.message || "Internal Server Error"
    })
  }


}

export const OrderController = {
 createOrder,
 getOwnOrder,
 getOrderById
}