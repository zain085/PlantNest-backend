import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        label: { type: String, default: "Home" },
        line1: { type: String, required: true },
        city: { type: String, required: true },
        contactNumber: { type: String, required: true },
        isDefault: { type: Boolean, default: false }
    },
    { _id: true }
)

const userSchema = mongoose.Schema(
    {
        username: { type: String, required: true, trim: true, unique: true },
        fullName: { type: String, trim: true, default: "" },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true, enum: ["admin", "user"], lowercase: true, default: "user" },
        contactNumber: { type: String, default: "" },
        age: { type: Number },
        city: { type: String },
        avatar: { type: String, default: null },
        addresses: [addressSchema],
        wishlist: [{ itemType: { type: String, enum: ["Plant", "Accessory"] }, item: { type: mongoose.Schema.Types.ObjectId, refPath: "wishlist.itemType" } }]
    },
    { timestamps: true }
)

const User = mongoose.model("User", userSchema)
export default User
