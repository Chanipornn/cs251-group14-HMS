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
    role: "Patient"
  },
  {
    name: "นางสาว นิชา",
    username: "Nicha",
    email: "nicha@gmail.com",
    status: "inactive",
    role: "Doctor"
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
        <td><input type="checkbox"></td>

        <td class="user-cell">
          <img src="../../img/profile.jpg">
          ${user.name}
        </td>

        <td>${user.username}</td>
        <td>${user.email}</td>

        <td>
          <span class="status ${user.status}">
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
// DELETE MODAL
// =========================
function openDeleteModal(username) {
  deleteUsername = username;

  const modal = document.getElementById("deleteModal");
  if (modal) modal.classList.add("show");
}

function closeDeleteModal() {
  deleteUsername = null;

  const modal = document.getElementById("deleteModal");
  if (modal) modal.classList.remove("show");
}

function confirmDelete() {
  if (!deleteUsername) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // 🔥 ลบแบบถูกต้อง
  users = users.filter(u => u.username !== deleteUsername);

  localStorage.setItem("users", JSON.stringify(users));

  renderTable();
  closeDeleteModal();
}

// =========================
// SIDEBAR
// =========================
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("hide");
}

// =========================
// LOGOUT
// =========================
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

// ปิด dropdown เมื่อคลิกที่อื่น
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
selectedRole = "all";
selectedStatus = "all";

renderTable();