import "./AuthModal.css"
import {useState, useContext} from "react";
import { MyContext } from "../../context/MyContext";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

function AuthModal() {
    const {
    theme,
    setUser,
    setToken,
    setIsAuthenticated
} = useContext(MyContext);

    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 3000);
    };

  
    const handleSubmit = async (e) => {

    e.preventDefault(); // Stops page refresh on form submit

    setError("");

    // Basic validation
    if (!email || !password || (!isLogin && !name)) {
        return showError("Please fill all fields");
    }

    try {

        setLoading(true);

        const endpoint = isLogin
            ? "login"
            : "signup"; //Dynamically chooses API route

        const response = await fetch(
            // `http://localhost:5000/api/auth/${endpoint}`,
             `${import.meta.env.VITE_BACKEND_URL}/api/auth/${endpoint}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    isLogin
                        ? { email, password }
                        : { name, email, password }
                )
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Authentication failed");
        }

        // Save token
        localStorage.setItem( // localStorage.setItem() Stores token
            "queryai-token",
            data.token
        );

        // Save user
        localStorage.setItem( // // localStorage.setItem() Stores user data
            "queryai-user",
            JSON.stringify(data.user)
        );


        toast.success(
            isLogin
            ? "Login successful" 
            : "Account created successfully"
        ) 

        // Update global auth state
        setUser(data.user);
        setToken(data.token);
        setIsAuthenticated(true); // Triggers: app re-render, Then AuthModal disappears Chat UI appears

    } catch (err) {

        console.log(err);

        showError(err.message);

    } finally {

        setLoading(false);
    }
};

    return( 
        <div className={`authOverlay ${theme}`}>
            <div className={`authModal ${theme}`}>
                <div className="authHeader">
                 <h1>Welcome to QueryAI</h1>
                 <p>Your intelligent AI assistant</p>
                </div>

                  <div className="authToggle">
                        <button className={isLogin ? "active" : ""}
                        onClick={()=>setIsLogin(true)}>
                            Login
                        </button>

                        <button
                        className={!isLogin ? "active" : ""}
                        onClick={() => setIsLogin(false)}
                        >
                            Signup
                        </button>
                  </div>
                  <form className="authForm" onSubmit={handleSubmit}>
                    {
                        !isLogin && (
                            <input 
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />
                        )
                    }
                     <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {/* <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    /> */}

                       <div className="passwordContainer">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="passwordInput"
                            />

                            <button
                                type="button"
                                className="togglePasswordBtn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {
                                    showPassword
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />
                                }
                            </button>
                        </div>

                    {
                        error && (
                            <p className="authError">
                                {error}
                            </p>
                        )
                    }
              
                   <button
                    type="submit"
                    className="authSubmitBtn"
                    disabled={loading}
                    >
                      {
                            loading ? (
                                <span className="btnLoader"></span>
                            ) : (
                                isLogin
                                    ? "Login"
                                    : "Create Account"
                            )
                        }
                    </button>
                  </form>
            </div>
        </div>
    )
}

export default AuthModal;