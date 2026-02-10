import { postRequest } from "../api/api.js";
import { Config } from "../api/config.js";
import { Store } from "./store.js";

export async function login(email, password) {
  try {
    const response = await postRequest(Config.endpoints.login, {
      email,
      password,
    });
    if (response.accessToken) {
      Store.setLogin(response.accessToken, response.user);
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error };
  }
}

export async function register(email, password, username, role) {
  try {
    const payload = {
      email,
      username,
      password,
      role,
    };
    const response = await postRequest(Config.endpoints.register, payload);
    if (response && !response.error) {
      return { success: true, data: response };
    } else {
      return { success: false, error: response.error };
    }
  } catch (error) {
    console.error("Register Error:", error);
    return { success: false, error };
  }
}

export function logout() {
  Store.logout();
}

export function CheckAuth() {
  if (!Store.isAuthenticated) {
    window.location.href = "login.html";
  }
}

export function CheckGuest() {
  if (Store.isAuthenticated) {
    window.location.href = "dashboard.html";
  }
}
