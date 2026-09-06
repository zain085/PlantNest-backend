import mongoose from "mongoose";

const accessory = mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Category" },
        images: [String],
        description: { type: String, required: true },
        stock: { type: Number, default: 0 },
        avgRating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        sold: { type: Number, default: 0 },
    },
    { timestamps: true }
)

const Accessory = mongoose.model("Accessory", accessory)
export default Accessory
