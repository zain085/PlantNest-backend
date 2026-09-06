import express from "express"
import verifyToken from "../middlewares/auth.middleware.mjs"
import checkRole from "../middlewares/role.middleware.mjs"
import { checkout, myOrders, cancelOrder, getAllOrders, updateOrderStatus } from "../controllers/order.controller.mjs"

const orderRouter = express.Router()

orderRouter.post(`/checkout`, verifyToken, checkout)
orderRouter.get(`/my-orders`, verifyToken, myOrders)
orderRouter.put(`/cancel/:orderId`, verifyToken, cancelOrder)
orderRouter.get(`/admin/all`, verifyToken, checkRole("admin"), getAllOrders)
orderRouter.put(`/admin/status/:orderId`, verifyToken, checkRole("admin"), updateOrderStatus)

export default orderRouter
