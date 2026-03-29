import express,{Router} from 'express'

import auth, { Role } from '../../middlewares/auth'
import { SellerController } from './seller.controller'

const router = express.Router()
router.get("/orders/",auth(Role.SELLER),SellerController.getSellerOrders)
router.patch("/orders/:orderId",auth(Role.SELLER),SellerController.updateOrderStatusBySeller)
router.put("/medicines/:medicineId",auth(Role.SELLER),SellerController.updateMedicineBySeller)


export const sellerRouter:Router = router