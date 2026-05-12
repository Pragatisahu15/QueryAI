import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/index.css";
import App from './App.jsx'
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
    position="top-center"
    toastOptions={{
      duration: 2500,

      style: {
        background: "#171717",
        color: "#fff",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        fontSize: "14px",
      },
    }}
  />
  </StrictMode>,
)
