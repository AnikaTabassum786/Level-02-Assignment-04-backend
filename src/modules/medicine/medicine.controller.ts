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
 try{
  const {search, category,manufacturer,minPrice,maxPrice} = req.query

  const searchString = typeof search ==='string' ? search:undefined
  const categoryString=typeof category ==="string" ? category:undefined
  const manufacturerString=typeof manufacturer ==="string" ? manufacturer:undefined
  
  // minPrice= typeof minPrice === "string" ? Number(minPrice) : undefined,
  // maxPrice=typeof maxPrice === "string" ? Number(maxPrice) : undefined

    const result = await medicineService.getAllMedicine({search:searchString, category:categoryString, manufacturer:manufacturerString})
    res.status(201).json(result)
 }
 catch(e){
   res.status(400).json({
    error:"Medicine fetch failed",
    details:e
  })
 }
}


export const MedicineController={
    createMedicine,
    getAllMedicine
}