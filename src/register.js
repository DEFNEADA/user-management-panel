import { register, CheckGuest } from "./assets/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  CheckGuest();

  const registerbtn = document.getElementById("registerbutton");
  if (registerbtn) {
    registerbtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = document
        .getElementById("registeremail")
        .value.trim()
        .toLowerCase();
      const username = document.getElementById("registerusername").value.trim();
      const password = document.getElementById("registerpassword").value.trim();
      const password2 = document
        .getElementById("registerpassword2")
        .value.trim();
      if (!username) {
        alert("Lütfen bir kullanıcı adı belirleyin.");
        return;
      }

      if (password !== password2) {
        alert("Şifreler eşleşmiyor!");
        return;
      }

      try {
        let role = "user"; // Varsayılan rolü tanımlayalım
        const result = await register(email, password, username, role);
        if (result.success) {
          alert("Kayıt başarılı! Giriş yapabilirsiniz.");
          window.location.href = "login.html";
        } else {
          console.error("Kayıt Hatası:", result.error);
          if (result.error === "Email already exists") {
            alert("Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.");
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
