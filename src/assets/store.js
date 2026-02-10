import { Storage } from "./storage.js";

export const Store = {
  state: {
    token: null,
    user: null,
  },

  init() {
    this.state.token = Storage.getToken();
    this.state.user = Storage.getUser();
  },

  setLogin(token, user) {
    this.state.token = token;
    this.state.user = user;
    Storage.setToken(token);
    if (user) {
      Storage.setUser(user);
    }
  },

  logout() {
    this.state.token = null;
    this.state.user = null;
    Storage.clear();
  },

  get isAuthenticated() {
    //kullanıcı şuan içerde mi?
    //return !!this.state.token;
    return !!Storage.getToken();
  },

  get currentUser() {
    return this.state.user;
  },
};

Store.init();
