import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.config.mjs";
import errorHandler from "./middlewares/error.middleware.mjs";

import authRouter from "./routes/auth.routes.mjs";
import categoryRouter from "./routes/category.route.mjs";
import plantRouter from "./routes/plant.route.mjs";
import accessoryRouter from "./routes/accessory.route.mjs";
import cartRouter from "./routes/cart.route.mjs";
import orderRouter from "./routes/order.route.mjs";
import reviewRouter from "./routes/review.route.mjs";
import feedbackRouter from "./routes/feedback.route.mjs";
import userRouter from "./routes/user.route.mjs";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/plant", plantRouter);
app.use("/api/v1/accessory", accessoryRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/feedback", feedbackRouter);
app.use("/api/v1/user", userRouter);

app.get("/", (request, response) => {
    response.json({
        message: "PlantNest API is running.",
    });
});

app.use(errorHandler);

await connectDB();

export default app;