// ============================================================
// User_Dashboard.js
// ============================================================

let selectedRole   = "all";
let selectedStatus = "all";
let deleteId       = null;

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
    profileImage: "../../img/profile.jpg"
  },
  {
    id: 2,
    name: "นางสาว นิชา",
    fullname: "นางสาว นิชา",
    username: "Nicha",
    email: "nicha@gmail.com",
    status: "inactive",
    role: "Doctor",
    profileImage: "../../img/profile.jpg"
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

  users.forEach((user) => {

    if (selectedRole !== "all" && user.role.toLowerCase() !== selectedRole) return;
    if (selectedStatus !== "all" && user.status.toLowerCase() !== selectedStatus) return;

    table.innerHTML += `
      <tr>
        <td>
          <img src="${user.profileImage || '../../img/profile.png'}" class="table-avatar">
        </td>
        <td>${user.fullname || user.name || "-"}</td>
        <td>${user.username || "-"}</td>
        <td>${user.email || "-"}</td>
        <td>
          <span class="status ${user.status}" onclick="toggleStatus(${user.id})">
            ${user.status}
          </span>
        </td>
        <td>${user.role}</td>
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
  arrow.classList.toggle("rotate");
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

// ส่ง role ที่เลือกไปพร้อมกับ URL เพื่อให้ create_users.js set role ได้ถูกต้องทันที
function selectRole(role) {
  window.location.href = `create_users.html?role=${role}`;
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("sidebarHidden") === "true") {
    document.querySelector(".sidebar").classList.add("hide");
  }

  renderTable();
});

function goProfile() {
  window.location.href = "profile.html";
}