import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import "./Users.css";
import { loginUser, registerUser } from './api/login_api';
import { useAuth } from './context/AuthContext';
import axios from 'axios';

function Users() {
  const { user, login, logout } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');

  const [mode, setMode] = useState("login");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user) {
      return;
    }
    
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/users/${user.id}/history`);
        const parsed = response.data.history.map(trip => ({
          ...trip,
          weather: trip.info ? JSON.parse(trip.info) : null
        }));
        setHistory(parsed);
      } catch (err) {
        setHistory([]);
      }
    };
    fetchHistory();
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Enter both email and password.');
      return;
    } 


    const data = await loginUser(email, password);
    login(data.user);

  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Enter name, email, and password.');
      return;
    }

    try {
      const data = await registerUser(name, email, password);
      //login(data.user);
      setMode("login");
    } catch (err) {
      setError(err);
    }
  };

  const handleLogout = () => {
    logout();
    setMode("login");
    setHistory([]);
    setName("");
    setEmail("");
    setPassword("");
  };

  if (!user) {
    return (
      <Container>
        <div className="users-wrapper">
          <div className="users-form-container">
            <h2 className="users-title">{mode === "login" ? "Login" : "Register"}</h2>

            {error && <Alert className="red-alert">{error}</Alert>}

            <Form 
            onSubmit={mode === "login" ? handleLogin : handleRegister}
            className="users-form"
            >
              {mode === "register" && (
                <Form.Group className="users-form" controlId="formBasicName">
                  <Form.Label>Name </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              )} 

              <Form.Group className="users-form" controlId="formBasicEmail">
                <Form.Label>Email </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className= "users-form" controlId="formBasicPassword">
                <Form.Label>Password </Form.Label>
                <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="users-button">
                {mode === "login" ? "Login" : "Register"}
              </Button>
            </Form>

            <p className="switch-mode">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <span
                    className="switch-link users-form"
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                  >
                    Register
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    className="switch-link users-form"
                    onClick={() => {
                      setMode("login");
                      setError("");
                    }}
                  >
                    Log In
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </Container>
    );
  } else {
    return (
      <Container>
        <div className= "users-wrapper">
          <div className="users-form-container">
            <div className="users-header">
              <h2>Welcome {user.name}!</h2>
              <Button variant="outline-secondary" onClick={handleLogout} className="users-logout">
                Logout
              </Button>
            </div>
            {history.length === 0 ? (
              <p>No saved trips yet.</p>
            ) : (
              <ul>
                {history.map((trip, i) => (
                  <li key={i}>
                    <strong>{trip.location}</strong> - {trip.date}
                    {trip.weather && trip.weather.map((info, j) => (
                      <div key ={j} style={{ marginLeft: 16 }}>
                        <p>
                          Temperature: {info.temperature.min}°F - {info.temperature.max}°F<br />
                          Morning: {info.temperature.morning}°F<br />
                          Afternoon: {info.temperature.afternoon}°F<br />
                          Evening: {info.temperature.evening}°F<br />
                          Night: {info.temperature.night}°F
                        </p>
                        <p>Precipitation: {info.precipitation} mm</p>
                        <p>Cloud cover: {info.cloudCover}%</p>
                        <p>Wind: {info.wind.speed} m/s {info.wind.direction}</p>
                        <p>Humidity: {info.humidity}%</p>
                      </div>
                    ))}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>
    )
  }
 }

export default Users;
