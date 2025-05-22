import React, { useContext } from "react";
import { Context } from "../Context";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ADMIN_ROUTE,
  LOGIN_ROUTE,
  SHOP_ROUTE,
  CART_ROUTE,
  DELIVERY_ROUTE,
} from "../utils/consts";
import { Button, Container } from "react-bootstrap";
import { observer } from "mobx-react-lite";

const NavBar = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.removeItem("token"); // или имя ключа, где у тебя хранится токен
    navigate(LOGIN_ROUTE);
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <NavLink
          style={{ color: "white", textDecoration: "none" }}
          to={SHOP_ROUTE}
        >
          ООО ДЗЖБИ
        </NavLink>

        <Nav className="ml-auto" style={{ color: "white", gap: "0.5rem" }}>
          {/* Кнопка Корзина всегда видна */}
          <Button variant="outline-light" onClick={() => navigate(CART_ROUTE)}>
            Корзина
          </Button>

          {user.isAuth ? (
            <>
              {user.role === "ADMIN" && (
                <Button
                  variant="outline-light"
                  onClick={() => navigate(ADMIN_ROUTE)}
                >
                  Админ панель
                </Button>
              )}
              <Button
                variant="outline-light"
                onClick={() => navigate(DELIVERY_ROUTE)}
              >
                Доставка
              </Button>
              <Button variant="outline-light" onClick={logOut}>
                Выйти
              </Button>
            </>
          ) : (
            <Button
              variant="outline-light"
              onClick={() => navigate(LOGIN_ROUTE)}
            >
              Авторизация
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
});

export default NavBar;
