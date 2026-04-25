// ============================================================
// create_patient.js
// ============================================================
document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("createForm");
  const roleButtons = document.querySelectorAll(".role-btn");
  const roleInput = document.getElementById("role");
  const patientFields = document.getElementById("patientFields");

  // =========================
  // BACK
  // =========================
  window.goBack = function () {
    window.location.href = "User_Dashboard.html";
  };

  // =========================
  // ROLE SWITCH
  // =========================
  function updateFormByRole(role) {
    if (role === "Patient") {
      patientFields.style.display = "block";
    } else {
      patientFields.style.display = "none";
    }
  }

  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      const role = btn.dataset.role;

      // ถ้าไม่ใช่ Patient → ไป Create_Account.html (ตรง case)
      if (role !== "Patient") {
        window.location.href = "create_account.html";
        return;
      }

      roleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      roleInput.value = role;
      updateFormByRole(role);
    });
  });

  updateFormByRole(roleInput.value || "Patient");

  // =========================
  // SUBMIT
  // =========================
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name            = document.getElementById("name")?.value.trim();
      const email           = document.getElementById("email")?.value.trim();
      const password        = document.getElementById("password")?.value.trim();
      const confirmPassword = document.getElementById("confirmPassword")?.value.trim();

      const phone  = document.getElementById("phone")?.value.trim();
      const idcard = document.getElementById("idcard")?.value.trim();
      const blood  = document.getElementById("blood")?.value;
      const right  = document.getElementById("right")?.value;
      const gender = document.querySelector('input[name="gender"]:checked')?.value;

      const day   = document.getElementById("day")?.value;
      const month = document.getElementById("month")?.value;
      const year  = document.getElementById("year")?.value;
      const birth = `${day || ""}-${month || ""}-${year || ""}`;

      // =========================
      // VALIDATE
      // =========================
      if (!name || !email || !password || !confirmPassword) {
        alert("กรุณากรอกข้อมูลพื้นฐานให้ครบ");
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

      if (roleInput.value === "Patient") {
        if (!phone || !idcard || !gender || !day || !month || !year) {
          alert("กรุณากรอกข้อมูลผู้ป่วยให้ครบ");
          return;
        }
      }

      // =========================
      // LOAD USERS
      // =========================
      let users = JSON.parse(localStorage.getItem("users")) || [];

      if (users.some(u => u.email === email)) {
        alert("อีเมลนี้ถูกใช้งานแล้ว");
        return;
      }

      // =========================
      // CREATE USER
      // =========================
      const newUser = {
        id: Date.now(),
        name,
        fullname: name,
        username: name.toLowerCase().replace(/\s+/g, "_"),
        email,
        password,
        role: roleInput.value || "Patient",
        status: "active",
        profileImage: "../../img/profile.jpg",
        phone,
        idcard,
        gender,
        birth,
        blood,
        right
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      document.getElementById("successModal").classList.add("show");
      setTimeout(() => {
        window.location.href = "User_Dashboard.html";
      }, 1500);
    });
  }

  // =========================
  // CLOSE MODAL  
  // =========================
  window.closeModal = function () {
    document.getElementById("successModal").classList.remove("show");
    window.location.href = "User_Dashboard.html";
  };

  // =========================
  // DOB GENERATOR
  // =========================
  generateDOB();
});

// =========================
// DROPDOWN
// =========================
function toggleDropdown(el) {
  const options = el.nextElementSibling;
  const arrow   = el.querySelector(".arrow");

  options.classList.toggle("show");
  arrow.classList.toggle("rotate");
}

function selectOption(option, selectId) {
  const dropdown = option.closest(".custom-dropdown");

  dropdown.querySelector("span").innerText        = option.innerText;
  document.getElementById(selectId).value         = option.innerText;

  dropdown.querySelector(".dropdown-options").classList.remove("show");
  dropdown.querySelector(".arrow").classList.remove("rotate");
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
// DOB GENERATOR
// =========================
function generateDOB() {
  const dayOptions   = document.getElementById("dayOptions");
  const monthOptions = document.getElementById("monthOptions");
  const yearOptions  = document.getElementById("yearOptions");

  if (!dayOptions || !monthOptions || !yearOptions) return;

  for (let i = 1; i <= 31; i++) addOption(dayOptions,   "day",   i);
  for (let i = 1; i <= 12; i++) addOption(monthOptions, "month", i);

  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 100; i--) {
    addOption(yearOptions, "year", i);
  }
}

function addOption(container, inputId, value) {
  const div     = document.createElement("div");
  div.innerText = value;

  div.onclick = function () {
    const dropdown = container.previousElementSibling;
    dropdown.querySelector("span").innerText = value;

    document.getElementById(inputId).value = value;

    container.classList.remove("show");
    dropdown.querySelector(".arrow").classList.remove("rotate");
  };

  container.appendChild(div);
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("hide");
}