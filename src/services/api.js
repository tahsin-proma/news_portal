import axios from "axios";

const API_URL = "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const NewsService = {
  getAllNews: async () => {
    const response = await apiClient.get("/news?_sort=id&_order=desc");
    return response.data;
  },
  getNewsById: async (id) => {
    const response = await apiClient.get(`/news/${id}`);
    return response.data;
  },
  createNews: async (data) => {
    const response = await apiClient.post("/news", data);
    return response.data;
  },
  updateNews: async (id, data) => {
    const response = await apiClient.patch(`/news/${id}`, data);
    return response.data;
  },
  deleteNews: async (id) => {
    const response = await apiClient.delete(`/news/${id}`);
    return response.data;
  },
  getComments: async (newsId) => {
    const response = await apiClient.get(`/news/${newsId}/comments`);
    return response.data;
  },
  createComment: async (newsId, data) => {
    const response = await apiClient.post(`/news/${newsId}/comments`, data);
    return response.data;
  },
};

export const UserService = {
  getAllUsers: async () => {
    const response = await apiClient.get("/users");
    return response.data;
  },
};
