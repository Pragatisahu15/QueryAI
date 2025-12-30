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

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    } catch (err) {
        console.log("Failed to connect with Db", err);
    }
};

startServer();


// app.listen(PORT, () => {
//     console.log(`Server running on ${PORT}`);
//     connectDB();
// });

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("MongoDB connected");
//     } catch (err) {
//         console.log("Failed to connect with Db", err);
//     }
// };


// app.post("/test", async (req, res) => {
//     const userMessage = req.body.message;
//     try {
//         const data = await groq.chat.completions.create({
//             model: "llama-3.1-8b-instant",
//             messages: [
//                 { role: "user", content: userMessage }
//             ]
//         });

//         console.log(data.choices[0].message.content);
//         res.send(data.choices[0].message.content);

//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error testing AI");
//     }
// });

