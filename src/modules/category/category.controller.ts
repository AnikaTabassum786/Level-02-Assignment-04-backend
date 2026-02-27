import { Request, Response } from "express";
import { categoryService } from "./category.service";


const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Category creation failed",
      error,
    });
  }
};

const getAllCategory=async(req: Request, res: Response)=>{
   try {
    const result = await categoryService.getAllCategory()
    return res.status(201).json({
      success:true,
      message:"Category fetched successfully",
      data:result
    })
  }
  catch (error:any) {
    return res.status(500).json({
     success:false,
     message:error?.message || "Category fetch failed"
    })
  }
}

export const categoryController = {
  createCategory,
  getAllCategory
};