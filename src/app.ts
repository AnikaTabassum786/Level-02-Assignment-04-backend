
import fs from "fs";
import path from "path";

const uploadsDir = path.join(__dirname, "uploads");

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

import express, { Application } from "express"
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors'
import { medicineRouter } from "./modules/medicine/medicine.router";
import { categoryRouter } from "./modules/category/category.router";
import { orderRouter } from "./modules/order/order.route";
import { sellerRouter } from "./modules/seller/seller.route";
import { cartRouter } from "./modules/cart/cart.route";
import { profileRouter } from "./modules/profile/profile.route";
import { adminRouter } from "./modules/admin/admin.route";
import { reviewRouter } from "./modules/review/review.route";



const app:Application = express();

app.use(express.json())

app.use(cors({
origin:process.env.APP_URL || "http://localhost:3000",
credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api",medicineRouter)
app.use("/api/categories",categoryRouter)
app.use("/api/orders",orderRouter)
app.use("/api/seller/orders",sellerRouter)
app.use("/api/cart",cartRouter)
app.use("/api/profile",profileRouter)
app.use("/api/admin",adminRouter)
app.use("/api/review",reviewRouter)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/",(req,res)=>{
    res.send("Hello World")
})

export default app;