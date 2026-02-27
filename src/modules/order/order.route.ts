import express,{Router} from 'express'
import { OrderController } from './order.controller'
import auth, { Role } from '../../middlewares/auth'

const router = express.Router()

router.post("/",auth(Role.CUSTOMER) ,OrderController.createOrder)

export const orderRouter:Router = router