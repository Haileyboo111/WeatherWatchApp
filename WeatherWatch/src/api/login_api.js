import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

//Login
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Login failed";
    }
};

//Register
export const registerUser = async (name, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, { name, email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Registration Failed";
    }
};