import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.ATLAS_URI);

        console.log(`Connected to: ${conn.connection.host}.`);
    } catch (err) {
        console.error(`Connection Error: ${err.message}`);
        throw err;
    }
};