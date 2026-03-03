import express,{Router} from 'express'
import { reviewController } from './review.controller'
import auth, { Role } from '../../middlewares/auth'

const router = express.Router()
router.post("/",auth(Role.CUSTOMER),reviewController.createReview)


export const reviewRouter:Router = router