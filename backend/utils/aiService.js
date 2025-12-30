import "dotenv/config";
import Groq from "groq-sdk";


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const getGroqAPIresponses = async (message) => {
    // const userMessage = req.body.message;
    try {
        const data = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "user", content: message }
            ]
        });

        return data.choices[0].message.content; //reply 

    } catch (err) {
        console.error("Groq API error:", err);
        return "Sorry, I couldn't generate a response.";
    }
}

export default getGroqAPIresponses;