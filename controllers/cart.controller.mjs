import asyncHandler from "express-async-handler";
import Cart from "../models/cart.model.mjs";
import Plant from "../models/plant.model.mjs";
import Accessory from "../models/accessories.model.mjs";

const populateCart = (cartQuery) => cartQuery.populate({
    path: "items.item",
    select: "name price discount images stock"
})

const getCart = asyncHandler(async (request, response) => {
    let cart = await populateCart(Cart.findOne({ user: request.user._id }))

    if (!cart) {
        cart = await Cart.create({ user: request.user._id, items: [] })
    }

    response.status(200).json({ cart, success: true })
})

const addToCart = asyncHandler(async (request, response) => {
    const { itemType, itemId, quantity } = request.body

    if (!itemType || !itemId) {
        return response.status(400).json({ message: "itemType and itemId are required.", success: false })
    }

    const Model = itemType === "Plant" ? Plant : Accessory
    const product = await Model.findById(itemId)
    if (!product) {
        return response.status(404).json({ message: "Product not found.", success: false })
    }

    let cart = await Cart.findOne({ user: request.user._id })
    if (!cart) {
        cart = await Cart.create({ user: request.user._id, items: [] })
    }

    const existingItem = cart.items.find(i => i.item.toString() === itemId && i.itemType === itemType)
    if (existingItem) {
        existingItem.quantity += Number(quantity) || 1
    } else {
        cart.items.push({ itemType, item: itemId, quantity: Number(quantity) || 1 })
    }

    await cart.save()
    const populated = await populateCart(Cart.findById(cart._id))

    response.status(200).json({ message: "Added to cart.", success: true, cart: populated })
})

const updateCartItem = asyncHandler(async (request, response) => {
    const { quantity } = request.body
    const { itemId } = request.params

    const cart = await Cart.findOne({ user: request.user._id })
    if (!cart) {
        return response.status(404).json({ message: "Cart not found.", success: false })
    }

    const item = cart.items.id(itemId)
    if (!item) {
        return response.status(404).json({ message: "Cart item not found.", success: false })
    }

    if (Number(quantity) <= 0) {
        item.deleteOne()
    } else {
        item.quantity = Number(quantity)
    }

    await cart.save()
    const populated = await populateCart(Cart.findById(cart._id))

    response.status(200).json({ message: "Cart updated.", success: true, cart: populated })
})

const removeFromCart = asyncHandler(async (request, response) => {
    const cart = await Cart.findOne({ user: request.user._id })
    if (!cart) {
        return response.status(404).json({ message: "Cart not found.", success: false })
    }

    cart.items = cart.items.filter(i => i._id.toString() !== request.params.itemId)
    await cart.save()
    const populated = await populateCart(Cart.findById(cart._id))

    response.status(200).json({ message: "Item removed.", success: true, cart: populated })
})

export { getCart, addToCart, updateCartItem, removeFromCart }
