import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import "./Users.css";
import { loginUser, registerUser } from './api/login_api';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Users() {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [success, setSuccess] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const [mode, setMode] = useState("login");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Enter both email and password.');
      return;
    }

    try {
      const data = await loginUser(email, password);
      login(data);
      navigate("/trip-planner");
    } catch (err) {
      setError(err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Enter both email and password.');
      return;
    }

    try {
      const data = await registerUser(name, email, password);
      login(data);
      navigate("/trip-planner");
    } catch (err) {
      setError(err);
    }
  };

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
              <Form.Label>Email Address </Form.Label>
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
                  className="switch-link"
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
                  className="switch-link"
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

export default Users;
