// =========================
// LOAD USER
// =========================
const user = JSON.parse(localStorage.getItem("currentUser"));

if (user) {
  document.getElementById("username").innerText = user.username;
  document.getElementById("email").innerText = user.email;

  document.getElementById("name").value = user.name;
  document.getElementById("emailInput").value = user.email;
  document.getElementById("role").value = user.role;
  document.getElementById("status").value = user.status;
}

// =========================
// SAVE
// =========================
document.getElementById("editForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const updatedUser = {
    name: document.getElementById("name").value,
    username: user.username,
    email: document.getElementById("emailInput").value,
    role: document.getElementById("role").value,
    status: document.getElementById("status").value
  };

  users = users.map(u => 
    u.username === user.username ? updatedUser : u
  );

  localStorage.setItem("users", JSON.stringify(users));

  alert("บันทึกสำเร็จ!");
  window.location.href = "User_Dashboard.html";
});

// =========================
// BACK
// =========================
function goBack() {
  window.location.href = "User_Dashboard.html";
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