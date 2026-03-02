import express,{Router} from 'express'

import auth, { Role } from '../../middlewares/auth'
import { adminController } from './admin.controller'

const router = express.Router()

router.get("/users",auth(Role.ADMIN),adminController.getAllUsers)
router.get("/orders",auth(Role.ADMIN),adminController.getAllOrders)

export const adminRouter:Router = router