import express,{Router} from 'express'
import { reviewController } from './review.controller'
import auth, { Role } from '../../middlewares/auth'

const router = express.Router()
router.post("/",auth(Role.CUSTOMER),reviewController.createReview)
router.get("/",reviewController.getAllReviews)
router.patch("/:reviewId",auth(Role.CUSTOMER),reviewController.updateReview)
router.delete("/:reviewId",auth(Role.CUSTOMER),reviewController.deleteReview)


export const reviewRouter:Router = router