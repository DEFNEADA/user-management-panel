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

      const username = document.getElementById("profile-username").value;
      const email = document.getElementById("profile-email").value;
      const role = document.getElementById("profile-role").value;
      const password = document.getElementById("new-password").value;
      const password2 = document.getElementById("new-password2").value;
      if (!emailRegex(email)) return;
      if (!usernameRegex(username)) return;

      const payload = { username, email, role };

      if (password) {
        if (password !== password2) {
          alert("Yeni şifreler eşleşmiyor!");
          return;
        }
        if (!passwordRegex(password)) return;
        payload.password = password;
      }

      try {
        await patchRequest(`${Config.endpoints.users}/${user.id}`, payload);

        const updatedUser = await getRequest(
          `${Config.endpoints.users}/${user.id}`,
        );
        Store.updateUser(updatedUser);
        document.getElementById("welcome-message").textContent =
          updatedUser.username;
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
