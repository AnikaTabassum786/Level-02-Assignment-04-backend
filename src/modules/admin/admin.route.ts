import express,{Router} from 'express'

import auth, { Role } from '../../middlewares/auth'
import { adminController } from './admin.controller'

const router = express.Router()

router.get("/users",auth(Role.ADMIN),adminController.getAllUsers)
router.patch("/users/:userId/status",auth(Role.ADMIN),adminController.toggleBanUser)
router.get("/orders",auth(Role.ADMIN),adminController.getAllOrders)
router.get("/reviews",auth(Role.ADMIN),adminController.getAllReviews)
router.delete("/review/:deleteId",auth(Role.ADMIN),adminController.deleteReview)
router.delete("/orders/:deleteId",auth(Role.ADMIN),adminController.deleteOrder)


export const adminRouter:Router = router