import mongoose from "mongoose";

const review = mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        plant: { type: mongoose.Schema.Types.ObjectId, ref: "Plant" },
        accessory: { type: mongoose.Schema.Types.ObjectId, ref: "Accessory" }
    },
    { timestamps: true }
)

const Review = mongoose.model("Review", review)
export default Review
