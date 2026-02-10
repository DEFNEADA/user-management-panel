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

document.addEventListener("DOMContentLoaded", () => {
  CheckAuth();

  let deleteUserId = null;

  const user = Store.currentUser;
  if (user) {
    const displayName = user.username || user.fullName;
    document.getElementById("welcome-message").textContent = ` ${displayName}`;
  }

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
      document.getElementById("user-transactions-form").reset();
      document.getElementById("user-id").value = "";
      document.querySelector("#userAddModal .modal-title").textContent =
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
          document.getElementById("username").value = user.username || "";
          document.getElementById("email").value = user.email || "";
          document.getElementById("role").value = user.role || "user";
          document.getElementById("password").value = "";
          document.getElementById("password2").value = "";
          document.getElementById("user-id").value = user.id; // ID'yi kaydet
          document.querySelector("#userAddModal .modal-title").textContent =
            "Kullanıcı Düzenle";

          const modalEl = document.getElementById("userAddModal");
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

  const transactionForm = document.getElementById("user-transactions-form");
  if (transactionForm) {
    transactionForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = document.getElementById("user-id").value; //hiddnid
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const password2 = document.getElementById("password2").value;
      const roleEl = document.getElementById("role");
      const role = roleEl && roleEl.value ? roleEl.value : "user";

      const payload = { username, email, role };

      if (password) {
        if (password !== password2) {
          alert("Şifreler eşleşmiyor!");
          return;
        }
        payload.password = password;
      }

      try {
        if (id) {
          await patchRequest(`${Config.endpoints.users}/${id}`, payload);
        } else {
          if (!password) {
            alert("Yeni kullanıcı için şifre zorunludur!");
            return;
          }
          await postRequest(Config.endpoints.users, payload);
        }

        const modalEl = document.getElementById("userAddModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();
        renderUsers();
        transactionForm.reset();
      } catch (error) {
        console.error("İşlem hatası:", error);
        alert("Hata: " + (error.message || "İşlem başarısız oldu."));
      }
    });
  }

  renderUsers();
});
