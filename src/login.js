import { login, CheckGuest } from "./assets/auth.js";
import { Store } from "./assets/store.js";

document.addEventListener("DOMContentLoaded", () => {
  CheckGuest();

  const loginbtn = document.getElementById("login-button");

  if (loginbtn) {
    loginbtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value.trim();

      const result = await login(email, password);
      console.log(result);
      if (result.success) {
        window.location.href = "dashboard.html";
        Store.clearError();
      } else {
        Store.setError(
          result.error?.message ||
            "Giriş başarısız! E-posta veya şifre hatalı.",
        );
      }
    });
  }
});
