import { CheckAuth, logout } from "./assets/auth.js";
import { Store } from "./assets/store.js";
import { Config } from "./api/config.js";
import { patchRequest, getRequest } from "./api/api.js";
import { emailRegex, usernameRegex, passwordRegex } from "./assets/regex.js";

document.addEventListener("DOMContentLoaded", () => {
  CheckAuth();

  document.getElementById("logout-button").addEventListener("click", () => {
    logout();
    window.location.href = "login.html";
  });

  const user = Store.currentUser;
  if (user) {
    document.getElementById("welcome-message").textContent = `${user.username}`;
    document.getElementById("profile-username").value = user.username;
    document.getElementById("profile-email").value = user.email;
    document.getElementById("profile-role").value = user.role || "user";
  }
  const profileForm = document.getElementById("profile-form");
  if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const usernameEl = document.getElementById("profile-username");
      const emailEl = document.getElementById("profile-email");
      const passwordEl = document.getElementById("new-password");
      const password2El = document.getElementById("new-password2");
      const role = document.getElementById("profile-role").value;

      const username = usernameEl.value.trim();
      const email = emailEl.value.trim().toLowerCase();

      let isValid = true;
      if (!emailRegex(emailEl)) isValid = false;
      if (!usernameRegex(usernameEl)) isValid = false;

      const payload = { username, email, role };

      if (passwordEl.value.trim()) {
        if (passwordEl.value.trim() !== password2El.value.trim()) {
          Store.setError("Yeni şifreler eşleşmiyor!");
          passwordEl.classList.add("is-invalid");
          password2El.classList.add("is-invalid");
          isValid = false;
        } else if (!passwordRegex(passwordEl)) {
          isValid = false;
        }
        payload.password = passwordEl.value.trim();
      }

      if (!isValid) return;

      try {
        const response = await patchRequest(
          `${Config.endpoints.users}/${user.id}`,
          payload,
        );
        if (!response) throw new Error("Güncelleme işlemi başarısız oldu.");

        const updatedUser = await getRequest(
          `${Config.endpoints.users}/${user.id}`,
        );
        Store.updateUser(updatedUser);
        document.getElementById("welcome-message").textContent =
          updatedUser.username;
        Store.clearError();
        alert("Profil başarıyla güncellendi!");

        document.getElementById("new-password").value = "";
        document.getElementById("new-password2").value = "";
      } catch (error) {
        console.error("İşlem hatası:", error);
        alert("Hata: " + (error.message || "İşlem başarısız oldu."));
      }
    });
  }
});
