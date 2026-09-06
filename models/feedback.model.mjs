import mongoose from "mongoose";

const siteFeedback = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        subject: { type: String, default: "General Feedback" },
        message: { type: String, required: true },
        read: { type: Boolean, default: false }
    },
    { timestamps: true }
)

const SiteFeedback = mongoose.model("SiteFeedback", siteFeedback)
export default SiteFeedback
