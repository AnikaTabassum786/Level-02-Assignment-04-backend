import { Request, Response } from "express"
import { medicineService } from "./medicine.service"

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

export const MedicineController={
    createMedicine
}