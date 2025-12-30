import './App.css'
import Sidebar from "./Sidebar.jsx"
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from './MyContext.jsx';
import { useState, useEffect } from 'react';
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);//stores all previous chats of current threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("queryai-theme") || "dark";
  })

  useEffect(() => {
    localStorage.setItem("queryai-theme", theme);
  }, [theme])

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    isSidebarOpen, setIsSidebarOpen,
    theme, setTheme
  };//passing values //created obj called providersValues

  // return (
  //   <div className='app'>
  //     <MyContext.Provider value={providerValues}>
  //       <Sidebar></Sidebar>
  //       <ChatWindow></ChatWindow>
  //     </MyContext.Provider>
  //   </div>
  // )

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>

        {/* 🔥 MOBILE OVERLAY */}
        {isSidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Sidebar />
        <ChatWindow />

      </MyContext.Provider>
    </div>
  )

}

export default App;
