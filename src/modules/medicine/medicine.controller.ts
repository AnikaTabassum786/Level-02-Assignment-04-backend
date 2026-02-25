import { Request, Response } from "express"
import { medicineService } from "./medicine.service"


const createMedicine = async (req: Request, res: Response) => {
  try {
    console.log(req.user)
    const result = await medicineService.createMedicine(req.body)
    res.status(201).json(result)
  }
  catch (e) {
    res.status(400).json({
      error: "Medicine creation failed",
      details: e
    })
  }
}

const getAllMedicine = async (req: Request, res: Response) => {
  try {
    const { search, category, manufacturer,price, minPrice, maxPrice } = req.query

    const searchString = typeof search === 'string' ? search : undefined
    const categoryString = typeof category === "string" ? category : undefined
    const manufacturerString = typeof manufacturer === "string" ? manufacturer : undefined
    const parsedPrice= typeof price === "string" ? Number(price) : undefined
    const parsedMinPrice = typeof minPrice === "string" ? Number(minPrice) : undefined
    const parsedMaxPrice = typeof maxPrice === "string" ? Number(maxPrice) : undefined

    const result = await medicineService.getAllMedicine({
      search: searchString, category: categoryString, manufacturer: manufacturerString,price:parsedPrice,minPrice: parsedMinPrice, maxPrice:parsedMaxPrice
    })
    res.status(201).json(result)
  }
  catch (e) {
    res.status(400).json({
      error: "Medicine fetch failed",
      details: e
    })
  }
}


export const MedicineController = {
  createMedicine,
  getAllMedicine
}