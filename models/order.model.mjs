import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        itemType: { type: String, enum: ["Plant", "Accessory"], required: true },
        item: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "items.itemType" },
        name: { type: String, required: true },
        image: { type: String, default: "" },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 }
    },
    { _id: false }
)

const order = mongoose.Schema(
    {
        orderNo: { type: String, required: true, unique: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [orderItemSchema],
        subtotal: { type: Number, required: true },
        shipping: { type: Number, default: 0 },
        total: { type: Number, required: true },
        address: {
            line1: String,
            city: String,
            contactNumber: String
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "on the way", "delivered", "cancelled"],
            default: "pending"
        }
    },
    { timestamps: true }
)

const Order = mongoose.model("Order", order)
export default Order
