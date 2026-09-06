import express from "express"
import verifyToken from "../middlewares/auth.middleware.mjs"
import { getProductReviews, addReview } from "../controllers/review.controller.mjs"

const reviewRouter = express.Router()

reviewRouter.get(`/product/:productId`, getProductReviews)
reviewRouter.post(`/`, verifyToken, addReview)

export default reviewRouter
