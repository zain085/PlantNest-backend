import asyncHandler from "express-async-handler";
import Review from "../models/review.model.mjs";
import Plant from "../models/plant.model.mjs";
import Accessory from "../models/accessories.model.mjs";

const recalcRating = async (itemType, itemId) => {
    const filterKey = itemType === "Plant" ? "plant" : "accessory"
    const reviews = await Review.find({ [filterKey]: itemId })
    const numReviews = reviews.length
    const avgRating = numReviews ? reviews.reduce((s, r) => s + r.rating, 0) / numReviews : 0

    const Model = itemType === "Plant" ? Plant : Accessory
    await Model.findByIdAndUpdate(itemId, { avgRating: avgRating.toFixed(1), numReviews })
}

const getProductReviews = asyncHandler(async (request, response) => {
    const { productId } = request.params
    const reviews = await Review.find({ $or: [{ plant: productId }, { accessory: productId }] })
        .populate("user", "username avatar")
        .sort({ createdAt: -1 })

    response.status(200).json({ reviews, success: true })
})

const addReview = asyncHandler(async (request, response) => {
    const { title, description, rating, itemType, itemId } = request.body

    if (!title || !description || !rating || !itemType || !itemId) {
        return response.status(400).json({ message: "Input all fields.", success: false })
    }

    const review = await Review.create({
        title,
        description,
        rating,
        user: request.user._id,
        plant: itemType === "Plant" ? itemId : undefined,
        accessory: itemType === "Accessory" ? itemId : undefined
    })

    await recalcRating(itemType, itemId)

    const populated = await review.populate("user", "username avatar")

    response.status(201).json({ message: "Review submitted.", success: true, review: populated })
})

export { getProductReviews, addReview }
