import { getRequest } from "../api/api.js";
import { Config } from "../api/config.js";
import { Store } from "../assets/store.js";

export async function renderUsers() {
  const userList = document.getElementById("userlist");
  if (!userList) return;

  try {
    const users = await getRequest(Config.endpoints.users);
    userList.innerHTML = users
      .map(
        (user, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <div class="bg-secondary rounded-circle d-flex justify-content-center align-items-center text-white" style="width: 30px; height: 30px;">
                        ${(user.username || user.email).charAt(0).toUpperCase()}
                    </div>
                </td>
                <td>${user.email}</td>
                <td><span class="badge bg-${user.role === "admin" ? "danger" : "primary"}">${user.role || "user"}</span></td>
                <td >
                    <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${user.id}">Düzenle</button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${user.id}">Sil</button>
                    <button class="btn btn-sm btn-outline-success details-btn" data-id="${user.id}">Detaylar</button>
                
                </td>
            </tr>
        `,
      )
      .join("");
  } catch (error) {
    console.error("Kullanıcılar yüklenemedi:", error);
  }
}
