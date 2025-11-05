import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "./Users.css";

function Users() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempted with:", { email, password });
  };

  return (
    <Container>
      <div className="users-wrapper">
        <div className="users-form-container">
          <h2 className="users-title">Login</h2>
          <Form onSubmit={handleSubmit}>
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