import { Storage } from "./storage.js";

export const Store = {
  state: {
    token: null,
    user: null,
    error: null,
  },

  init() {
    this.state.token = Storage.getToken();
    this.state.user = Storage.getUser();
  },

  setError(message) {
    this.state.error = message;

    const errorElement =
      document.querySelector(".modal.show #error-box") ||
      document.getElementById("error-box");

    if (errorElement) {
      if (message) {
        errorElement.textContent = message;
        errorElement.classList.remove("d-none");
        errorElement.classList.add("d-block");
      } else {
        errorElement.classList.remove("d-block");
        errorElement.classList.add("d-none");
        errorElement.textContent = "";
      }
    }
  },

  clearError() {
    this.setError(null);
  },

  setLogin(token, user) {
    this.state.token = token;
    this.state.user = user;
    this.state.error = null;
    Storage.setToken(token);
    if (user) {
      Storage.setUser(user);
    }
  },

  updateUser(user) {
    this.state.user = user;
    Storage.setUser(user);
  },

  logout() {
    this.state.token = null;
    this.state.user = null;
    Storage.clear();
  },

  get isAuthenticated() {
    //kullanıcı şuan içerde mi?
    return !!this.state.token;
  },

  get currentUser() {
    return this.state.user;
  },
};

Store.init();
