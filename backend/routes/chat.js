import express from "express";
import Thread from "../models/Thread.js";
import getGroqAPIresponses from "../utils/aiService.js";
import authMiddleware from "../middleware/authMiddleware.js";

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
router.get("/thread", authMiddleware, async (req, res) => {
    try {
        const threads = await Thread.find({userId: req.user.userId}).sort({ updatedAt: -1 }); // userId: req.user.userId: give ONLY logged-in user's threads
        //-1 means data in descending order on the basis of this property //descending order of updatedAt...most recent data on top
        res.json(threads); //returning all threads
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

//GET SINGLE THREAD: get particular thread using threadId
router.get("/thread/:threadId",  authMiddleware, async (req, res) => {
    const { threadId } = req.params; //fething threadId from param
    try {
        const thread = await Thread.findOne({ threadId,  userId: req.user.userId }); //fething particular thread from all thread using Id; thread(means: sequence of chat) // userId: req.user.userId: find thread ONLY if it belongs to current user; thread IDs can leak, another user could access chats, now: threadId + userId both required(authentication alone is NOT enough You must also verify ownership)
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
router.delete("/thread/:threadId",  authMiddleware, async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId,  userId: req.user.userId }); // delete ONLY if current user owns thread
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
router.post("/chat",  authMiddleware, async (req, res) => {
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
                userId: req.user.userId,
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