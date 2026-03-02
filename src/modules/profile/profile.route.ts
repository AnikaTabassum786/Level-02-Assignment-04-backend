import express,{Router} from 'express'
import { ProfileController } from './profile.controller'
import auth, { Role } from '../../middlewares/auth'

const router = express.Router()


router.get("/",auth(Role.ADMIN,Role.SELLER,Role.CUSTOMER),ProfileController.getProfileInfoByUser)
router.patch("/",auth(Role.ADMIN,Role.SELLER,Role.CUSTOMER),ProfileController.updateProfileInfo)

export const profileRouter:Router = router