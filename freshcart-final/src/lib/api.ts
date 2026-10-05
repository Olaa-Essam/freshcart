import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce.routemisr.com/api/v1",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.token = token;
    }
  }

  return config;
});

export const errMsg = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "Something went wrong";
  }

  return "Something went wrong";
};

export default api;
