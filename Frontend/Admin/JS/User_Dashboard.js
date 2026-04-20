// =========================
// INIT DATA 
// =========================
let selectedRole = "all";
let selectedStatus = "all";
let deleteUsername = null;

const defaultUsers = [
  {
    name: "นาย กฤต",
    username: "Krit_TheTank",
    email: "krit@gmail.com",
    status: "active",
    role: "Patient",
    profileImage: "../../img/profile.jpg"
  },
  {
    name: "นางสาว นิชา",
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
// RENDER TABLE (ตัวเดียวพอ)
// =========================
function renderTable() {
  const table = document.getElementById("userTable");
  table.innerHTML = "";

  const users = JSON.parse(localStorage.getItem("users")) || [];

  users.forEach((user, index) => {

    // FILTER ROLE
    if (selectedRole !== "all" && user.role.toLowerCase() !== selectedRole) {
      return;
    }

    // FILTER STATUS
    if (selectedStatus !== "all" && user.status.toLowerCase() !== selectedStatus) {
      return;
    }

    table.innerHTML += `
      <tr>
        <td>
          <img src="${user.profileImage && user.profileImage !== '' 
  ? user.profileImage 
  : '../../img/profile.png'}" 
class="table-avatar">
        </td>

        <td>${user.fullname || user.name || "-"}</td>
        <td>${user.username || "-"}</td>
        <td>${user.email || "-"}</td>

        <td>
          <span class="status ${user.status}" onclick="toggleStatus(${index})">
            ${user.status}
          </span>
        </td>

        <td>${user.role}</td>

        <td class="actions">
          <img src="../../img/Edit2.png" 
               class="action-icon" 
               onclick="editUser('${user.username}')">

          <img src="../../img/delete.png" 
               class="action-icon" 
               onclick="openDeleteModal('${user.username}')">
        </td>
      </tr>
    `;
  });
}

// =========================
// TOGGLE STATUS
// =========================
function toggleStatus(index) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  users[index].status =
    users[index].status === "active" ? "inactive" : "active";

  localStorage.setItem("users", JSON.stringify(users));

  renderTable();
}

// =========================
// EDIT USER
// =========================
function editUser(username) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username);

  if (!user) {
    alert("ไม่พบผู้ใช้");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href = "Edit_Information.html";
}

// =========================
// DELETE
// =========================
function openDeleteModal(username) {
  deleteUsername = username;
  document.getElementById("deleteModal").classList.add("show");
}

function closeDeleteModal() {
  deleteUsername = null;
  document.getElementById("deleteModal").classList.remove("show");
}

function confirmDelete() {
  if (!deleteUsername) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.filter(u => u.username !== deleteUsername);

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
  const menu = document.getElementById(menuId);
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
// ADD USER (ROLE SELECT)
// =========================
function openRoleModal() {
  document.getElementById("roleModal").classList.add("show");
}

function closeRoleModal() {
  document.getElementById("roleModal").classList.remove("show");
}

function selectRole(role) {
  localStorage.setItem("createRole", role);

  if (role === "patient") {
    window.location.href = "Create_Patient.html";
  } else {
    window.location.href = "Create_Account.html";
  }
}

// =========================
// INIT
// =========================
renderTable();