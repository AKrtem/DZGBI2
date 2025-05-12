import { observer } from "mobx-react-lite";
import React, { useContext, lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  APPLY_ROUTE,
  SHOP_ROUTE,
  PRODUCT_ROUTE,
  ADMIN_ROUTE,
  CART_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  PLITY_ROUTE,
  KOLODTY_ROUTE,
  KOLLEKTORY_ROUTE,
  DELIVERY_ROUTE,
} from "../utils/consts";
import { Context } from "../Context";
import GroupPage from "./GroupPage";
import Plity from "../pages/groupPages/Plity";
import Kolodtsy from "../pages/groupPages/Kolodtsy";
import Kollektory from "../pages/groupPages/Kollektory";

// Ленивая загрузка компонентов
const Loader = () => <div>Загрузка...</div>;

const Shop = lazy(() => import("../pages/Shop"));
const ProductPage = lazy(() => import("../pages/ProductPage"));
const Admin = lazy(() => import("../pages/Admin"));
const Apply = lazy(() => import("../pages/Apply"));
const CartPage = lazy(() => import("../pages/CartPage"));
const Auth = lazy(() => import("../pages/Auth"));
const Delivery = lazy(() => import("../pages/Delivery")); // 🚚 Доставка

// Динамически загружаем страницы групп
// const loadGroupPage = (groupName) => {
//   return lazy(() => import(`../pages/groupPages/${groupName}`));
// };

const AppRouter = observer(() => {
  const { user } = useContext(Context);

  useEffect(() => {
    console.log("📦 [AppRouter] isAuth:", user.isAuth);
    console.log("📦 [AppRouter] user:", user.user);
    console.log("📦 [AppRouter] role:", user.role);
  }, [user.isAuth, user.user, user.role]);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path={SHOP_ROUTE} element={<Shop />} />
        <Route path={PRODUCT_ROUTE + "/:id"} element={<ProductPage />} />
        <Route path={CART_ROUTE} element={<CartPage />} />
        <Route path={APPLY_ROUTE} element={<Apply />} />
        <Route path={LOGIN_ROUTE} element={<Auth />} />
        <Route path={REGISTRATION_ROUTE} element={<Auth />} />
        <Route path={DELIVERY_ROUTE} element={<Delivery />} />

        <Route path="/group/:id" element={<GroupPage />} />

        {/* Динамическая генерация маршрутов для групп */}
        <Route path={PLITY_ROUTE} element={<Plity />} />
        <Route path={KOLODTY_ROUTE} element={<Kolodtsy />} />
        <Route path={KOLLEKTORY_ROUTE} element={<Kollektory />} />

        {/* Админка доступна только авторизованным пользователям с ролью "ADMIN" */}
        {user.isAuth && user.role === "ADMIN" && (
          <Route path={ADMIN_ROUTE} element={<Admin />} />
        )}

        {/* Редирект на магазин по умолчанию */}
        <Route path="*" element={<Navigate to={SHOP_ROUTE} />} />
      </Routes>
    </Suspense>
  );
});

export default AppRouter;
