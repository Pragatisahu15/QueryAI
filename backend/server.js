import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err =>
        console.log("MongoDB connection failed, continuing without DB:", err.message)
    );

//start server
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});