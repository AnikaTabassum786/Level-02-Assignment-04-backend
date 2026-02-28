import { Request, Response } from "express"
import { SellerService } from "./seller.service"
import { Role } from "../../../generated/prisma/enums"


const getSellerOrders = async (req: Request, res: Response) => {
    try {
        if(!req.user || req.user.role !== Role.SELLER){
            throw new Error("Unauthorized")
        }
        const user = req.user
        console.log("Seller is",user)
        const result = await SellerService.getSellerOrders(user!.id as string)
        res.status(200).json(result)
    }
    catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Order Fetch failed",
        })
    }
}

export const SellerController = {
    getSellerOrders
}