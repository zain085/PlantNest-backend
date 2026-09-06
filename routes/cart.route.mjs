import express from "express"
import verifyToken from "../middlewares/auth.middleware.mjs"
import { getCart, addToCart, updateCartItem, removeFromCart } from "../controllers/cart.controller.mjs"

const cartRouter = express.Router()

cartRouter.get(`/`, verifyToken, getCart)
cartRouter.post(`/add`, verifyToken, addToCart)
cartRouter.put(`/update/:itemId`, verifyToken, updateCartItem)
cartRouter.delete(`/remove/:itemId`, verifyToken, removeFromCart)

export default cartRouter
