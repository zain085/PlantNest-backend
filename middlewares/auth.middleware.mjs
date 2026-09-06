import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/user.model.mjs"

const verifyToken = asyncHandler(async (request, response, next) => {
    let token = request.cookies?.token

    if (!token && request.headers.authorization?.startsWith("Bearer ")) {
        token = request.headers.authorization.split(" ")[1]
    }

    if (!token) {
        return response.status(401).json({
            message: "Token not provided.",
            success: false
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findById(decoded._id)
        if (!user) {
            return response.status(401).json({ message: "User not found.", success: false })
        }
        request.user = user
        next()
    } catch (err) {
        return response.status(401).json({ message: "Invalid or expired token.", success: false })
    }
})

export default verifyToken
