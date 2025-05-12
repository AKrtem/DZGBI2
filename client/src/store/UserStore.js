import { makeAutoObservable } from "mobx";

export default class UserStore {
  constructor() {
    this._isAuth = false;
    this._user = {}; // Хранит всю информацию о пользователе
    makeAutoObservable(this);
  }
  setIsAuth(bool) {
    console.log("Setting isAuth to:", bool); // Добавь консольный вывод
    this._isAuth = bool;
  }

  setUser(user) {
    console.log("👤 User received in setUser:", user);
    this._user = user;
  }



  // Получение статуса авторизации
  get isAuth() {
    return this._isAuth;
  }

  // Получение объекта пользователя
  get user() {
    return this._user;
  }

  // Получение роли из объекта пользователя
  get role() {
    return this._user?.role || "USER"; // если нет роли — по умолчанию USER
  }

  // Выход
  logout() {
    this._isAuth = false;
    this._user = {};
  }
}
