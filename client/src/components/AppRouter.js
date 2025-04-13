import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { authRoutes, publicRoutes } from "../routes";
import { SHOP_ROUTE, LOGIN_ROUTE } from "../utils/consts";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {
  const { user } = useContext(Context);

  return (
    <Switch>
      {/* Если пользователь авторизован, отображаем маршруты для авторизованных */}
      {user.isAuth ? (
        <>
          {authRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} component={Component} exact />
          ))}
          {/* Редирект на главную страницу, если зашел на страницу не для публичных */}
          <Redirect to={SHOP_ROUTE} />
        </>
      ) : (
        <>
          {/* Если не авторизован, отображаем публичные маршруты */}
          {publicRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} component={Component} exact />
          ))}
          {/* Редирект на страницу авторизации, если не авторизован */}
          <Redirect to={LOGIN_ROUTE} />
        </>
      )}
    </Switch>
  );
});

export default AppRouter;
