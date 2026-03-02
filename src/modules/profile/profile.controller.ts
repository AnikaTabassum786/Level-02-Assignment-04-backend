import { Request, Response } from "express"
import { ProfileService } from "./profile.service"


const getProfileInfoByUser=async(req: Request, res: Response)=>{
   try{
         const user = req.user
        if(!user?.id){
throw new Error("Unauthorized")
        }
         const result = await ProfileService.getProfileInfoByUser(user.id as string)
                 res.status(200).json({
                     success:true,
                     message:"Profile Fetched Successfully",
                     data:result
                 })
   }
   catch(error:any){
 res.status(500).json({
        success:false,
         message: error.message || "Fetch Profile Information Failed",
    })
   }
}

export const ProfileController = {
    getProfileInfoByUser
}