import express,{Router} from 'express'
import { cartController } from './cart.controller'
import auth, { Role } from '../../middlewares/auth'

const router = express.Router()

router.post("/",auth(Role.CUSTOMER),cartController.createCart)
router.delete("/:cartId", auth(Role.CUSTOMER), cartController.deleteCart)
router.get("/",auth(Role.CUSTOMER),cartController.getAllOwnCartItems)



export const cartRouter:Router = router