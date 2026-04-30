// ============================================================
// User_Dashboard.js (FINAL BACKEND FIXED)
// ============================================================

const API_BASE = '/api/admin';

let selectedRole   = "all";
let selectedStatus = "all";
let deleteId       = null;
let allUsers       = [];

// =========================
// DEFAULT AVATAR
// =========================
const DEFAULT_AVATAR =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e0dff7'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%237b6ee6'/%3E%3Cellipse cx='50' cy='85' rx='28' ry='20' fill='%237b6ee6'/%3E%3C/svg%3E";

// =========================
// LOAD USERS
// =========================
async function loadUsers() {
  try {
    const res = await fetch('/api/admin/users');

    if (!res.ok) {
      throw new Error('โหลดข้อมูลไม่ได้');
    }

    const users = await res.json();

    // กันกรณี backend ส่ง null / ไม่ใช่ array
    allUsers = Array.isArray(users) ? users : [];

    renderTable();

  } catch (err) {
    console.error("LOAD USERS ERROR:", err);

    const table = document.getElementById('userTable');
    if (table) {
      table.innerHTML = `
        <tr>
          <td colspan="7" style="color:red;text-align:center;">
            โหลดข้อมูลไม่สำเร็จ
          </td>
        </tr>
      `;
    }
  }
}

// =========================
// RENDER TABLE
// =========================
function renderTable() {
  const table = document.getElementById("userTable");
  table.innerHTML = "";

  const filtered = allUsers.filter(user => {
    const roleMatch =
        selectedRole === "all" ||
        (user.role || "").toLowerCase() === selectedRole;

    const statusMatch =
        selectedStatus === "all" ||
        (user.status || "").toLowerCase() === selectedStatus;

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

  filtered.forEach(user => {

    const displayName =
        user.fullname ||
        user.name ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        "-";

    const avatar = user.profileImage || DEFAULT_AVATAR;

    const statusRaw = user.status || "active";
    const status    = statusRaw.toLowerCase();

    table.innerHTML += `
      <tr>
        <td>
          <img src="${avatar}"
               class="table-avatar"
               onerror="this.src='${DEFAULT_AVATAR}'">
        </td>

        <td>${displayName}</td>
        <td>${user.username || "-"}</td>
        <td>${user.email || "-"}</td>

        <td>
          <span class="status ${status}"
                onclick="toggleStatus(${user.userId})"
                style="cursor:pointer;">
            ${statusRaw}
          </span>
        </td>

        <td>${user.role}</td>

        <td class="actions">
          <img src="../../img/Edit2.png"
               class="action-icon"
               onclick="editUser(${user.userId})">

          <img src="../../img/delete.png"
               class="action-icon"
               onclick="openDeleteModal(${user.userId})">
        </td>
      </tr>
    `;
  });
}

// =========================
// TOGGLE STATUS
// =========================
async function toggleStatus(id) {
  console.log("CLICK:", id);

  try {
    const res = await fetch(`${API_BASE}/users/${id}/status`, {
      method: 'PATCH'
    });

    if (!res.ok) throw new Error('เปลี่ยนสถานะไม่สำเร็จ');

    const data = await res.json();

    const user = allUsers.find(u => u.userId === id);
    if (user) user.status = data.status;

    renderTable();

  } catch (err) {
    alert(err.message);
  }
}

// =========================
// EDIT USER
// =========================
function editUser(id) {
  const user = allUsers.find(u => u.userId === id);
  if (user) {
    sessionStorage.setItem("editUser", JSON.stringify(user));
  }
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

async function confirmDelete() {
  if (deleteId === null) return;

  try {
    const res = await fetch(`${API_BASE}/users/${deleteId}`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error('ลบไม่สำเร็จ');

    allUsers = allUsers.filter(u => u.userId !== deleteId);

    renderTable();
    closeDeleteModal();

  } catch (err) {
    alert(err.message);
  }
}

// =========================
// SEARCH
// =========================
function searchUsers(keyword) {
  const kw = keyword.toLowerCase().trim();

  const filtered = allUsers.filter(u => {
    const name  = (u.fullname || u.name || "").toLowerCase();
    const uname = (u.username || "").toLowerCase();
    const email = (u.email || "").toLowerCase();

    return name.includes(kw) || uname.includes(kw) || email.includes(kw);
  });

  const table = document.getElementById("userTable");
  table.innerHTML = "";

  filtered.forEach(user => {

    const displayName =
        user.fullname ||
        user.name ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        "-";

    const avatar = user.profileImage || DEFAULT_AVATAR;
    const status = (user.status || "active").toLowerCase();

    table.innerHTML += `
      <tr>
        <td><img src="${avatar}" class="table-avatar"></td>
        <td>${displayName}</td>
        <td>${user.username || "-"}</td>
        <td>${user.email || "-"}</td>

        <td>
          <span class="status ${status}"
                onclick="toggleStatus(${user.userId})">
            ${user.status}
          </span>
        </td>

        <td>${user.role}</td>

        <td class="actions">
          <img src="../../img/Edit2.png" onclick="editUser(${user.userId})">
          <img src="../../img/delete.png" onclick="openDeleteModal(${user.userId})">
        </td>
      </tr>
    `;
  });
}

// =========================
// FILTER
// =========================
function filterRole(role) {
  selectedRole = role;
  document.getElementById("selectedRole").innerText =
      role === "all" ? "All" : role.charAt(0).toUpperCase() + role.slice(1);
  renderTable();
}

function filterStatus(status) {
  selectedStatus = status;
  document.getElementById("selectedStatus").innerText =
      status === "all" ? "All" : status;
  renderTable();
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
// SIDEBAR / LOGOUT
// =========================
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("hide");
}

function logout() {
  window.location.href = "../../login.html";
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
  // เก็บ role ไว้ใช้ในหน้า create_users
  sessionStorage.setItem(
      "createRole",
      role.charAt(0).toUpperCase() + role.slice(1)
  );

  // ไปหน้าเดียวเสมอ (ต้องใช้ path เต็มใน Spring Boot)
  window.location.href = "/Admin/html/create_users.html";
}

// =========================
// NAV
// =========================
function goProfile() {
  window.location.href = "profile.html";
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  loadUsers();

  const searchInput = document.querySelector(".search");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchUsers(this.value);
    });
  }
});