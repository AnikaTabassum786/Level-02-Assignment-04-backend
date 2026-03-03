
import { Review } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createReview = async (payload: { medicineId: string; rating: number; comment?: string }, userId: string) => {
    console.log("Create Review")
    const { medicineId, rating, comment } = payload

    if (rating < 1 || rating > 5) {
        throw new Error("Rating Must be between 1 to 5 ")
    }

    const medicine = await prisma.medicine.findUnique({
        where: { id: medicineId }
    })

    if (!medicine) {
        throw new Error("Medicine not found")
    }

    const purchased = await prisma.order.findFirst({
        where: {
            customerId: userId,
            orderItems: {
                some: {
                    medicineId: medicineId
                }
            }
        }
    })

    if (!purchased) {
        throw new Error("You can only review purchased medicines")
    }

    const result = await prisma.review.create({
        data: {
            rating,
            comment: comment ?? null,
            userId,
            medicineId
        }

    })

    return result
}

const getAllReviews = async () => {

    const result = await prisma.review.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            medicine: {
                select: {
                    id: true,
                    name: true,
                    price: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return result
}



const updateReview = async (reviewId: string, userId: string, data: Partial<Review>) => {

   
    const review = await prisma.review.findUnique({
        where: {
            id: reviewId
        }
    })

    if (!review) {
        throw new Error("Review is not found")
    }

    if(review.userId !== userId){
        throw new Error("You are not authorized to update this review")
    }

    if (data.rating && (data.rating < 1 || data.rating > 5)) {
        throw new Error("Rating must be between 1 to 5")
    }

    const result = await prisma.review.update({
        where: {
            id: reviewId
        },
        data
    })
    return result
}


export const reviewService = {
    createReview,
    getAllReviews,
    updateReview
};