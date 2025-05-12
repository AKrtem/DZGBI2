import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";

export const registration = async (email, password) => {
  const { data } = await $host.post("api/user/registration", {
    email,
    password,
    // Не передаём роль — сервер сам поставит USER по умолчанию
  });
  localStorage.setItem("token", data.token);
  return jwt_decode(data.token);
};

export const login = async (email, password) => {
  const { data } = await $host.post("api/user/login", { email, password });
  localStorage.setItem("token", data.token);
  return jwt_decode(data.token);
};

export const check = async () => {
  const { data } = await $authHost.get("api/user/auth");
  console.log("🔥 check() получил от сервера:", data);
  if (!data.token) {
    console.error("❌ check(): Ожидался объект { token }, а получено:", data);
    throw new Error("Invalid token format in server response");
  }

  localStorage.setItem("token", data.token);
  const decoded = jwt_decode(data.token);
  console.log("📦 Декодированный токен из check():", decoded); // <--- добавь это
  return decoded;
};
