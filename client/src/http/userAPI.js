import jwt_decode from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/api/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  localStorage.setItem("token", data.token);
  return jwt_decode(data.token);
};

export const registration = async (email, password) => {
  const response = await fetch(`${API_URL}/api/user/registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  localStorage.setItem("token", data.token);
  return jwt_decode(data.token);
};

export const check = async () => {
  const response = await fetch(`${API_URL}/api/user/auth`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Authorization failed");
  }

  const data = await response.json();
  return data;
};

export const fetchTypes = async () => {
  const response = await fetch(`${API_URL}/api/type`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }

  const data = await response.json();
  return data;
};
