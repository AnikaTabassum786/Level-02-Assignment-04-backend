import express,{Router} from 'express'

import auth, { Role } from '../../middlewares/auth'
import { adminController } from './admin.controller'

const router = express.Router()

router.get("/users",auth(Role.ADMIN),adminController.getAllUsers)
router.get("/users/:userId/ban",auth(Role.ADMIN),adminController.toggleBanUser)
router.get("/orders",auth(Role.ADMIN),adminController.getAllOrders)
router.get("/reviews",auth(Role.ADMIN),adminController.getAllReviews)
router.delete("/review/:deleteId",auth(Role.ADMIN),adminController.deleteReview)


export const adminRouter:Router = router