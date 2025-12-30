import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {

    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, isSidebarOpen,
        setIsSidebarOpen, theme } = useContext(MyContext);

    const getAllThreads = async () => { //getAllThreads through fetch call
        try {
            const response = await fetch("http://localhost:5000/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            // console.log(filteredData);
            setAllThreads(filteredData);
            //threadId, title
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => { //get all thread whenever there is chng in curr threadId
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null); //null coz data coming from backend is in the form of obj (not necc string)
        setCurrThreadId(uuidv1()); //new chat start with new unique value:threadId
        setPrevChats([]); //in new chat there will be no prevChat
        setIsSidebarOpen(false);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:5000/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res); //res is in form of arr of objects 
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
            setIsSidebarOpen(false);
        } catch (err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/thread/${threadId}`, { method: "DELETE" });
            const res = await response.json();
            console.log(res);

            //updated thread re-render : filtering data nd setting filtered data in setAllThreads
            setAllThreads(prev => prev.filter(thread => thread.threadId != threadId)); //!= currThreadId i.e there in this deleteThread func argument 

            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className={`sidebar ${theme} ${isSidebarOpen ? "open" : ""}`}>


            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo" />
                <span> <i className="fa-solid fa-pen-to-square"></i> </span>
            </button>


            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx}
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : " "}>
                            <span className="thread-title">
                                {thread.title}
                            </span>
                            <i className="fa-solid fa-trash" onClick={(e) => {
                                e.stopPropagation(); //stop event bubbling: so that child event will get trigered (not parent event also coz if we dont write this line parent e will automatically got triggered) 
                                deleteThread(thread.threadId)
                            }}></i></li>
                    ))
                }
            </ul>



            <div className="sign">
                {/* <p>Developed by Pragati <span className="heart">&hearts;</span> </p> */}
                <p>Developed by Pragati <i className="fa-solid fa-heart"></i> </p>
            </div>
        </section>
    )
}

export default Sidebar;