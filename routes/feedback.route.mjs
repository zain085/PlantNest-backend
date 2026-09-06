import express from "express"
import verifyToken from "../middlewares/auth.middleware.mjs"
import checkRole from "../middlewares/role.middleware.mjs"
import { submitFeedback, getAllFeedback, markFeedbackRead } from "../controllers/feedback.controller.mjs"

const feedbackRouter = express.Router()

feedbackRouter.post(`/`, submitFeedback)
feedbackRouter.get(`/`, verifyToken, checkRole("admin"), getAllFeedback)
feedbackRouter.put(`/:id/read`, verifyToken, checkRole("admin"), markFeedbackRead)

export default feedbackRouter
