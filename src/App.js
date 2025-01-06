import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8081/auth"; // Back-end API URL

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/privacy">Privacy</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy" element={<PrivacyNotice />} /> {/* Privacy Notice Route */}
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
        { withCredentials: true }
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
  const [consent, setConsent] = useState(false);  // Consent state
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    if (!consent) {
      setError("Je moet akkoord gaan met onze privacyverklaring.");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/register`, 
        { email, password, consent },  // Include consent in the request
        { withCredentials: true }
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
        <div>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
          <label>
            Ik ga akkoord met de <Link to="/privacy">privacyverklaring</Link>.
          </label>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Registreren</button>
      </form>
    </div>
  );
};

const PrivacyNotice = () => {
  return (
    <div>
      <h2>Privacyverklaring</h2>
      <p>
        Wij verzamelen en verwerken jouw e-mailadres en wachtwoord om je toegang te geven tot onze applicatie. 
        Je gegevens worden beveiligd opgeslagen en niet gedeeld met derden. Voor meer informatie, neem contact met ons op.
      </p>
    </div>
  );
};

export default App;