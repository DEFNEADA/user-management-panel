import { CheckAuth, logout } from "./assets/auth.js";
import { Store } from "./assets/store.js";

document.addEventListener("DOMContentLoaded", () => {
  CheckAuth();

  document.getElementById("logout-button").addEventListener("click", () => {
    logout();
    window.location.href = "login.html";
  });

  const user = Store.currentUser;
  if (user) {
    document.getElementById("profile-username").value = user.username;
    document.getElementById("profile-email").value = user.email;
    document.getElementById("profile-role").value = user.role;
  }
});
