import express from "express";
import Thread from "../models/Thread.js";
import getGroqAPIresponses from "../utils/aiService.js";

const router = express.Router();

// TEST ROUTE
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing New Thread"
            // threadId: Date.now().toString(), // unique every time
            // title: "Testing New Thread"
        });

        const response = await thread.save();
        res.status(200).json(response);  //sending res from API call

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save in DB" });
    }
});

// GET ALL THREADS
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 }); //-1 means data in descending order on the basis of this property
        //descending order of updatedAt...most recent data on top
        res.json(threads); //returning all threads
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

//GET SINGLE THREAD: get particular thread using threadId
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params; //fething threadId from param
    try {
        const thread = await Thread.findOne({ threadId }); //fething particular thread from all thread using Id; thread(means: sequence of chat)
        if (!thread) {
            res.status(404).json({ error: "Thread is not found" })
        }
        res.json(thread.messages); //only need msg to display
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
})

// DELETE THREAD
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });
        if (!deletedThread) {
            res.status(404).json({ error: "Thread not found" })
        }
        res.status(200).json({ success: "Thread deleted successfully" })

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

// CHAT ROUTE 
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" });
    }

    try {
        //  Get AI response FIRST (independent of DB)
        const assistantReply = await getGroqAPIresponses(message);

        //  Send response immediately (VERY IMPORTANT)
        res.json({ reply: assistantReply });

        //  DB work happens AFTER response (non-blocking)
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                messages: [
                    { role: "user", content: message },
                    { role: "assistant", content: assistantReply }
                ]
            });
        } else {
            thread.messages.push(
                { role: "user", content: message },
                { role: "assistant", content: assistantReply }
            );
            thread.updatedAt = new Date();
        }

        thread.save().catch(err => {
            console.log("DB slow / skipped save:", err.message);
        });

    } catch (err) {
        console.log(err);

        // If response already sent, do nothing
        if (!res.headersSent) {
            res.status(500).json({ error: "something went wrong" });
        }
    }
});

export default router;