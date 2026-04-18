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
  
  function renderTable() {
    const table = document.getElementById("userTable");
  
    users.forEach(user => {
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
            ✏️ 🗑️
          </td>
  
        </tr>
      `;
    });
  }
  
  function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("hide");
  }
  
  function logout() {
    localStorage.clear();
    window.location.href = "../../login.html";
  }
  
  renderTable();
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