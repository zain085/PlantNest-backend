import asyncHandler from "express-async-handler";
import Cart from "../models/cart.model.mjs";
import Order from "../models/order.model.mjs";
import Plant from "../models/plant.model.mjs";
import Accessory from "../models/accessories.model.mjs";

const generateOrderNo = () => `PN-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`

const checkout = asyncHandler(async (request, response) => {
    const { address } = request.body

    const cart = await Cart.findOne({ user: request.user._id }).populate("items.item")

    if (!cart || cart.items.length === 0) {
        return response.status(400).json({ message: "Cart is empty.", success: false })
    }

    const items = cart.items.map(i => ({
        itemType: i.itemType,
        item: i.item._id,
        name: i.item.name,
        image: i.item.images?.[0] || "",
        price: i.item.discount ? Math.round(i.item.price - (i.item.price * i.item.discount / 100)) : i.item.price,
        quantity: i.quantity
    }))

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shipping = subtotal > 100 ? 0 : 10
    const total = subtotal + shipping

    const order = await Order.create({
        orderNo: generateOrderNo(),
        user: request.user._id,
        items,
        subtotal,
        shipping,
        total,
        address
    })

    for (const i of cart.items) {
        const Model = i.itemType === "Plant" ? Plant : Accessory
        await Model.findByIdAndUpdate(i.item._id, { $inc: { stock: -i.quantity, sold: i.quantity } })
    }

    cart.items = []
    await cart.save()

    response.status(201).json({ message: "Order placed successfully.", success: true, order })
})

const myOrders = asyncHandler(async (request, response) => {
    const orders = await Order.find({ user: request.user._id }).sort({ createdAt: -1 })
    response.status(200).json({ orders, success: true })
})

const cancelOrder = asyncHandler(async (request, response) => {
    const order = await Order.findById(request.params.orderId)
    if (!order) {
        return response.status(404).json({ message: "Order not found.", success: false })
    }
    if (order.user.toString() !== request.user._id.toString()) {
        return response.status(403).json({ message: "Not authorized.", success: false })
    }
    if (["delivered", "cancelled"].includes(order.status)) {
        return response.status(400).json({ message: `Order already ${order.status}.`, success: false })
    }

    order.status = "cancelled"
    await order.save()

    response.status(200).json({ message: "Order cancelled.", success: true, order })
})

const getAllOrders = asyncHandler(async (request, response) => {
    const filter = {}
    if (request.query.status) filter.status = request.query.status

    const orders = await Order.find(filter).populate("user", "username email").sort({ createdAt: -1 })
    response.status(200).json({ orders, success: true })
})

const updateOrderStatus = asyncHandler(async (request, response) => {
    const { status } = request.body
    const order = await Order.findById(request.params.orderId)
    if (!order) {
        return response.status(404).json({ message: "Order not found.", success: false })
    }

    order.status = status
    await order.save()

    response.status(200).json({ message: "Order status updated.", success: true, order })
})

export { checkout, myOrders, cancelOrder, getAllOrders, updateOrderStatus }
