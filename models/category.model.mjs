import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true
        },
        image: { type: String, default: "" }
    },
    { timestamps: true }
)

const Category = mongoose.model("Category", categorySchema)
export default Category
