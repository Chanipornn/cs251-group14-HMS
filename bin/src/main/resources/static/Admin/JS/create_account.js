/*// ============================================================
// create_account.js
// ============================================================
document.addEventListener("DOMContentLoaded", function () {

  const roleInput   = document.getElementById("role");
  const roleButtons = document.querySelectorAll(".role-btn");
  const form        = document.getElementById("createForm");

  // =========================
  // SET DEFAULT จาก UI จริง (ไม่ใช้ localStorage)
  // =========================
  const activeBtn   = document.querySelector(".role-btn.active");
  const defaultRole = activeBtn ? activeBtn.dataset.role : "Admin";

  roleInput.value = defaultRole;

  roleButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.role === defaultRole);
  });

  // =========================
  // CLICK ROLE
  // =========================
  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      const role = btn.dataset.role;
      console.log("CLICK:", role);

      if (role === "Patient") {
        window.location.href = "create_patient.html?role=Patient";
        return;
      }

      roleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      roleInput.value = role;
    });
  });

  // =========================
  // SUBMIT
  // =========================
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name            = document.getElementById("name").value.trim();
      const email           = document.getElementById("email").value.trim();
      const password        = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();

      if (!name || !email || !password || !confirmPassword) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("รูปแบบอีเมลไม่ถูกต้อง");
        return;
      }

      if (password.length < 6) {
        alert("รหัสผ่านต้องอย่างน้อย 6 ตัว");
        return;
      }

      if (password !== confirmPassword) {
        alert("รหัสผ่านไม่ตรงกัน");
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];

      if (users.some(u => u.email === email)) {
        alert("อีเมลนี้ถูกใช้งานแล้ว");
        return;
      }

      const newUser = {
        id: Date.now(),
        name,
        fullname: name,
        username: name.toLowerCase().replace(/\s+/g, "_"),
        email,
        password,
        role:   roleInput.value || "Admin",
        status: "active",
        profileImage: "../../img/profile.jpg"
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      document.getElementById("successModal").classList.add("show");
      setTimeout(() => {
        window.location.href = "User_Dashboard.html";
      }, 1500);
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
// CLOSE MODAL  
// =========================
function closeModal() {
  document.getElementById("successModal").classList.remove("show");
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

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("hide");
} 	*/


// ============================================================
// create_account.js — ใช้ API แทน localStorage
// ============================================================
const API_BASE = '/api/admin';

document.addEventListener("DOMContentLoaded", function () {

  const roleInput   = document.getElementById("role");
  const roleButtons = document.querySelectorAll(".role-btn");
  const form        = document.getElementById("createForm");

  // =========================
  // SET DEFAULT ROLE
  // =========================
  const createRole  = sessionStorage.getItem("createRole") || "Doctor";
  roleInput.value   = createRole;

  roleButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.role === createRole);
  });

  // =========================
  // CLICK ROLE
  // =========================
  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const role = btn.dataset.role;

      if (role === "Patient") {
        window.location.href = "create_patient.html";
        return;
      }

      roleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      roleInput.value = role;
    });
  });

  // =========================
  // SUBMIT — เรียก POST /api/admin/users/doctor
  // =========================
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name            = document.getElementById("name").value.trim();
      const email           = document.getElementById("email").value.trim();
      const password        = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();
      const role            = roleInput.value || "Doctor";

      // --- Validate ---
      if (!name || !email || !password || !confirmPassword) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("รูปแบบอีเมลไม่ถูกต้อง");
        return;
      }

      if (password.length < 6) {
        alert("รหัสผ่านต้องอย่างน้อย 6 ตัว");
        return;
      }

      if (password !== confirmPassword) {
        alert("รหัสผ่านไม่ตรงกัน");
        return;
      }

      // --- Build payload ---
      const nameParts = name.split(" ");
      const payload = {
        username:  name.toLowerCase().replace(/\s+/g, "_"),
        password,
        email,
        name:    nameParts[0] || name,
        surname: nameParts.slice(1).join(" ") || "-",
      };

      // Doctor fields
      if (role === "Doctor") {
        payload.specialization = document.getElementById("specialization")?.value.trim() || "";
        const deptId = document.getElementById("departmentId")?.value;
        if (deptId) payload.departmentId = parseInt(deptId);
      }

      const endpoint = role === "Doctor"
        ? `${API_BASE}/users/doctor`
        : `${API_BASE}/users/doctor`; // Staff ยังไม่มี endpoint แยก ใช้ doctor ไปก่อน

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
          alert("เกิดข้อผิดพลาด: " + (data.message || res.statusText));
          return;
        }

        document.getElementById("successModal")?.classList.add("show");
        setTimeout(() => {
          window.location.href = "User_Dashboard.html";
        }, 1500);

      } catch (err) {
        alert("เชื่อมต่อ server ไม่ได้: " + err.message);
      }
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
// CLOSE MODAL
// =========================
function closeModal() {
  document.getElementById("successModal")?.classList.remove("show");
  window.location.href = "User_Dashboard.html";
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