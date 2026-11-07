import { useState } from "react";
import axios from "axios";
import Signup from "./Signup";
import Dashboard from "./Dashboard";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem("token", response.data.token);
      setLoggedIn(true);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        error.message ||
        "Login failed"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setEmail("");
    setPassword("");
    setMessage("");
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
    setMessage("Signup successful! Please login.");
  };

  if (loggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  if (showSignup) {
    return (
      <div className="card">
        <h2>Create Account</h2>

        <Signup onSignupSuccess={handleSignupSuccess} />

        <br />

        <button onClick={() => setShowSignup(false)}>
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <h1>Sweety</h1>

      <p>Blood Glucose Tracker</p>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Login
        </button>
      </form>

      {message && <p className="error">{message}</p>}

      <hr />

      <p>Don't have an account?</p>

      <button onClick={() => setShowSignup(true)}>
        Create Account
      </button>
    </div>
  );
}

export default Login;
