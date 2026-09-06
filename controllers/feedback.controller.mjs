import asyncHandler from "express-async-handler";
import SiteFeedback from "../models/feedback.model.mjs";

const submitFeedback = asyncHandler(async (request, response) => {
    const { name, email, subject, message } = request.body

    if (!name || !email || !message) {
        return response.status(400).json({ message: "Input all fields.", success: false })
    }

    const feedback = await SiteFeedback.create({ name, email, subject, message })
    response.status(201).json({ message: "Feedback submitted. Thank you!", success: true, feedback })
})

const getAllFeedback = asyncHandler(async (request, response) => {
    const feedback = await SiteFeedback.find().sort({ createdAt: -1 })
    response.status(200).json({ feedback, success: true })
})

const markFeedbackRead = asyncHandler(async (request, response) => {
    const feedback = await SiteFeedback.findByIdAndUpdate(request.params.id, { read: true }, { new: true })
    response.status(200).json({ message: "Marked as read.", success: true, feedback })
})

export { submitFeedback, getAllFeedback, markFeedbackRead }
