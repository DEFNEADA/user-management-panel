import { login, CheckGuest } from "./assets/auth.js";

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
        console.log("Giriş başarılı.");
        window.location.href = "dashboard.html";
      } else {
        console.error("Giriş Hatası:", result.error);
        alert(
          result.error?.message ||
            "Giriş başarısız! E-posta veya şifre hatalı.",
        );
      }
    });
  }
});
