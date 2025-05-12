import React, { useContext, useEffect, useState } from "react";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import NavBar2 from "./components/NavBar2";
import Footer from "./components/Footer";
import { observer } from "mobx-react-lite";
import { Context } from "./Context";
import { check } from "./http/userAPI";
import "bootstrap/dist/css/bootstrap.min.css";
import RedirectHandler from "./components/RedirectHandler";
import "./styles/slider.css";

const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("Запрос на авторизацию...");
        const data = await check();
        console.log("Данные после авторизации:", data);
        if (data) {
          user.setUser(data);
          user.setIsAuth(true);
        }
      } catch (error) {
        console.error("Ошибка при проверке авторизации:", error);
        user.logout();
      } finally {
        console.log("Завершена инициализация авторизации.");
        setLoading(false);
      }
    };

    initAuth();
  }, [user]);

  if (loading) {
    return <div>Загрузка...</div>; // Заглушка для загрузки
  }

  return (
    <>
      <NavBar />
      <NavBar2 />
      <RedirectHandler />
      <AppRouter />
      <Footer />
    </>
  );
});

export default App;
