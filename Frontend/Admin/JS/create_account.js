document.addEventListener("DOMContentLoaded", function () {

  const roleInput = document.getElementById("role");
  const roleButtons = document.querySelectorAll(".role-btn");

  // =========================
  // LOAD ROLE (จาก dashboard)
  // =========================
  let savedRole = localStorage.getItem("createRole") || "Admin";

  // set default
  roleInput.value = savedRole;

  roleButtons.forEach(btn => {
    btn.classList.remove("active");

    if (btn.dataset.role === savedRole) {
      btn.classList.add("active");
    }
  });

  // =========================
  // CLICK ROLE
  // =========================
  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      roleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      roleInput.value = btn.dataset.role;
    });
  });

  // =========================
  // SUBMIT FORM
  // =========================
  const form = document.getElementById("createForm");

  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
  
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();
  
      // =========================
      // VALIDATE
      // =========================
  
      // required
      if (!name || !email || !password || !confirmPassword) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
      }
  
      // email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("รูปแบบอีเมลไม่ถูกต้อง");
        return;
      }
  
      // password length
      if (password.length < 6) {
        alert("รหัสผ่านต้องอย่างน้อย 6 ตัว");
        return;
      }
  
      // password match
      if (password !== confirmPassword) {
        alert("รหัสผ่านไม่ตรงกัน");
        return;
      }
  
      // =========================
      // LOAD USERS
      // =========================
      let users = JSON.parse(localStorage.getItem("users")) || [];
  
      // duplicate email
      const isDuplicate = users.some(u => u.email === email);
      if (isDuplicate) {
        alert("อีเมลนี้ถูกใช้งานแล้ว");
        return;
      }
  
      // =========================
      // CREATE USER
      // =========================
      const newUser = {
        name,
        username: name,
        email,
        password,   
        role: roleInput.value,
        status: "active"
      };
  
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
  
      alert("สร้างผู้ใช้สำเร็จ");
  
      window.location.href = "User_Dashboard.html";
    });
  }
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

document.addEventListener("DOMContentLoaded", function () {

  const roleButtons = document.querySelectorAll(".role-btn");
  const roleInput = document.getElementById("role");

  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      const role = btn.dataset.role;

      // ถ้าเป็น patient → ไปอีกหน้า
      if (role === "patient") {
        window.location.href = "Create_Patient.html";
        return;
      }

      // ถ้าไม่ใช่ → เปลี่ยน active
      roleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      roleInput.value = role;
    });
  });

});