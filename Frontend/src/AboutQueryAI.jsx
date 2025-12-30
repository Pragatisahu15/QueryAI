import "./AboutQueryAI.css";
import { useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { useContext } from "react";

function AboutQueryAI({ onClose }) {
    const { theme } = useContext(MyContext);

    useEffect(() => {
        const escHandler = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", escHandler);
        return () => window.removeEventListener("keydown", escHandler);
    }, [onClose]);

    return (
        <div className="aboutOverlay" onClick={onClose}>
            <div
                className={`aboutModal ${theme}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="closeBtn" onClick={onClose}>✕</button>

                <h2>About QueryAI</h2>

                <p className="aboutIntro">
                    QueryAI is a full-stack AI chat application designed to simulate
                    real-world conversational systems with persistent, thread-based history.
                </p>

                <h3>Key Features</h3>
                <ul>
                    <li>Thread-based persistent chat history</li>
                    <li>Real-time AI responses using LLM APIs</li>
                    <li>Responsive UI (desktop & mobile)</li>
                    <li>Light / Dark theme support</li>
                    <li>Keyboard accessibility (Enter, Escape)</li>
                </ul>

                <h3>Tech Stack</h3>
                <ul>
                    <li><b>Frontend:</b> React, Context API, CSS</li>
                    <li><b>Backend:</b> Node.js, Express, REST APIs</li>
                    <li><b>Database:</b> MongoDB (thread-based storage)</li>
                    <li><b>AI:</b> LLM API integration</li>
                </ul>

                <p className="footerText">
                    Built as a learning-focused project and optimized for interview demonstrations.
                </p>
            </div>
        </div>
    );
}

export default AboutQueryAI;
