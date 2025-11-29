import axios from 'axios';
const API_URL = 'http://localhost:5001'; // backend server URL

// login user with email and password
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, { email, password });
    return { user: response.data.user };
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

// register new user with name, email, and password
export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, { name, email, password });
    return { user: response.data.user };
  } catch (error) {
    throw error.response?.data?.message || "Registration Failed";
  }
};