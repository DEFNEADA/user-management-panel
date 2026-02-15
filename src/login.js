import { login, CheckGuest } from "./assets/auth.js";
import { Store } from "./assets/store.js";
import showToast from "./assets/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  CheckGuest();

  const loginbtn = document.getElementById("login-button");

  if (loginbtn) {
    loginbtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value.trim();

      const result = await login(email, password);
      if (result.success) {
        showToast("Giriş başarılı!");
        Store.clearError();
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 2000);
      } else {
        Store.setError(
          result.error?.message ||
            "Giriş başarısız! E-posta veya şifre hatalı.",
        );
      }
    });
  }
});
