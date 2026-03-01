import { Request, Response } from "express";
import { cartService } from "./cart.service";

const createCart = async (req: Request, res: Response) => {
  try {
    const user = req.user
    const result = await cartService.createCart(req.body,user!.id as string);

    res.status(201).json({
      success: true,
      message: "Items added to Cart successfully",
      data: result,
    });
  } catch (error:any) {
    res.status(400).json({
      success: false,
      message: error.message||"Cart creation failed",
      error,
    });
  }
};


export const cartController = {
  createCart,
//   getAllCategory
};
