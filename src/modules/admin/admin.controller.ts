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

export const adminController = {
    getAllUsers
};