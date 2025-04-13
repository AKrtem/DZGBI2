import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверка токена и восстановление состояния пользователя
    check()
      .then((data) => {
        user.setUser(data); // Устанавливаем данные пользователя
        user.setIsAuth(true); // Помечаем пользователя как авторизованного
      })
      .catch(() => {
        user.setIsAuth(false); // Если ошибка, сбрасываем авторизацию
      })
      .finally(() => {
        setLoading(false); // Когда завершится проверка, отключаем загрузку
      });
  }, [user]); // Добавляем user в зависимости, чтобы корректно обновить состояние

  // Если идет процесс загрузки (проверка токена), показываем спиннер
  if (loading) {
    return <Spinner animation={"grow"} />;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;
