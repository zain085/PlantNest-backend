import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/user.model.mjs";

const getAllUsers = asyncHandler(async (request, response) => {
    const users = await User.find().select("-password").sort({ createdAt: -1 })
    response.status(200).json({ users, success: true })
})

const updateProfile = asyncHandler(async (request, response) => {
    const { fullName, contactNumber, age, city } = request.body

    const user = await User.findByIdAndUpdate(
        request.user._id,
        { fullName, contactNumber, age, city },
        { new: true }
    ).select("-password")

    response.status(200).json({ message: "Profile updated.", success: true, user })
})

const changePassword = asyncHandler(async (request, response) => {
    const { currentPassword, newPassword } = request.body

    const user = await User.findById(request.user._id)
    const matches = await bcrypt.compare(currentPassword, user.password)

    if (!matches) {
        return response.status(401).json({ message: "Current password is incorrect.", success: false })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    response.status(200).json({ message: "Password changed successfully.", success: true })
})

const toggleWishlist = asyncHandler(async (request, response) => {
    const { itemType, itemId } = request.body

    const user = await User.findById(request.user._id)
    const existingIndex = user.wishlist.findIndex(
        w => w.item.toString() === itemId && w.itemType === itemType
    )

    if (existingIndex > -1) {
        user.wishlist.splice(existingIndex, 1)
    } else {
        user.wishlist.push({ itemType, item: itemId })
    }

    await user.save()

    response.status(200).json({ message: "Wishlist updated.", success: true, wishlist: user.wishlist })
})

const getWishlist = asyncHandler(async (request, response) => {
    const user = await User.findById(request.user._id).populate("wishlist.item")
    response.status(200).json({ wishlist: user.wishlist, success: true })
})

const addAddress = asyncHandler(async (request, response) => {
    const user = await User.findById(request.user._id)
    user.addresses.push(request.body)
    await user.save()
    response.status(201).json({ message: "Address added.", success: true, addresses: user.addresses })
})

const deleteAddress = asyncHandler(async (request, response) => {
    const user = await User.findById(request.user._id)
    user.addresses = user.addresses.filter(a => a._id.toString() !== request.params.addressId)
    await user.save()
    response.status(200).json({ message: "Address removed.", success: true, addresses: user.addresses })
})

export { getAllUsers, updateProfile, changePassword, toggleWishlist, getWishlist, addAddress, deleteAddress }
