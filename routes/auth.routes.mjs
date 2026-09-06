import express from "express"
import { login, logout, profile, register } from "../controllers/auth.controller.mjs"
import verifyToken from "../middlewares/auth.middleware.mjs"
import upload from "../middlewares/multer.middleware.mjs"
import { updateProfile, changePassword } from "../controllers/user.controller.mjs"

const authRouter = express.Router()

authRouter.post(`/register`, upload.single("avatar"), register)
authRouter.post(`/login`, login)
authRouter.post(`/logout`, logout)
authRouter.get(`/profile`, verifyToken, profile)
authRouter.get(`/me`, verifyToken, profile)
authRouter.put(`/update-profile`, verifyToken, updateProfile)
authRouter.put(`/change-password`, verifyToken, changePassword)

export default authRouter
