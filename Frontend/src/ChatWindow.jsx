import "./ChatWindow.css";
import Chat from "./Chat.jsx"
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import AboutQueryAI from "./AboutQueryAI.jsx";


function ChatWindow() {

    const {
        prompt, setPrompt,
        reply, setReply,
        currThreadId,
        prevChats, setPrevChats,
        setNewChat, setIsSidebarOpen,
        theme, setTheme
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    const [isModelOpen, setIsModelOpen] = useState(false);


    const getReply = async () => {
        setLoading(true);
        setNewChat(false);

        console.log("message", prompt, "threadId", currThreadId)
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ //passing in req body
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("http://localhost:5000/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    //Append new chat to prevChats
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats,
                { //new obj
                    role: "user", content: prompt
                }, {
                    role: "assistant",
                    content: reply
                }]
            ))
        }
        setPrompt("");
    }, [reply])


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        const handleClickOutside = () => setIsOpen(false);
        if (isOpen) document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = () => setIsModelOpen(false);
        if (isModelOpen) document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isModelOpen])

    const toggleTheme = (e) => {
        e.stopPropagation();
        setTheme(prev => prev === "dark" ? "light" : "dark");
    };


    return (
        <div className={`chatWindow ${theme}`}>
            <div className="navbar">

                <div className="nav-left">
                    <i
                        className="fa-solid fa-bars hamburger"
                        onClick={() => setIsSidebarOpen(prev => !prev)}
                    ></i>

                    <div className="queryWrapper">
                        <span className="queryTitle">
                            QueryAI
                            <i
                                className={`fa-solid fa-chevron-down chevronIcon ${isModelOpen ? "rotate" : ""}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsModelOpen(prev => !prev);
                                }}
                            ></i>
                        </span>

                        {isModelOpen && (
                            <div className="modelDropdown">
                                <div className="modelItem active">
                                    <span>Groq LLaMA-3 (Fast)</span>
                                    <i className="fa-solid fa-check"></i>
                                </div>
                            </div>
                        )}
                    </div>
                </div>


                <div className="userIconDiv" onClick={(e) => { e.stopPropagation(); handleProfileClick(); }}>
                    <span className="userIcon"> <i className="fa-solid fa-user"></i> </span>
                </div>
            </div>

            {/* {showAbout && <AboutQueryAI onClose={() => setShowAbout(false)} />} */}

            {
                showAbout && (
                    <AboutQueryAI
                        onClose={() => setShowAbout(false)}
                        theme={theme}
                    />
                )
            }


            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropDownItem"
                        onClick={() => {
                            setShowAbout(true);
                            setIsOpen(false);
                        }}
                    >About QueryAI</div>

                    <div className="dropDownItem" onClick={toggleTheme}>
                        Theme{" "}
                        <i className={`fa-solid ${theme === "dark" ? "fa-toggle-off" : "fa-toggle-on"}`}></i>
                    </div>


                    <div className="dropDownItem">Logout <i className="fa-solid fa-arrow-right-from-bracket"></i></div>
                </div>
            }

            <Chat></Chat>

            {/* <ScaleLoader color="#fff" loading={loading}>

            </ScaleLoader > */}

            {
                loading && (
                    <div className="loaderWrapper">
                        <ScaleLoader
                            color={theme === "light" ? "#374151" : "#ffffff"}
                            height={35}
                            width={4}
                            radius={2}
                        />

                    </div>
                )
            }


            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    >

                    </input>


                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    QueryAI can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div >
    )
}

export default ChatWindow;