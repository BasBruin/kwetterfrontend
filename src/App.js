import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8081/auth"; // Back-end API URL

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`, 
        { email, password }, 
        { withCredentials: true } // Tegen XSS aanval | Je kan hier niet bij via de javascript
      );
      alert("Login succesvol!");
      navigate("/");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Ongeldige e-mail/wachtwoord combinatie.");
      } else {
        setError(err.response?.data || "Er is iets fout gegaan");
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Wachtwoord:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/register`, 
        { email, password }, 
        { withCredentials: true } // Send the cookie with the request
      );
      alert("Registratie succesvol!");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Het opgegeven e-mailadres is al geregistreerd.");
      } else {
        setError(err.response?.data || "Er is iets fout gegaan");
      }
    }
  };

  return (
    <div>
      <h2>Registreren</h2>
      <form onSubmit={handleSubmitRegister}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Wachtwoord:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Registreren</button>
      </form>
    </div>
  );
};

export default App;
