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

const deleteCart = async(req:Request,res:Response)=>{
  try{
    const user = req.user
     if (!user){
       throw new Error("Unauthorized")
    }
     const {cartId} = req.params

     const result = await cartService.deleteCart(cartId as string,user!.id as string,user.role as string)
     res.status(201).json({
      success: true,
      message: "Items deleted successfully",
      data: result,
    });
  }
catch (error) {
    res.status(400).json({
      error: error,
      details: error
    })
  }
}


export const cartController = {
  createCart,
   deleteCart
};
