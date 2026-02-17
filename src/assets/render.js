import { getRequest } from "../api/api.js";
import { Config } from "../api/config.js";
import { Store } from "../assets/store.js";

let currentPage = 1;
const itemsPerPage = 7;

export async function renderUsers() {
  const userList = document.getElementById("userlist");
  const paginationControls = document.getElementById("pagination-controls");

  if (!userList) return;

  try {
    const users = await getRequest(Config.endpoints.users);
    const currentUser = Store.currentUser;

    const totalItems = users.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage; //hangi indexten başlicağmızı buluyoruz
    const end = start + itemsPerPage;
    const paginatedUsers = users.slice(start, end);

    userList.innerHTML = paginatedUsers
      .map(
        (user, index) => `
            <tr>
                <td>${start + index + 1}</td>
                <td>
                    <div class="bg-secondary rounded-circle d-flex justify-content-center align-items-center text-white" style="width: 30px; height: 30px;">
                        ${(user.username || user.email).charAt(0).toUpperCase()}
                    </div>
                </td>
                <td>${user.email}</td>
                <td><span class="badge bg-${user.role === "admin" ? "danger" : "primary"}">${user.role || "user"}</span></td>
                <td >
                    ${
                      currentUser &&
                      (currentUser.role === "admin" ||
                        currentUser.role === "editor")
                        ? `<button class="btn btn-sm btn-outline-primary edit-btn" data-id="${user.id}">Düzenle</button>`
                        : ""
                    }
                    ${
                      currentUser && currentUser.role === "admin"
                        ? `<button class="btn btn-sm btn-outline-danger delete-btn" data-id="${user.id}">Sil</button>`
                        : ""
                    }
                    <button class="btn btn-sm btn-outline-success details-btn" data-id="${user.id}">Detaylar</button>
                
                </td>
            </tr>
        `,
      )
      .join("");

    if (paginationControls) {
      let paginationHTML = "";

      paginationHTML += `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
          <a class="page-link" href="#" data-page="${currentPage - 1}">Önceki</a>
        </li>
      `;

      for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
          <li class="page-item ${currentPage === i ? "active" : ""}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
          </li>
        `;
      }
      paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
          <a class="page-link" href="#" data-page="${currentPage + 1}">Sonraki</a>
        </li>
      `;

      paginationControls.innerHTML = paginationHTML;

      paginationControls.querySelectorAll(".page-link").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const newPage = parseInt(e.target.getAttribute("data-page"));
          if (newPage > 0 && newPage <= totalPages) {
            currentPage = newPage;
            renderUsers();
          }
        });
      });
    }
  } catch (error) {
    console.error("Kullanıcılar yüklenemedi:", error);
  }
}
