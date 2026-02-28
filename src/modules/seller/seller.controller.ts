import { Request, Response } from "express"
import { SellerService } from "./seller.service"
import { OrderStatus, Role } from "../../../generated/prisma/enums"



const getSellerOrders = async (req: Request, res: Response) => {
    try {
        if(!req.user || req.user.role !== Role.SELLER){
            throw new Error("Unauthorized")
        }
        const user = req.user
        console.log("Seller is",user)
        const result = await SellerService.getSellerOrders(user!.id as string)
        res.status(200).json({
            success:true,
            count:result.length,
            data:result
        })
    }
    catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Order Fetch failed",
        })
    }
}

const updateOrderStatusBySeller= async(req: Request, res: Response)=>{
    try{
       const {orderId} = req.params
       const user = req.user
       const {status} = req.body

       if(!user || user.role !== Role.SELLER){
            throw new Error("Unauthorized")
        }

        if(!status){
         throw new Error("Status is required")
        }

        const updatedStatus = status.trim().toUpperCase()

        if(!Object.values(OrderStatus).includes(updatedStatus as OrderStatus)){
            throw new Error("Invalid Status")
        }

       const result = await SellerService.updateOrderStatusBySeller(orderId as string, user!.id as string,status)
    res.status(200).json({
      success: true,
      data: result
    })
    }
     catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Order Updated failed",
        })
    }
}

export const SellerController = {
    getSellerOrders,
    updateOrderStatusBySeller
    
}