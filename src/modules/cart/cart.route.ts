import express,{Router} from 'express'
import { cartController } from './cart.controller'
import auth, { Role } from '../../middlewares/auth'

const router = express.Router()

router.post("/",auth(Role.CUSTOMER),cartController.createCart)
router.delete("/:cartId", auth(Role.CUSTOMER), cartController.deleteCart)



export const cartRouter:Router = router