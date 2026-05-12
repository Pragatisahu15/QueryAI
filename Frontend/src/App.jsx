import "./styles/App.css";
import AuthModal from './components/AuthModal/AuthModal.jsx';
import Sidebar from "./components/Sidebar/Sidebar.jsx"
import ChatWindow from "./components/ChatWindow/ChatWindow.jsx";
import { MyContext } from './context/MyContext.jsx';
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

  // Authentication State: user state, token state, authentication state, logout function
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("queryai-user");
    return savedUser? JSON.parse(savedUser) : null;
  }); 

  const [token, setToken] = useState(() => {
    return localStorage.getItem("queryai-token") || null;
  }); 

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("queryai-token");
  })

  useEffect(() => {
    localStorage.setItem("queryai-theme", theme);
  }, [theme])

  // Logout Function: Logout must: clear localStorage, clear React state, clear chat data
  const logout = () => {
    localStorage.removeItem("queryai-token")
    localStorage.removeItem("queryai-user")

    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    setPrevChats([]);
    setAllThreads([]);
  }

  const providerValues = { // providerValues should include BOTH: chat states, auth states
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    isSidebarOpen, setIsSidebarOpen,
    theme, setTheme,
    // Add Auth States to providerValues
    user, setUser, 
    token, setToken,
    isAuthenticated, setIsAuthenticated,
    logout
  };//passing values //created obj called providersValues


  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>

        {/*MOBILE OVERLAY*/}
        {isSidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* conditional rendering: If authenticated: show chatwindow else show auth modal */}
        {
          isAuthenticated ? (
            <>
                <Sidebar />
                <ChatWindow />
            </>
          ) : (
            <AuthModal/>
          )
        }
    

      </MyContext.Provider>
    </div>
  )

}

export default App;
