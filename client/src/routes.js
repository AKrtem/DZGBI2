import Admin from "./pages/Admin";
import {
  ADMIN_ROUTE,
  CART_ROUTE,
  PRODUCT_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
  KOLLEKTORY_ROUTE,
  KOLODTY_ROUTE,
  PLITY_ROUTE,
} from "./utils/consts";
import CartPage from "./pages/CartPage"; // 👈
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import ProductPage from "./pages/ProductPage";
import Plity from "./pages/groupPages/Plity";
import Kolodtsy from "./pages/groupPages/Kolodtsy";
import Kollektory from "./pages/groupPages/Kollektory";

export const authRoutes = [
  {
    path: ADMIN_ROUTE,
    Component: Admin,
  },
  {
    path: CART_ROUTE,
    Component: CartPage, // 👈 подключено
  },
];

export const publicRoutes = [
  {
    path: SHOP_ROUTE,
    Component: Shop,
  },
  {
    path: LOGIN_ROUTE,
    Component: Auth,
  },
  {
    path: REGISTRATION_ROUTE,
    Component: Auth,
  },
  {
    path: PRODUCT_ROUTE + "/:id",
    Component: ProductPage,
  },
  {
    path: PLITY_ROUTE, // Маршрут для плит
    Component: Plity, // Компонент для плит
  },
  {
    path: KOLODTY_ROUTE, // Маршрут для колодцев
    Component: Kolodtsy, // Компонент для колодцев
  },
  {
    path: KOLLEKTORY_ROUTE, // Маршрут для коллекторов
    Component: Kollektory, // Компонент для коллекторов
  },
];
