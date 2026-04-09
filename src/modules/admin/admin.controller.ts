import { Request, Response } from "express";
import { adminService } from "./admin.service";



const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await adminService.getAllUsers()
        res.status(200).json({
            success: true,
            message: "Users Fetched Successfully",
            data: result
        })
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Users Fetch Failed",
        })
    }
}


const getAllOrders = async (req: Request, res: Response) => {
    try {
        
        const result = await adminService.getAllOrders()
        res.status(200).json({
            success: true,
            message: "Orders Fetched Successfully",
            data: result
        })
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Orders Fetch Failed",
        })
    }
}

const toggleBanUser = async(req: Request, res: Response)=>{
 try{
    const {userId} = req.params

    if(!userId){
       throw new Error ("User ID is required")
    }

    const result = await adminService.toggleBanUser(userId as string)

    return res.status(200).json({
        success:true,
        message:result.isBanned ?"User banned successfully":"User unbanned successfully",
        data:result
        
    })
 }
 catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed",
        })
    }
}

const getAllReviews=async(req: Request, res: Response)=>{
 try {
        
        const result = await adminService.getAllReviews()
        res.status(200).json({
            success: true,
            message: "Reviews Fetched Successfully",
            data: result
        })
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Reviews Fetch Failed",
        })
    }
}

const deleteReview= async(req: Request, res: Response)=>{
try {
        const {deleteId} = req.params
        const result = await adminService.deleteReview(deleteId as string)
        res.status(200).json({
            success: true,
            message: "Review Deleted Successfully",
            data: result
        })
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Reviews Deleted Failed",
        })
    }
}


const deleteOrder= async(req: Request, res: Response)=>{
try {
        const {deleteId} = req.params
        const result = await adminService.deleteOrder(deleteId as string)
        res.status(200).json({
            success: true,
            message: "Review Deleted Successfully",
            data: result
        })
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Reviews Deleted Failed",
        })
    }
}






export const adminController = {
    getAllUsers,
    getAllOrders,
    toggleBanUser,
    getAllReviews,
    deleteReview,
    deleteOrder
    
};