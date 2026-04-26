// ============================================================
// User_Dashboard.js
// ============================================================

let selectedRole   = "all";
let selectedStatus = "all";
let deleteId       = null;

// =========================
// DEFAULT AVATAR SVG (inline ใช้เมื่อไม่มีรูป)
// =========================
const DEFAULT_AVATAR_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e0dff7'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%237b6ee6'/%3E%3Cellipse cx='50' cy='85' rx='28' ry='20' fill='%237b6ee6'/%3E%3C/svg%3E";

// =========================
// DEFAULT USERS
// =========================
const defaultUsers = [
  {
    id: 1,
    name: "นาย กฤต",
    fullname: "นาย กฤต",
    username: "Krit_TheTank",
    email: "krit@gmail.com",
    status: "active",
    role: "Patient",
    profileImage: ""
  },
  {
    id: 2,
    name: "นางสาว นิชา",
    fullname: "นางสาว นิชา",
    username: "Nicha",
    email: "nicha@gmail.com",
    status: "inactive",
    role: "Doctor",
    profileImage: ""
  }
];

if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(defaultUsers));
}

// =========================
// RENDER TABLE
// =========================
function renderTable() {
  const table = document.getElementById("userTable");
  table.innerHTML = "";

  const users = JSON.parse(localStorage.getItem("users")) || [];

  // กรองก่อน render
  const filtered = users.filter(user => {
    const roleMatch   = selectedRole   === "all" || (user.role   || "").toLowerCase() === selectedRole;
    const statusMatch = selectedStatus === "all" || (user.status || "").toLowerCase() === selectedStatus;
    return roleMatch && statusMatch;
  });

  if (filtered.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; color:#aaa; padding:24px;">
          ไม่พบข้อมูลผู้ใช้
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach((user) => {
    // ✅ รองรับทั้ง default users และ users จากการสมัครใหม่
    const displayName = user.fullname
      || user.name
      || `${user.firstname || ""} ${user.lastname || ""}`.trim()
      || "-";

    // ✅ ถ้าไม่มีรูปโปรไฟล์ ใช้ DEFAULT_AVATAR_SVG
    const avatar = (user.profileImage && user.profileImage !== "")
      ? user.profileImage
      : DEFAULT_AVATAR_SVG;

    const statusText  = user.status  || "active";
    const roleText    = user.role    || "Patient";

    table.innerHTML += `
      <tr>
        <td>
          <img src="${avatar}"
               class="table-avatar"
               onerror="this.src='${DEFAULT_AVATAR_SVG}'"
               style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
        </td>
        <td>${displayName}</td>
        <td>${user.username || "-"}</td>
        <td>${user.email || "-"}</td>
        <td>
          <span class="status ${statusText}"
                onclick="toggleStatus(${user.id})"
                style="cursor:pointer;">
            ${statusText}
          </span>
        </td>
        <td>${roleText}</td>
        <td class="actions">
          <img src="../../img/Edit2.png"
               class="action-icon"
               onclick="editUser(${user.id})">
          <img src="../../img/delete.png"
               class="action-icon"
               onclick="openDeleteModal(${user.id})">
        </td>
      </tr>
    `;
  });
}

// =========================
// TOGGLE STATUS
// =========================
function toggleStatus(id) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const index = users.findIndex(u => u.id == id);
  if (index === -1) return;

  users[index].status =
    users[index].status === "active" ? "inactive" : "active";

  localStorage.setItem("users", JSON.stringify(users));
  renderTable();
}

// =========================
// EDIT USER
// =========================
function editUser(id) {
  localStorage.setItem("editUserId", id);
  window.location.href = "Edit_Information.html";
}

// =========================
// DELETE
// =========================
function openDeleteModal(id) {
  deleteId = id;
  document.getElementById("deleteModal").classList.add("show");
}

function closeDeleteModal() {
  deleteId = null;
  document.getElementById("deleteModal").classList.remove("show");
}

function confirmDelete() {
  if (deleteId === null) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.filter(u => u.id != deleteId);

  localStorage.setItem("users", JSON.stringify(users));

  renderTable();
  closeDeleteModal();
}

// =========================
// SIDEBAR
// =========================
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("hide");
  localStorage.setItem("sidebarHidden", sidebar.classList.contains("hide"));
}

// =========================
// LOGOUT
// =========================
function logout() {
  localStorage.removeItem("editUserId");
  localStorage.removeItem("editUser");
  window.location.href = "../../login.html";
}

// =========================
// DROPDOWN
// =========================
function toggleDropdown(menuId, btn) {
  const menu  = document.getElementById(menuId);
  const arrow = btn.querySelector(".arrowdropdown");

  menu.classList.toggle("show");
  if (arrow) arrow.classList.toggle("rotate");
}

document.addEventListener("click", function (e) {
  if (!e.target.closest(".role-dropdown")) {
    document.querySelectorAll(".dropdown-menu").forEach(menu => {
      menu.classList.remove("show");
    });
  }
});

// =========================
// FILTER
// =========================
function filterRole(role) {
  selectedRole = role;

  document.getElementById("selectedRole").innerText =
    role === "all" ? "All" : role.charAt(0).toUpperCase() + role.slice(1);

  document.getElementById("roleMenu").classList.remove("show");

  renderTable();
}

function filterStatus(status) {
  selectedStatus = status;

  document.getElementById("selectedStatus").innerText =
    status === "all" ? "All" : status;

  document.getElementById("statusMenu").classList.remove("show");

  renderTable();
}

// =========================
// ADD USER
// =========================
function openRoleModal() {
  document.getElementById("roleModal").classList.add("show");
}

function closeRoleModal() {
  document.getElementById("roleModal").classList.remove("show");
}

function selectRole(role) {
  window.location.href = `create_users.html?role=${role}`;
}

// =========================
// SEARCH (ถ้ามี input search)
// =========================
function searchUsers(keyword) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const kw    = keyword.toLowerCase().trim();

  const table = document.getElementById("userTable");
  table.innerHTML = "";

  const filtered = users.filter(u => {
    const name = (u.fullname || u.name || "").toLowerCase();
    const uname = (u.username || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    return name.includes(kw) || uname.includes(kw) || email.includes(kw);
  });

  if (filtered.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; color:#aaa; padding:24px;">
          ไม่พบผู้ใช้ที่ค้นหา
        </td>
      </tr>
    `;
    return;
  }

  // render ผลลัพธ์ (ใช้โค้ด render เดิม)
  filtered.forEach((user) => {
    const displayName = user.fullname
      || user.name
      || `${user.firstname || ""} ${user.lastname || ""}`.trim()
      || "-";

    const avatar = (user.profileImage && user.profileImage !== "")
      ? user.profileImage
      : DEFAULT_AVATAR_SVG;

    const statusText = user.status || "active";
    const roleText   = user.role   || "Patient";

    table.innerHTML += `
      <tr>
        <td>
          <img src="${avatar}"
               class="table-avatar"
               onerror="this.src='${DEFAULT_AVATAR_SVG}'"
               style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
        </td>
        <td>${displayName}</td>
        <td>${user.username || "-"}</td>
        <td>${user.email || "-"}</td>
        <td>
          <span class="status ${statusText}" onclick="toggleStatus(${user.id})" style="cursor:pointer;">
            ${statusText}
          </span>
        </td>
        <td>${roleText}</td>
        <td class="actions">
          <img src="../../img/Edit2.png" class="action-icon" onclick="editUser(${user.id})">
          <img src="../../img/delete.png" class="action-icon" onclick="openDeleteModal(${user.id})">
        </td>
      </tr>
    `;
  });
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("sidebarHidden") === "true") {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) sidebar.classList.add("hide");
  }

  renderTable();
});

function goProfile() {
  window.location.href = "profile.html";
}
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search");

  searchInput.addEventListener("input", function () {
    searchUsers(this.value);
  });
});