import { makeAutoObservable } from "mobx";

export default class ProductStore {
  constructor() {
    this._views = [];
    this._types = [];
    this._groups = [];
    this._products = [];
    this._cart = [];
    this._selectedView = {};
    this._selectedType = {};
    this._selectedGroup = {};
    this._page = 1;
    this._totalCount = 0;
    this._limit = 3;
    makeAutoObservable(this);
  }

  setViews(views) {
    this._views = views;
  }

  setTypes(types) {
    this._types = types;
  }

  setGroups(groups) {
    this._groups = groups;
  }

  setProducts(products) {
    this._products = products;
  }

  setSelectedView(view) {
    this.setPage(1);
    this._selectedView = view;
  }

  setSelectedType(type) {
    this.setPage(1);
    this._selectedType = type;
  }

  setSelectedGroup(group) {
    this.setPage(1);
    this._selectedGroup = group;
  }

  setPage(page) {
    this._page = page;
  }

  setTotalCount(count) {
    this._totalCount = count;
  }

  // Корзина
  addToCart(product) {
    const existingProduct = this._cart.find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this._cart.push({ ...product, quantity: 1 });
    }
  }

  updateQuantity(id, quantity) {
    const item = this._cart.find((p) => p.id === id);
    if (item) item.quantity = quantity;
  }

  removeFromCart(productId) {
    this._cart = this._cart.filter((product) => product.id !== productId);
  }

  decreaseQuantity(productId) {
    const item = this._cart.find((p) => p.id === productId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.removeFromCart(productId);
      }
    }
  }

  clearCart() {
    this._cart = [];
  }

  isInCart(productId) {
    return this._cart.some((item) => item.id === productId);
  }

  get cart() {
    return this._cart;
  }

  get views() {
    return this._views;
  }

  get types() {
    return this._types;
  }

  get groups() {
    return this._groups;
  }

  get products() {
    return this._products;
  }

  get selectedView() {
    return this._selectedView;
  }

  get selectedType() {
    return this._selectedType;
  }

  get selectedGroup() {
    return this._selectedGroup;
  }

  get totalCount() {
    return this._totalCount;
  }

  get page() {
    return this._page;
  }

  get limit() {
    return this._limit;
  }
}
