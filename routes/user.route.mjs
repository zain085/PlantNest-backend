import express from "express"
import verifyToken from "../middlewares/auth.middleware.mjs"
import checkRole from "../middlewares/role.middleware.mjs"
import { getAllUsers, toggleWishlist, getWishlist, addAddress, deleteAddress } from "../controllers/user.controller.mjs"

const userRouter = express.Router()

userRouter.get(`/admin/all`, verifyToken, checkRole("admin"), getAllUsers)
userRouter.get(`/wishlist`, verifyToken, getWishlist)
userRouter.post(`/wishlist/toggle`, verifyToken, toggleWishlist)
userRouter.post(`/address`, verifyToken, addAddress)
userRouter.delete(`/address/:addressId`, verifyToken, deleteAddress)

export default userRouter
