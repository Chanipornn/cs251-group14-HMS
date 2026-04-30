/*// ============================================================
// create_users.js
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
// create_users.js — ใช้ API แทน localStorage
// ============================================================
// ============================================================
// create_users.js — ใช้ API แทน localStorage
// ============================================================
/*const API_BASE = '/api/admin';

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

      const username        = document.getElementById("name").value.trim();
      const firstName       = document.getElementById("firstName")?.value.trim();
      const surname         = document.getElementById("surname")?.value.trim();
      const telephone       = document.getElementById("telephone")?.value.trim();
      const email           = document.getElementById("email").value.trim();
      const password        = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();
      const role            = roleInput.value || "Doctor";

      // --- Validate ---
      if (!username || !email || !password || !confirmPassword) {
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
      const payload = {
        username,
        password,
        email,
        telephone: telephone || null,
        name:      firstName || "-",
        surname:   surname   || "-",
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
}*/
// ============================================================
// create_users.js (BACKEND VERSION)
// ============================================================

const API_BASE = "/api/admin";

const DEFAULT_AVATAR =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e0dff7'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%237b6ee6'/%3E%3Cellipse cx='50' cy='85' rx='28' ry='20' fill='%237b6ee6'/%3E%3C/svg%3E";

let selectedProfileImage = null;

// ================= ERROR =================
function showFieldError(fieldId, message) {
  clearFieldError(fieldId);
  const field = document.getElementById(fieldId);
  if (!field) return;

  const err = document.createElement("p");
  err.className = "field-error";
  err.id = `err_${fieldId}`;
  err.textContent = message;

  field.parentNode.insertBefore(err, field.nextSibling);
  field.classList.add("input-error");
}

function clearFieldError(fieldId) {
  const old = document.getElementById(`err_${fieldId}`);
  if (old) old.remove();
  const field = document.getElementById(fieldId);
  if (field) field.classList.remove("input-error");
}

function clearAllErrors() {
  document.querySelectorAll(".field-error").forEach(e => e.remove());
  document.querySelectorAll(".input-error").forEach(e => e.classList.remove("input-error"));
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("createForm");
  const roleButtons = document.querySelectorAll(".role-btn");
  const roleInput = document.getElementById("role");

  const patientFields = document.getElementById("patientFields");
  const extraFields = document.getElementById("extraFields");

  // ================= IMAGE =================
  const fileInput = document.getElementById("profileFileInput");
  const preview = document.getElementById("profilePreview");

  if (preview) preview.src = DEFAULT_AVATAR;

  if (fileInput) {
    fileInput.addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("กรุณาเลือกไฟล์รูปภาพ");
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        selectedProfileImage = e.target.result;
        preview.src = selectedProfileImage;
      };
      reader.readAsDataURL(file);
    });
  }

  // ================= ROLE SWITCH =================
  function updateFormByRole(role) {
    if (role === "Patient") {
      extraFields.style.display = "block";
      patientFields.style.display = "block";
    } else {
      extraFields.style.display = "none";
      patientFields.style.display = "none";
    }
  }

  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const role = btn.dataset.role;

      // 👉 ถ้าเลือก patient → ไปอีกหน้า (เหมือน frontend)
      if (role === "Patient") {
        window.location.href = "create_patient.html";
        return;
      }

      roleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      roleInput.value = role;
      updateFormByRole(role);
    });
  });

  const savedRole = sessionStorage.getItem("createRole") || "Doctor";

  roleInput.value = savedRole;

  roleButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.role === savedRole);
  });

  updateFormByRole(savedRole);

  // ================= SUBMIT =================
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearAllErrors();

      const name = document.getElementById("name")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const password = document.getElementById("password")?.value.trim();
      const confirmPassword = document.getElementById("confirmPassword")?.value.trim();
      const firstName = document.getElementById("firstName")?.value.trim();
      const lastName = document.getElementById("lastName")?.value.trim();
      const phone = document.getElementById("phone")?.value.trim();

      const currentRole = roleInput.value || "Doctor";

      let hasError = false;

      if (!name) { showFieldError("name", "กรุณากรอกชื่อผู้ใช้"); hasError = true; }
      if (!email) { showFieldError("email", "กรุณากรอกอีเมล"); hasError = true; }
      if (!password) { showFieldError("password", "กรุณากรอกรหัสผ่าน"); hasError = true; }
      if (!confirmPassword) { showFieldError("confirmPassword", "กรุณายืนยันรหัสผ่าน"); hasError = true; }
      if (!firstName) { showFieldError("firstName", "กรุณากรอกชื่อ"); hasError = true; }
      if (!lastName) { showFieldError("lastName", "กรุณากรอกนามสกุล"); hasError = true; }
      if (!phone) { showFieldError("phone", "กรุณากรอกเบอร์โทร"); hasError = true; }

      if (hasError) return;

      if (password.length < 6) {
        showFieldError("password", "รหัสผ่านอย่างน้อย 6 ตัว");
        return;
      }

      if (password !== confirmPassword) {
        showFieldError("confirmPassword", "รหัสผ่านไม่ตรงกัน");
        return;
      }

      // ================= PAYLOAD =================
      const payload = {
        username: name,
        password: password,
        role: currentRole,
        email: email,
        telephone: phone,
        status: "Active",

        name: firstName,
        surname: lastName
      };

      // ================= ENDPOINT =================
      let endpoint = `${API_BASE}/users`;

      if (currentRole === "Doctor") {
        endpoint = `${API_BASE}/users/doctor`;
      } else if (currentRole === "Patient") {
        endpoint = `${API_BASE}/users/patient`;
      }

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(err);
        }

        document.getElementById("successModal").classList.add("show");

        setTimeout(() => {
          window.location.href = "User_Dashboard.html";
        }, 1500);

      } catch (error) {
        alert("Error: " + error.message);
      }
    });
  }

  // ================= MODAL =================
  window.closeModal = function () {
    document.getElementById("successModal").classList.remove("show");
    window.location.href = "User_Dashboard.html";
  };

});

// ================= UI =================
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("hide");
}

function logout() {
  window.location.href = "../../login.html";
}

function goBack() {
  window.location.href = "/Admin/html/User_Dashboard.html";
}