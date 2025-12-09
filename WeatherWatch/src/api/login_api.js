// import axios from 'axios';
// const API_URL = '/users'; // use dev proxy to avoid CORS issues

// // login user with email and password
// export const loginUser = async (email, password) => {
//   try {
//     const response = await axios.post(`${API_URL}/login`, { email, password });
//     return { user: response.data.user };
//   } catch (error) {
//     throw error.response?.data?.message || "Login failed";
//   }
// };

// // register new user with name, email, and password
// export const registerUser = async (name, email, password) => {
//   try {
//     const response = await axios.post(`${API_URL}/register`, { name, email, password });
//     return { user: response.data.user };
//   } catch (error) {
//     throw error.response?.data?.message || "Registration Failed";
//   }
// };


import axios from 'axios';

const API_URL = 'http://localhost:5001/users'; // keep this if your backend actually uses /users

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;   // return everything the backend sends
  } catch (error) {
    console.error("Login API error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    return response.data;   // return everything the backend sends
  } catch (error) {
    console.error("Register API error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
