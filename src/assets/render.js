import { getRequest } from "../api/api.js";
import { Config } from "../api/config.js";
import { Store } from "../assets/store.js";

let currentPage = 1;
const itemsPerPage = 6;
let searchQuery = "";
let searchRole = "";
const cancel = document.getElementById("cancel");
cancel.addEventListener("click", () => {
  clearSearchBar();
});

export function clearSearchBar() {
  const searchBox = document.getElementById("search-input");
  searchBox.value = "";
  searchQuery = "";
  currentPage = 1;
  renderUsers();
}
export function initSearch() {
  const searchBox = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const roleSelect = document.getElementById("search-role");

  if (searchBox && searchButton && roleSelect) {
    searchButton.addEventListener("click", () => {
      searchQuery = searchBox.value.trim();
      currentPage = 1;
      renderUsers();
    });

    searchBox.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        searchQuery = searchBox.value.trim();
        currentPage = 1;
        renderUsers();
      }
    });

    roleSelect.addEventListener("change", (e) => {
      searchRole = e.target.value;
      currentPage = 1;
      renderUsers();
    });
  }
}

export async function renderUsers() {
  const userList = document.getElementById("userlist");
  const paginationControls = document.getElementById("pagination-controls");

  if (!userList) return;

  try {
    let queryParams = `email_like=${searchQuery}`;
    if (searchRole && searchRole !== "hepsi") {
      queryParams += `&role=${searchRole}`;
    }

    const allUsers = await getRequest(
      `${Config.endpoints.users}?${queryParams}`,
    );
    const totalItems = allUsers.length;
    const endpoint = `${Config.endpoints.users}?_page=${currentPage}&_limit=${itemsPerPage}&${queryParams}`;
    const paginationUsers = await getRequest(endpoint);
    const currentUser = Store.currentUser;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    userList.innerHTML = paginationUsers
      .map((user, index) => {
        const displayIndex = (currentPage - 1) * itemsPerPage + index + 1;
        return `
            <tr>
                <td>${displayIndex}</td>
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
        `;
      })
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
          const newPage = parseInt(btn.getAttribute("data-page"));
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
