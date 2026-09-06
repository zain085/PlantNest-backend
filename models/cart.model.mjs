import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        itemType: { type: String, enum: ["Plant", "Accessory"], required: true },
        item: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "items.itemType" },
        quantity: { type: Number, required: true, default: 1, min: 1 }
    },
    { _id: true }
)

const cart = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        items: [cartItemSchema]
    },
    { timestamps: true }
)

const Cart = mongoose.model("Cart", cart)
export default Cart
