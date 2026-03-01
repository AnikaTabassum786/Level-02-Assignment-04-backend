import express, { Application } from "express"
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors'
import { medicineRouter } from "./modules/medicine/medicine.router";
import { categoryRouter } from "./modules/category/category.router";
import { orderRouter } from "./modules/order/order.route";
import { sellerRouter } from "./modules/seller/seller.route";
import { cartRouter } from "./modules/cart/cart.route";


const app:Application = express();

app.use(express.json())
app.use("/api",medicineRouter)
app.use("/api/categories",categoryRouter)
app.use("/api/orders",orderRouter)
app.use("/api/seller/orders",sellerRouter)
app.use("/api/cart",cartRouter)

app.use(cors({
origin:process.env.APP_URL || "http://localhost:4000",
credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/",(req,res)=>{
    res.send("Hello World")
})

export default app;