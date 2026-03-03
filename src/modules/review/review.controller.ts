import { Request, Response } from "express"
import { reviewService } from "./review.service"



const createReview = async(req: Request, res: Response)=>{
    try {
      
       const user = req.user
       if(!user?.id){
       throw new Error("Unauthorized")
       }
       const result = await reviewService.createReview(req.body,user?.id as string)
       res.status(201).json({
         success:true,
         message:"Review Created Successfully",
         data:result
       })
     }
     catch (e:any) {
       res.status(400).json({
         error: "Review Creation Failed",
         details: e,
          message: e.message || "Review Creation Failed"
       })
     }
}



const getAllReviews=async(req: Request, res: Response)=>{
 try{
   const result  = await reviewService.getAllReviews()
   res.status(200).json({
         success:true,
         message:"Review Fetched Successfully",
         data:result
       })
 }
 catch(error:any){
res.status(400).json({
         error: "Review Creation Failed",
         details: error,
          message: error.message || "Review Fetched Failed"
       })
 }
}



const updateReview=async(req: Request, res: Response)=>{
 try{
    const user = req.user
    const {reviewId} = req.params
    if (!user?.id) {
            throw new Error("Unauthorized")
        }
   const result = await reviewService.updateReview(reviewId as string,user.id as string, req.body)
   res.status(201).json({
            success: true,
            message: "Updated  Successfully",
            data: result
        })
 }
 catch(error: any){
res.status(500).json({
            success: false,
            message: error.message || "Update Failed",
        }) 
 }
}



export const reviewController = {
    createReview,
    getAllReviews,
    updateReview
}