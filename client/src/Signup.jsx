import { useState } from "react";
import axios from "axios";

function Signup({ onSignupSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password
        }
      );

      setMessage(
        response.data.message || "Signup successful!"
      );

      setName("");
      setEmail("");
      setPassword("");

      if (onSignupSuccess) {
        setTimeout(() => {
          onSignupSuccess();
        }, 1000);
      }

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        error.message ||
        "Signup failed"
      );
    }
  };

  return (
    <div>
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

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
          Signup
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Signup;
