// UNFINISHED

import React from "react";
import { useForm } from "react-hook-form";
import "./App.css";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = ({ email, password }) => {
    const storedUser = localStorage.getItem(email);
    if (!storedUser) {
      console.log("No account found.");
      return;
    }
    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.password === password) {
      console.log("Welcome, " + parsedUser.name);
    } else {
      console.log("Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(login)}>
        <div className="form">
          <input
            type="email"
            placeholder="Enter email: "
            {...register("email", { required: "Email required."})}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="form">
          <input
            type="password"
            placeholder="Enter password: "
            {...register("password", { required: "Password required." })}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="submit-btn">Log In</button>
      </form>
    </div>
  );
};

export default Users;