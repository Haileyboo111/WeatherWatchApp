import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import "./Users.css";
import { loginUser } from './api/login_api';
import { useAuth } from './context/AuthContext';

function Users() {
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Enter both email and password.');
      return;
    }

    try {
      const data = await loginUser(email, password);
      login(data);
      console.log("Login successful:", data);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Container>
      <div className="users-wrapper">
        <div className="users-form-container">
          <h2 className="users-title">Login</h2>

          {error && <Alert className="red-alert">{error}</Alert>}

          <Form onSubmit={handleSubmit} className="users-form">
            <Form.Group className="users-form" controlId="formBasicEmail">
              <Form.Label>Email Address </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="users-form" controlId="formBasicPassword">
              <Form.Label>Password </Form.Label>
              <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="users-button">
              Login
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  )
}

export default Users;
