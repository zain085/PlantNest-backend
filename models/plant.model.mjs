import mongoose from "mongoose";

const plantSchema = mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, trim: true, lowercase: true },
        species: { type: String, trim: true },
        description: { type: String, default: "" },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 }, // percentage
        images: [{ type: String }],
        category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Category" },
        stock: { type: Number, default: 0 },
        careLevel: { type: String, enum: ["easy", "moderate", "demanding"], default: "easy" },
        wateringSchedule: { type: String, default: "" },
        sunlight: { type: String, default: "" },
        temperature: { type: String, default: "" },
        avgRating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        sold: { type: Number, default: 0 },
    },
    { timestamps: true }
)

const Plant = mongoose.model("Plant", plantSchema)
export default Plant
