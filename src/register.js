import { register, CheckGuest } from "./assets/auth.js";
import { emailRegex, passwordRegex, usernameRegex } from "./assets/regex.js";
import { Store } from "./assets/store.js";

document.addEventListener("DOMContentLoaded", () => {
  CheckGuest();

  const registerbtn = document.getElementById("registerbutton");
  if (registerbtn) {
    registerbtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const emailEl = document.getElementById("registeremail");
      const usernameEl = document.getElementById("registerusername");
      const passwordEl = document.getElementById("registerpassword");
      const password2El = document.getElementById("registerpassword2");

      const email = emailEl.value.trim().toLowerCase();
      const username = usernameEl.value.trim();
      const password = passwordEl.value.trim();
      const password2 = password2El.value.trim();

      let isValid = true;
      if (!emailRegex(emailEl)) isValid = false;
      if (!passwordRegex(passwordEl)) isValid = false;
      if (!usernameRegex(usernameEl)) isValid = false;

      if (password !== password2) {
        Store.setError("Şifreler eşleşmiyor!");
        passwordEl.classList.add("is-invalid");
        password2El.classList.add("is-invalid");
        isValid = false;
      }

      if (!isValid) return;

      try {
        let role = "user"; // Varsayılan rolü tanımlayalım
        const result = await register(email, password, username, role);
        if (result.success) {
          alert("Kayıt başarılı! Giriş yapabilirsiniz.");
          window.location.replace("login.html");
        } else {
          if (result.error === "Email already exists") {
            Store.setError(
              "Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.",
            );
          } else {
            alert(result.error?.message || result.error || "Kayıt başarısız.");
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
});
