import axios from "axios";

const API_URL = "http://localhost:3000/auth";

export const AuthService = {
    login: async (email, password) => {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    },

    register: async (name, email, password, role) => {
        const response = await axios.post(`${API_URL}/register`, {
            name,
            email,
            password,
            role,
        });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem("user"));
    },

    getToken: () => {
        return localStorage.getItem("token");
    }
};
