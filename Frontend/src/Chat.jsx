import "./Chat.css"
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"
import { Typewriter } from "react-simple-typewriter";


//react-markdown
//rehype-highlight

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);


    useEffect(() => {
        if (reply === null) {
            setLatestReply(null);//when loading prev chats 
            return;
        }
        //separate latestReply => create typing effect
        if (!prevChats?.length) return;

        const content = reply.split(" "); //spliting reply on the basis of spaces: storing individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));
            idx++;
            if (idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply]);

    const isCodeBlock = (text) => {
        return (
            text.includes("\n") ||
            text.includes("{") ||
            text.includes("}") ||
            text.includes(";")
        );
    };


    return (
        <>
            {/* {newChat && <h1 className="startChat">Start a new Chat!</h1>} */}

            {newChat && prevChats.length === 0 && (
                <h1 className="startChat">
                    <Typewriter
                        words={["Start a new Chat!"]}
                        loop={1}
                        // cursor
                        // cursorStyle="|"
                        typeSpeed={70}
                    />
                    <span className="fakeCursor">|</span>
                </h1>
            )}




            <div className="chats">
                {
                    prevChats?.slice(0, -1).map((chat, idx) =>
                        <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                            {
                                chat.role === "user" ?
                                    <p className="userMessage">{chat.content}</p> :
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                                //  <p className="gptMessage">{chat.content}</p>
                            }


                        </div>
                    )
                }

                { //ternary operator 
                    prevChats.length > 0 && (
                        <>
                            {
                                latestReply === null ? (
                                    <div className="gptDiv" key={"non-typing"}>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length - 1].content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    // this block of code is to print the latestReply
                                    <div className="gptDiv" key={"typing"}>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                    </div>
                                )

                            }
                        </>
                    )
                }

                {/* { // this block of code is to print the latestReply
                    prevChats.length > 0 && latestReply !== null &&

                    <div className="gptDiv" key={"typing"}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                    </div>
                }

                {
                    prevChats.length > 0 && latestReply === null &&

                    <div className="gptDiv" key={"non-typing"}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length - 1].content}</ReactMarkdown>
                    </div>
                } */}

                {/* <div className="userDiv">
                    <p className="userMessage">User Message</p>
                </div>
                <div className="gptDiv">
                    <p className="gptMessage">AI generated message</p>
                </div> */}

            </div>
        </>
    )
}

export default Chat;