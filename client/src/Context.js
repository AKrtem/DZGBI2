import { createContext } from "react";
import UserStore from "./store/UserStore";
import ProductStore from "./store/ProductStore";

export const user = new UserStore();
export const product = new ProductStore();

export const Context = createContext({
  user,
  product,
});
