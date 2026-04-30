/*// ============================================================
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

    if (selectedRole   !== "all" && user.role.toLowerCase()   !== selectedRole)   return;
    if (selectedStatus !== "all" && user.status.toLowerCase() !== selectedStatus) return;

    table.innerHTML += `
      <tr>
        <td>
          <img src="${user.profileImage || '../../img/profile.png'}" class="table-avatar">
        </td>

        <td>${user.fullname || user.name || "-"}</td>
        <td>${user.username || "-"}</td>
        <td>${user.email    || "-"}</td>

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

  // ใช้ == แทน === เพราะ id จาก onclick เป็น number แต่ใน localStorage อาจเป็น string
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
  // ใช้ != แทน !== เพราะ deleteId อาจเป็น number แต่ u.id ใน localStorage เป็น string
  if (deleteId === null) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.filter(u => u.id != deleteId);

  localStorage.setItem("users", JSON.stringify(users));

  renderTable();
  closeDeleteModal();
}

// =========================
// SIDEBAR / LOGOUT
// =========================
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("hide");
}

function logout() {
  localStorage.clear();
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

function selectRole(role) {

  // แปลงให้ format ตรง (Doctor / Admin / Staff)
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

  // เก็บไว้ให้หน้า create ใช้
  localStorage.setItem("createRole", formattedRole);

  // redirect
  if (role === "patient") {
    window.location.href = "create_patient.html";
  } else {
    window.location.href = "create_account.html";
  }

}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  renderTable();
}); */

// ============================================================
// User_Dashboard.js — ใช้ API แทน localStorage
// ============================================================
const API_BASE = '/api/admin';

let selectedRole   = "all";
let selectedStatus = "all";
let deleteId       = null;
let allUsers       = [];

// =========================
// LOAD USERS FROM API
// =========================
async function loadUsers() {
  try {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error('Failed to fetch');
    allUsers = await res.json();
    renderTable();
  } catch (err) {
    console.error('โหลดข้อมูลล้มเหลว:', err);
    document.getElementById('userTable').innerHTML =
      '<tr><td colspan="7" style="color:red;text-align:center;">โหลดข้อมูลไม่สำเร็จ</td></tr>';
  }
}

// =========================
// RENDER TABLE
// =========================
function renderTable() {
  const table = document.getElementById("userTable");
  table.innerHTML = "";

  const filtered = allUsers.filter(user => {
    const roleMatch   = selectedRole   === "all" || user.role.toLowerCase()   === selectedRole;
    const statusMatch = selectedStatus === "all" || user.status.toLowerCase() === selectedStatus;
    return roleMatch && statusMatch;
  });

  if (filtered.length === 0) {
    table.innerHTML = '<tr><td colspan="7" style="text-align:center;">ไม่พบข้อมูล</td></tr>';
    return;
  }

  filtered.forEach((user) => {
    table.innerHTML += `
      <tr>
        <td>
          <img src="../../img/profile.jpg" class="table-avatar">
        </td>
        <td>${user.username || "-"}</td>
        <td>${user.username || "-"}</td>
        <td>${user.email    || "-"}</td>
        <td>
          <span class="status ${user.status?.toLowerCase()}" onclick="toggleStatus(${user.userId})" style="cursor:pointer;">
            ${user.status}
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
// TOGGLE STATUS — เรียก PATCH /api/admin/users/{id}/status
// =========================
async function toggleStatus(id) {
  try {
    const res = await fetch(`${API_BASE}/users/${id}/status`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to toggle status');
    const data = await res.json();

    // อัปเดต local array แทนการโหลดใหม่ทั้งหมด
    const user = allUsers.find(u => u.userId === id);
    if (user) user.status = data.status;
    renderTable();
  } catch (err) {
    alert('เปลี่ยนสถานะไม่สำเร็จ: ' + err.message);
  }
}

// =========================
// EDIT USER
// =========================
function editUser(id) {
  const user = allUsers.find(u => u.userId === id);
  if (user) sessionStorage.setItem('editUser', JSON.stringify(user));
  window.location.href = "Edit_Information.html";
}

// =========================
// DELETE — เรียก DELETE /api/admin/users/{id}
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
    const res = await fetch(`${API_BASE}/users/${deleteId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');

    allUsers = allUsers.filter(u => u.userId !== deleteId);
    renderTable();
    closeDeleteModal();
  } catch (err) {
    alert('ลบไม่สำเร็จ: ' + err.message);
    closeDeleteModal();
  }
}

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
  document.getElementById("roleMenu")?.classList.remove("show");
  renderTable();
}

function filterStatus(status) {
  selectedStatus = status;
  document.getElementById("selectedStatus").innerText =
    status === "all" ? "All" : status;
  document.getElementById("statusMenu")?.classList.remove("show");
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
  if (role === "patient") {
    window.location.href = "create_patient.html";
  } else {
    sessionStorage.setItem("createRole", role.charAt(0).toUpperCase() + role.slice(1));
    window.location.href = "create_account.html";
  }
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", loadUsers);

// ================= PROFILE =================
function goProfile() {
  window.location.href = "profile.html";
}