const users = [
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

localStorage.setItem("users", JSON.stringify(users));

function renderTable() {
  const table = document.getElementById("userTable");
  table.innerHTML = "";

  users.forEach((user, index) => {
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
       onclick="deleteUser('${user.username}')">

</td>

      </tr>
    `;
  });
}

// =========================
// ACTIONS
// =========================
function editUser(username) {
  alert("แก้ไข: " + username);
}

function deleteUser(username) {
  if (confirm("ต้องการลบ " + username + " ?")) {
    alert("ลบแล้ว: " + username);
  }
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

// ROLE
function filterRole(role) {
  document.getElementById("selectedRole").innerText =
    role.charAt(0).toUpperCase() + role.slice(1);

  document.getElementById("roleMenu").classList.remove("show");

  console.log("Role:", role);
}

// STATUS
function filterStatus(status) {
  document.getElementById("selectedStatus").innerText =
    status.charAt(0).toUpperCase() + status.slice(1);

  document.getElementById("statusMenu").classList.remove("show");

  console.log("Status:", status);
}

// =========================
// INIT
// =========================
renderTable();

function editUser(username) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username);

  if (!user) {
    alert("ไม่พบผู้ใช้");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));

  window.location.href = "Edit_Information.html";;
}