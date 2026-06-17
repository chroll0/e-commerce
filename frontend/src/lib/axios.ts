import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      return Promise.reject(error);
    }
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  },
);
