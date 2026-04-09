import { Request, Response } from "express"
import { medicineService } from "./medicine.service"
import paginationHelper from "../../helpers/Pagination"
import { success } from "better-auth/*"



// const createMedicine = async (req: Request, res: Response) => {
//   try {
   
//     const user = req.user
//     if(!user?.id){
//     throw new Error("Unauthorized")
//     }
//     const result = await medicineService.createMedicine(req.body,user?.id as string)
//     res.status(201).json({
//       success:true,
//       message:"Medicine Created Successfully",
//       data:result
//     })
//   }
//   catch (e) {
//     res.status(400).json({
//       error: "Medicine Creation Failed",
//       details: e
//     })
//   }
// }


// const createMedicine = async (req: Request, res: Response) => {
//   try {
//     const user = req.user;
//     console.log(user)
//     if(!user?.id){
//       throw new Error("Unauthorized");
//     }

//     console.log("Request body:", req.body);
//     console.log("Seller ID:", user.id);
//     console.log(req.body)
//     const result = await medicineService.createMedicine(req.body, user.id);
    
//     res.status(201).json({
//       success: true,
//       message: "Medicine Created Successfully",
//       data: result
//     });
//   } catch (e: any) {
//     console.error("Create medicine error:", e);

//     res.status(400).json({
//       error: "Medicine Creation Failed",
//       details: e.message || String(e)  // <-- serialize properly
//     });
//   }
// }

const createMedicine = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    // const file = req.file;
    // const imageURL = file ? `/uploads/${file.filename}` : undefined;

    const file = req.file;

const imageURL = file ? `/uploads/${file.filename}` : undefined;

    const result = await medicineService.createMedicine(
      {
        ...req.body,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        imageURL,
      },
      user.id
    );

    res.status(201).json({
      success: true,
      message: "Medicine Created Successfully",
      data: result,
    });
  } catch (e: any) {
    res.status(400).json({
      error: "Medicine Creation Failed",
      details: e.message || String(e),
    });
  }
};

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
    res.status(200).json({
       success:true,
      message:"Medicine Fetched Successfully",
      data:result
    })
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
    res.status(200).json(result)
  }
  catch (e) {
    res.status(400).json({
      error: "Get medicine by id failed",
      details: e
    })
  }
}

// const updateMedicineById = async (req: Request, res: Response) => {
//   try {
//     const { medicineId } = req.params
//     const user = req.user
//     if (!medicineId) {
//       throw new Error("Medicine ID is required")
//     }
//      const updatedMedicine = await medicineService.updateMedicineById(medicineId as string,user?.id as string,req.body)
//     if (!updatedMedicine) {
//       return res.status(404).json({
//         success: false,
//         message: "Medicine Not Found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Medicine Updated Successfully",
//       data: updatedMedicine,
//     });
//   }
//   catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error?.message || "Something went wrong",
//     })
//   }
// }


const updateMedicineById = async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.params;

    // Ensure medicineId is a string
    if (!medicineId || Array.isArray(medicineId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Medicine ID",
      });
    }

    const user = req.user;
    const data = { ...req.body };

    // if (req.file) {
    //   data.imageURL = `/uploads/${req.file.filename}`;
    // }

    const updatedMedicine = await medicineService.updateMedicineById(
      medicineId,
      user?.id as string,
      data
    );

    res.status(200).json({
      success: true,
      message: "Medicine Updated Successfully",
      data: updatedMedicine,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong",
    });
  }
};


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