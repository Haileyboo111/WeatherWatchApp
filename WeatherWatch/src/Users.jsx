import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import "./Users.css";
import { loginUser, registerUser } from "./api/login_api";
import { useAuth } from "./context/AuthContext";
import axios from "axios";
import { convertTemperature, getUnitSymbol, useUnit } from "./context/UnitContext";

function Users() {
  const { user, login, logout } = useAuth();
  const { unit } = useUnit();
  const unitSymbol = getUnitSymbol(unit);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login");
  const [history, setHistory] = useState([]);
  const [expandedTrips, setExpandedTrips] = useState({});

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/users/${user.id}/history`);
        const parsed = response.data.history.map((trip) => ({
          ...trip,
          weather: trip.info ? JSON.parse(trip.info) : null,
        }));
        setHistory(parsed);
      } catch (err) {
        setHistory([]);
      }
    };
    fetchHistory();
  }, [user]);

  const toggleTrip = (index) => {
    setExpandedTrips((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Enter both email and password.");
      return;
    }

    try {
      const data = await loginUser(email, password);
      if (!data.user) {
        setError("Invalid email or password.");
        return;
      }
      login(data.user);
      setEmail("");
      setPassword("");
      setError("");
    } catch (err) {
      setError(typeof err === "string" ? err : err.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Enter name, email, and password.");
      return;
    }

    try {
      await registerUser(name, email, password);
      setMode("login");
      setName("");
      setEmail("");
      setPassword("");
      setError("");
    } catch (err) {
      setError(typeof err === "string" ? err : err.message || "Registration failed");
    }
  };

  const handleLogout = () => {
    logout();
    setMode("login");
    setHistory([]);
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const renderWeatherBoxes = (info, date) => (
    <div className="trip-weather-grid">
      <div className="weather-box date-box">
        <strong>{date}</strong>
      </div>
      <div className="weather-box">
        <strong>Temp:</strong> {convertTemperature(info.temperature.min, unit)}
        {unitSymbol} - {convertTemperature(info.temperature.max, unit)}
        {unitSymbol}
      </div>
      <div className="weather-box">
        <strong>Morning:</strong> {convertTemperature(info.temperature.morning, unit)}
        {unitSymbol}
      </div>
      <div className="weather-box">
        <strong>Afternoon:</strong> {convertTemperature(info.temperature.afternoon, unit)}
        {unitSymbol}
      </div>
      <div className="weather-box">
        <strong>Evening:</strong> {convertTemperature(info.temperature.evening, unit)}
        {unitSymbol}
      </div>
      <div className="weather-box">
        <strong>Night:</strong> {convertTemperature(info.temperature.night, unit)}
        {unitSymbol}
      </div>
      <div className="weather-box">
        <strong>Precipitation:</strong> {info.precipitation} mm
      </div>
      <div className="weather-box">
        <strong>Cloud cover:</strong> {info.cloudCover}%
      </div>
      <div className="weather-box">
        <strong>Wind:</strong> {info.wind.speed} m/s {info.wind.direction}
      </div>
      <div className="weather-box">
        <strong>Humidity:</strong> {info.humidity}%
      </div>
    </div>
  );


  if (!user) {
    return (
      <Container>
        <div className="users-wrapper">
          <div className="users-form-container">
            <h2 className="users-title">{mode === "login" ? "Login" : "Register"}</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={mode === "login" ? handleLogin : handleRegister} className="users-form">
              {mode === "register" && (
                <Form.Group className="users-form" controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              )}

              <Form.Group className="users-form" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="users-form" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
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
  }

  return (
    <Container>
      <div className="users-wrapper">
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
            <div className="trip-history-container">
              {history.map((trip, i) => (
                <div key={i} className="trip-card">
                  <div
                    className="trip-header"
                    onClick={() => toggleTrip(i)}
                    style={{ cursor: "pointer" }}
                  >
                    <strong>Trip to {trip.location}</strong> - {trip.date}
                    <span style={{ float: "right" }}>
                      {expandedTrips[i] ? "▲" : "▼"}
                    </span>
                  </div>

                  {expandedTrips[i] && trip.weather && (
                    <div className="trip-weather">
                      {trip.weather.map((info, j) => (
                        <div key={j}>
                          {renderWeatherBoxes(info)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

export default Users;
