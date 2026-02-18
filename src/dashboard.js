import { CheckAuth, logout } from "./assets/auth.js";
import { Store } from "./assets/store.js";
import { renderUsers, initSearch } from "./assets/render.js";
import { Config } from "./api/config.js";
import {
  patchRequest,
  getRequest,
  postRequest,
  deleteRequest,
} from "./api/api.js";
import { emailRegex, passwordRegex, usernameRegex } from "./assets/regex.js";
import showToast from "./assets/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  CheckAuth();
  initSearch();
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
    if (!user || user.role !== "admin") {
      adduserbutton.classList.add("d-none");
    }

    adduserbutton.addEventListener("click", () => {
      document.getElementById("user-add-form").reset();
      document.getElementById("user-id").value = "";
      Store.clearError();
    });
  }

  const userList = document.getElementById("userlist");
  if (userList) {
    userList.addEventListener("click", async (e) => {
      const editBtn = e.target.closest(".edit-btn");
      if (editBtn) {
        if (
          Store.currentUser.role !== "admin" &&
          Store.currentUser.role !== "editor"
        ) {
          showToast("Bu işlem için yetkiniz yok!", "error");
          return;
        }
        try {
          const id = editBtn.getAttribute("data-id");
          const user = await getRequest(`${Config.endpoints.users}/${id}`);
          if (user) {
            document.getElementById("edit-username").value =
              user.username || "";
            document.getElementById("edit-email").value = user.email || "";
            const roleEl = document.getElementById("edit-role");
            if (roleEl) {
              roleEl.value = user.role || "user";
              if (Store.currentUser.role !== "admin") {
                roleEl.disabled = true;
              }
            }
            document.getElementById("edit-password").value = "";
            document.getElementById("edit-password2").value = "";
            document.getElementById("user-id").value = user.id; // ID'yi kaydet hiddn

            const modalEl = document.getElementById("user-edit-Modal");
            const errorBox = modalEl.querySelector("#error-box");
            if (errorBox) {
              errorBox.classList.add("d-none");
              errorBox.classList.remove("d-block");
              errorBox.textContent = "";
            }

            const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
            modal.show();
            Store.clearError();
          }
        } catch (error) {
          console.error("Kullanıcı bilgileri yüklenirken hata:", error);
          showToast(
            error.message || "Kullanıcı bilgileri yüklenemedi.",
            "error",
          );
        }
      }

      const deleteBtn = e.target.closest(".delete-btn");
      if (deleteBtn) {
        if (Store.currentUser.role !== "admin") {
          showToast("Bu işlem için yetkiniz yok!", "error");
          return;
        }
        const id = deleteBtn.getAttribute("data-id");

        if (id == Store.state.user.id) {
          showToast("Kendinizi silemezsiniz!", "error");
          return;
        }

        deleteUserId = id;
        const modalEl = document.getElementById("userdeleteinform");
        const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
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
            const modalEl = document.getElementById("userdetailinform");
            const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
            modal.show();
          } else {
            showToast("Kullanıcı bulunamadı", "error");
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
          const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
          modal.hide();
          showToast("Kullanıcı başarıyla silindi!");
          renderUsers();
        } catch (error) {
          console.log("Silme işlemi başarısız: " + error.message);
          showToast("Silme işlemi başarısız: " + error.message, "error");
        }
      }
    });
  }
  const editform = document.getElementById("user-edit-form");
  if (editform) {
    editform.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (
        Store.currentUser.role !== "admin" &&
        Store.currentUser.role !== "editor"
      ) {
        showToast("Bu işlem için yetkiniz yok!", "error");
        return;
      }
      const id = document.getElementById("user-id").value;

      const usernameEl = document.getElementById("edit-username");
      const emailEl = document.getElementById("edit-email");
      const passwordEl = document.getElementById("edit-password");
      const password2El = document.getElementById("edit-password2");
      const roleEl = document.getElementById("edit-role");

      const username = usernameEl.value.trim();
      const email = emailEl.value.trim().toLowerCase();
      const password = passwordEl.value.trim();
      const password2 = password2El.value.trim();
      const role = roleEl && roleEl.value ? roleEl.value : "user";

      const payload = { username, email, role };

      let isValid = true;
      if (!emailRegex(emailEl)) isValid = false;
      if (!usernameRegex(usernameEl)) isValid = false;

      if (password) {
        if (password !== password2) {
          Store.setError("Şifreler eşleşmiyor!");
          passwordEl.classList.add("is-invalid");
          password2El.classList.add("is-invalid");
          isValid = false;
        } else {
          password2El.classList.remove("is-invalid");
          if (!passwordRegex(passwordEl)) isValid = false;
        }

        payload.password = password;
      }

      if (!isValid) return;

      try {
        const response = await patchRequest(
          `${Config.endpoints.users}/${id}`,
          payload,
        );
        if (response) {
          renderUsers();

          const modalEl = document.getElementById("user-edit-Modal");
          const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
          modal.hide();
          editform.reset();
          showToast("Kullanıcı başarıyla güncellendi!");
        } else {
          showToast("Kullanıcı güncellenemedi!", "error");
        }
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
        showToast(error.message || "İşlem hatası", "error");
      }
    });
  }

  const addForm = document.getElementById("user-add-form");
  if (addForm) {
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (Store.currentUser.role !== "admin") {
        showToast("Bu işlem için yetkiniz yok!", "error");
        return;
      }

      const usernameEl = document.getElementById("username");
      const emailEl = document.getElementById("email");
      const passwordEl = document.getElementById("password");
      const password2El = document.getElementById("password2");
      const roleEl = document.getElementById("role");

      const username = usernameEl.value.trim();
      const email = emailEl.value.trim().toLowerCase();
      const password = passwordEl.value.trim();
      const password2 = password2El.value.trim();
      const role = roleEl && roleEl.value ? roleEl.value : "user";

      const payload = { username, email, role, password };

      let isValid = true;
      if (!emailRegex(emailEl)) isValid = false;
      if (!usernameRegex(usernameEl)) isValid = false;

      if (password) {
        if (password !== password2) {
          Store.setError("Şifreler eşleşmiyor!");
          passwordEl.classList.add("is-invalid");
          password2El.classList.add("is-invalid");
          isValid = false;
        } else {
          password2El.classList.remove("is-invalid");
          if (!passwordRegex(passwordEl)) isValid = false;
        }
      } else {
        Store.setError("Lütfen tüm alanları doldurun.");
        passwordEl.classList.add("is-invalid");
        password2El.classList.add("is-invalid");
        isValid = false;
      }

      if (!isValid) return;

      try {
        const response = await postRequest(Config.endpoints.users, payload);
        if (response) {
          showToast("Kullanıcı başarıyla eklendi!");
          const modalEl = document.getElementById("user-add-Modal");
          const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
          modal.hide();
          addForm.reset();
          Store.clearError();
        } else {
          showToast("Kullanıcı eklenemedi!", "error");
        }
        renderUsers();
      } catch (error) {
        console.log("İşlem hatası:", error);
        showToast(error.message || "İşlem gerçekleşmedi", "error");
      }
    });
  }

  renderUsers();
});
