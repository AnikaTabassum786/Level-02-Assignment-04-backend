import { Request, Response } from "express"
import { medicineService } from "./medicine.service"
import paginationHelper from "../../helpers/Pagination"
import { success } from "better-auth/*"


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
    const { search, category, manufacturer, price, minPrice, maxPrice } = req.query

    const searchString = typeof search === 'string' ? search : undefined
    const categoryString = typeof category === "string" ? category : undefined
    const manufacturerString = typeof manufacturer === "string" ? manufacturer : undefined
    const parsedPrice = typeof price === "string" ? Number(price) : undefined
    const parsedMinPrice = typeof minPrice === "string" ? Number(minPrice) : undefined
    const parsedMaxPrice = typeof maxPrice === "string" ? Number(maxPrice) : undefined
    const { page, limit, skip } = paginationHelper(req.query)


    const result = await medicineService.getAllMedicine({
      search: searchString, category: categoryString, manufacturer: manufacturerString, price: parsedPrice,
      minPrice: parsedMinPrice, maxPrice: parsedMaxPrice, page, limit, skip
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

const getMedicineById = async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.params
    if (!medicineId) {
      throw new Error("Medicine ID is required")
    }
    const result = await medicineService.getMedicineById(medicineId as string)
    res.status(201).json(result)
  }
  catch (e) {
    res.status(400).json({
      error: "Get medicine by id failed",
      details: e
    })
  }
}

const updateMedicineById = async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.params
    if (!medicineId) {
      throw new Error("Medicine ID is required")
    }
     const updatedMedicine = await medicineService.updateMedicineById(medicineId as string,req.body)
    if (!updatedMedicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: updatedMedicine,
    });
  }
  catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong",
    })
  }
}

const deleteMedicineById = async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.params
    if (!medicineId) {
      throw new Error("Medicine ID is required")
    }
    const deletedMedicine = await medicineService.deleteMedicineById(medicineId as string)

    if (!deletedMedicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully"
    })
  }
  catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong",
    })
  }
}


export const MedicineController = {
  createMedicine,
  getAllMedicine,
  getMedicineById,
  updateMedicineById,
  deleteMedicineById
}