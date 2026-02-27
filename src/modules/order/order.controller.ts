import { Request, Response } from "express";
import { orderService } from "./order.service";


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

export const OrderController = {
 createOrder
}