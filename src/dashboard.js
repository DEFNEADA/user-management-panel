import { CheckAuth, logout } from "./assets/auth.js";
import { Store } from "./assets/store.js";
import { renderUsers } from "./assets/render.js";
import { Config } from "./api/config.js";
import {
  patchRequest,
  getRequest,
  postRequest,
  deleteRequest,
} from "./api/api.js";
import { emailRegex, passwordRegex, usernameRegex } from "./assets/regex.js";

document.addEventListener("DOMContentLoaded", () => {
  CheckAuth();

  const user = Store.currentUser;
  if (user) {
    document.getElementById("welcome-message").textContent = `${user.username}`;
  }

  let deleteUserId = null;

  const logoutBtn = document.getElementById("logout-button");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logout();
      window.location.href = "login.html";
    });
  }

  const adduserbutton = document.getElementById("adduserbutton");
  if (adduserbutton) {
    adduserbutton.addEventListener("click", () => {
      document.getElementById("user-add-form").reset();
      document.getElementById("user-id").value = "";
      document.querySelector("#user-add-Modal .modal-title").textContent =
        "Yeni Kullanıcı Ekle";
    });
  }

  const userList = document.getElementById("userlist");
  if (userList) {
    userList.addEventListener("click", async (e) => {
      const editBtn = e.target.closest(".edit-btn");
      if (editBtn) {
        const id = editBtn.getAttribute("data-id");
        const user = await getRequest(`${Config.endpoints.users}/${id}`);
        if (user) {
          document.getElementById("edit-username").value = user.username || "";
          document.getElementById("edit-email").value = user.email || "";
          const roleEl = document.getElementById("edit-role");
          if (roleEl) roleEl.value = user.role || "user";
          document.getElementById("edit-password").value = "";
          document.getElementById("edit-password2").value = "";
          document.getElementById("user-id").value = user.id; // ID'yi kaydet hiddn

          const modalEl = document.getElementById("user-edit-Modal");
          const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
          modal.show();
        }
      }

      const deleteBtn = e.target.closest(".delete-btn");
      if (deleteBtn) {
        const id = deleteBtn.getAttribute("data-id");

        if (id == Store.state.user.id) {
          alert("Kendinizi silemezsiniz!");
          return;
        }

        deleteUserId = id;
      }

      const detailsbtn = e.target.closest(".details-btn");
      if (detailsbtn) {
        const id = detailsbtn.getAttribute("data-id");
        try {
          const user = await getRequest(`${Config.endpoints.users}/${id}`);
          if (user) {
            document.getElementById("detail-username").textContent =
              user.username || "-";
            document.getElementById("detail-email").textContent =
              user.email || "-";
            document.getElementById("detail-role").textContent =
              user.role || "-";
            document.getElementById("detail-id").textContent = user.id || "-";
          } else {
            alert("Kullanıcı bulunamadı");
            return;
          }
        } catch (error) {
          console.error("İşlem hatası:", error);
        }
      }
    });
  }

  const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", async () => {
      if (deleteUserId) {
        try {
          await deleteRequest(`${Config.endpoints.users}/${deleteUserId}`);
          const modalEl = document.getElementById("userdeleteinform");
          const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
          modal.hide();
          renderUsers();
        } catch (error) {
          alert("Silme işlemi başarısız: " + error.message);
        }
      }
    });
  }
  const editform = document.getElementById("user-edit-form");
  if (editform) {
    editform.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("user-id").value;
      const username = document.getElementById("edit-username").value;
      const email = document.getElementById("edit-email").value;
      const password = document.getElementById("edit-password").value;
      const password2 = document.getElementById("edit-password2").value;
      const roleEl = document.getElementById("edit-role");
      const role = roleEl && roleEl.value ? roleEl.value : "user";

      const payload = { username, email, role };

      if (!emailRegex(email)) return;
      if (!usernameRegex(username)) return;
      if (password) {
        if (password !== password2) {
          alert("Şifreler eşleşmiyor!");
          return;
        }
        if (!passwordRegex(password)) return;
        payload.password = password;
      }

      try {
        await patchRequest(`${Config.endpoints.users}/${id}`, payload);

        renderUsers();

        // Modalı kapat
        const modalEl = document.getElementById("user-edit-Modal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        editform.reset();

        if (id == Store.state.user.id) {
          const updatedUser = await getRequest(
            `${Config.endpoints.users}/${id}`,
          );
          Store.updateUser(updatedUser);
          document.getElementById("welcome-message").textContent =
            updatedUser.username;
        }
      } catch (error) {
        console.error("İşlem hatası:", error);
        alert("Hata: " + (error.message || "İşlem başarısız oldu."));
      }
    });
  }

  const addForm = document.getElementById("user-add-form");
  if (addForm) {
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const password2 = document.getElementById("password2").value;
      const roleEl = document.getElementById("role");
      const role = roleEl && roleEl.value ? roleEl.value : "user";

      const payload = { username, email, role, password };

      if (!emailRegex(email)) return;
      if (!usernameRegex(username)) return;

      if (password !== password2) {
        alert("Şifreler eşleşmiyor!");
        return;
      }
      if (!passwordRegex(password)) return;
      if (!password) {
        alert("Yeni kullanıcı için şifre zorunludur!");
        return;
      }

      try {
        await postRequest(Config.endpoints.users, payload);
        renderUsers();

        addForm.reset();
      } catch (error) {
        console.error("İşlem hatası:", error);
        alert("Hata: " + (error.message || "İşlem başarısız oldu."));
      }
    });
  }

  renderUsers();
});
