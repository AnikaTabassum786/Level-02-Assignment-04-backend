import { Request, Response } from "express"
import { medicineService } from "./medicine.service"
import { success } from "better-auth/*"

const createMedicine = async(req:Request,res:Response)=>{
  try{
    console.log(req.user)
    const result = await medicineService.createMedicine(req.body)
    res.status(201).json(result)
  }
  catch(e){
    res.status(400).json({
        error:"Medicine creation failed",
        details:e
    })
  }
}

const getAllMedicine = async(req: Request, res: Response)=>{
 
   const result = await medicineService.getAllMedicine()
    res.status(201).json(result)
 
}

export const MedicineController={
    createMedicine,
    getAllMedicine
}