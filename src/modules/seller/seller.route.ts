import express,{Router} from 'express'

import auth, { Role } from '../../middlewares/auth'
import { SellerController } from './seller.controller'

const router = express.Router()
router.get("/",auth(Role.SELLER),SellerController.getSellerOrders)

export const sellerRouter:Router = router