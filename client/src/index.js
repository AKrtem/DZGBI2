// {
//   "email": "artem@email.com",
//   "password": "adminadmin",
//   "role": "ADMIN"
// }
// {
//   "email": "artem@example.com",
//   "password": "123456",
//   "role": "USER"
// }

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Context, user, product } from "./Context"; // 🔥 используем из Context.js

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Context.Provider value={{ user, product }}>
      <App />
    </Context.Provider>
  </BrowserRouter>
);
