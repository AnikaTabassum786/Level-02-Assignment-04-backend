import express,{Router} from 'express'
import { cartController } from './cart.controller'
import auth, { Role } from '../../middlewares/auth'

const router = express.Router()

router.post("/",auth(Role.CUSTOMER),cartController.createCart)
// router.delete("/:cartId", auth(Role.CUSTOMER), cartController.deleteCart)
router.get("/",auth(Role.CUSTOMER),cartController.getAllOwnCartItems)
router.delete("/item/:cartItemId", auth(Role.CUSTOMER), cartController.deleteCartItem);



export const cartRouter:Router = router