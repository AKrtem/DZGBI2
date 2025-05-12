import axios from "axios";

const $host = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001/",
});

const $authHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001/",
});

// Интерсептор для авторизованных запросов
$authHost.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export { $host, $authHost };
