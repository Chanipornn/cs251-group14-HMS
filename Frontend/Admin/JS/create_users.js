// ============================================================
// create_users.js
// ============================================================

// DEFAULT AVATAR — SVG inline แปลงเป็น data URL
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e0dff7'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%237b6ee6'/%3E%3Cellipse cx='50' cy='85' rx='28' ry='20' fill='%237b6ee6'/%3E%3C/svg%3E";

// เก็บ base64 รูปที่เลือก (ยังไม่ได้ save)
let selectedProfileImage = null;

// =========================
// ERROR HELPER
// =========================
function showFieldError(fieldId, message) {
  clearFieldError(fieldId);
  const field = document.getElementById(fieldId);
  if (!field) return;
  const errEl = document.createElement("p");
  errEl.className = "field-error";
  errEl.id = `err_${fieldId}`;
  errEl.textContent = message;
  field.parentNode.insertBefore(errEl, field.nextSibling);
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

document.addEventListener("DOMContentLoaded", function () {

  const form          = document.getElementById("createForm");
  const roleButtons   = document.querySelectorAll(".role-btn");
  const roleInput     = document.getElementById("role");
  const patientFields = document.getElementById("patientFields");
  const extraFields   = document.getElementById("extraFields");

  // =========================
  // PROFILE IMAGE UPLOAD
  // =========================
  const fileInput = document.getElementById("profileFileInput");
  const preview   = document.getElementById("profilePreview");

  if (preview) preview.src = DEFAULT_AVATAR;

  if (fileInput) {
    fileInput.addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("ขนาดไฟล์ต้องไม่เกิน 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        selectedProfileImage = e.target.result;
        if (preview) preview.src = selectedProfileImage;
      };
      reader.readAsDataURL(file);
    });
  }

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
      extraFields.style.display   = "block";
      patientFields.style.display = "block";
    } else {
      extraFields.style.display   = "none";
      patientFields.style.display = "none";
    }
  }

  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const role = btn.dataset.role;
      roleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      roleInput.value = role;
      updateFormByRole(role);
    });
  });

  // อ่าน role จาก URL (?role=Doctor)
  const urlRole = new URLSearchParams(window.location.search).get("role");
  if (urlRole) {
    const matched = [...roleButtons].find(
      b => b.dataset.role.toLowerCase() === urlRole.toLowerCase()
    );
    if (matched) {
      roleButtons.forEach(b => b.classList.remove("active"));
      matched.classList.add("active");
      roleInput.value = matched.dataset.role;
    }
  }

  updateFormByRole(roleInput.value || "Patient");

  // =========================
  // * สีแดง
  // =========================
  document.querySelectorAll(".form-group label").forEach(label => {
    label.innerHTML = label.innerHTML.replace(/ \*/g, ' <span class="req">*</span>');
  });

  // =========================
  // CLEAR ERROR ON INPUT
  // =========================
  const confirmPasswordField = document.getElementById("confirmPassword");
  const passwordField        = document.getElementById("password");

  if (confirmPasswordField) {
    confirmPasswordField.addEventListener("input", () => clearFieldError("confirmPassword"));
  }
  if (passwordField) {
    passwordField.addEventListener("input", () => {
      clearFieldError("password");
      clearFieldError("confirmPassword");
    });
  }

  // =========================
  // SUBMIT
  // =========================
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearAllErrors();

      const name            = document.getElementById("name")?.value.trim();
      const email           = document.getElementById("email")?.value.trim();
      const password        = document.getElementById("password")?.value.trim();
      const confirmPassword = document.getElementById("confirmPassword")?.value.trim();
      const firstName       = document.getElementById("firstName")?.value.trim();
      const lastName        = document.getElementById("lastName")?.value.trim();
      const phone           = document.getElementById("phone")?.value.trim();

      const currentRole = roleInput.value || "Patient";

      // =========================
      // VALIDATE พื้นฐาน
      // =========================
      let hasError = false;

      if (!name) { showFieldError("name", "กรุณากรอกชื่อผู้ใช้"); hasError = true; }
      if (!email) { showFieldError("email", "กรุณากรอกอีเมล"); hasError = true; }
      if (!password) { showFieldError("password", "กรุณากรอกรหัสผ่าน"); hasError = true; }
      if (!confirmPassword) { showFieldError("confirmPassword", "กรุณายืนยันรหัสผ่าน"); hasError = true; }
      if (!firstName) { showFieldError("firstName", "กรุณากรอกชื่อ"); hasError = true; }
      if (!lastName) { showFieldError("lastName", "กรุณากรอกนามสกุล"); hasError = true; }
      if (!phone) { showFieldError("phone", "กรุณากรอกเบอร์โทรศัพท์"); hasError = true; }

      if (hasError) return;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFieldError("email", "รูปแบบอีเมลไม่ถูกต้อง");
        return;
      }

      if (password.length < 6) {
        showFieldError("password", "รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร");
        return;
      }

      if (password !== confirmPassword) {
        showFieldError("confirmPassword", "รหัสผ่านไม่ตรงกัน");
        return;
      }

      // =========================
      // VALIDATE เฉพาะ Patient
      // =========================
      let idcard  = "";
      let gender  = "";
      let day     = "";
      let month   = "";
      let year    = "";
      let blood   = "";
      let right   = "";
      let address = "";
      let disease = "";
      let allergy = "";
      let weight  = "";
      let height  = "";

      if (currentRole === "Patient") {
        idcard  = document.getElementById("idcard")?.value.trim();
        gender  = document.querySelector('input[name="gender"]:checked')?.value;

        // ✅ อ่านวันเกิดจาก data-value ก่อน แล้วค่อย fallback ไป .value
        const dayEl   = document.getElementById("day");
        const monthEl = document.getElementById("month");
        const yearEl  = document.getElementById("year");
        day   = dayEl?.getAttribute("data-value")   || dayEl?.value   || "";
        month = monthEl?.getAttribute("data-value") || monthEl?.value || "";
        year  = yearEl?.getAttribute("data-value")  || yearEl?.value  || "";

        blood   = document.getElementById("blood")?.value;
        right   = document.getElementById("right")?.value;
        address = document.getElementById("address")?.value.trim();
        disease = document.getElementById("disease")?.value.trim();
        allergy = document.getElementById("allergy")?.value.trim();
        weight  = document.getElementById("weight")?.value.trim();
        height  = document.getElementById("height")?.value.trim();

        if (!idcard || !gender || !day || !month || !year) {
          alert("กรุณากรอกข้อมูลผู้ป่วยให้ครบ");
          return;
        }
      }

      const birth = `${day || ""}-${month || ""}-${year || ""}`;

      // =========================
      // LOAD USERS
      // =========================
      let users = JSON.parse(localStorage.getItem("users")) || [];

      if (users.some(u => u.email === email)) {
        showFieldError("email", "อีเมลนี้ถูกใช้งานแล้ว");
        return;
      }

      // =========================
      // CREATE USER
      // =========================
      const newUser = {
        id:           Date.now(),
        name,
        fullname:     `${firstName} ${lastName}`,
        firstName,
        lastName,
        username:     name.toLowerCase().replace(/\s+/g, "_"),
        email,
        password,
        role:         currentRole,
        status:       "active",
        profileImage: selectedProfileImage || DEFAULT_AVATAR,
        phone,
        idcard,
        gender,
        birth,
        blood,
        right,
        address,
        disease,
        allergy,
        weight,
        height,
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // =========================
      // SYNC ไป allUsers
      // =========================
      if (currentRole === "Doctor" || currentRole === "Staff") {
        let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

        const staffEntry = {
          name:      `${firstName} ${lastName}`,
          role:      currentRole,
          dept:      "",
          expertise: "",
          img:       selectedProfileImage || DEFAULT_AVATAR,
          type:      currentRole.toLowerCase(),
          phone:     phone,
          email:     email,
          userId:    newUser.id,
        };

        allUsers.push(staffEntry);
        allUsers = allUsers.map((u, i) => ({ ...u, index: i }));
        localStorage.setItem("allUsers", JSON.stringify(allUsers));
      }

      document.getElementById("successModal").classList.add("show");
      setTimeout(() => {
        if (currentRole === "Doctor" || currentRole === "Staff") {
          window.location.href = "dashboard.html";
        } else {
          window.location.href = "User_Dashboard.html";
        }
      }, 1500);
    });
  }

  // =========================
  // CLOSE MODAL
  // =========================
  window.closeModal = function () {
    document.getElementById("successModal").classList.remove("show");
    if (roleInput.value === "Doctor" || roleInput.value === "Staff") {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "User_Dashboard.html";
    }
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

// ✅ แก้: เซ็ตทั้ง .value และ data-value บน hidden input
function addOption(container, inputId, value) {
  const div     = document.createElement("div");
  div.innerText = value;
  div.onclick   = function () {
    const dropdown = container.previousElementSibling;
    dropdown.querySelector("span").innerText = value;

    const inputEl = document.getElementById(inputId);
    if (inputEl) {
      inputEl.value = String(value);
      inputEl.setAttribute("data-value", String(value));
    }

    container.classList.remove("show");
    dropdown.querySelector(".arrow").classList.remove("rotate");
  };
  container.appendChild(div);
}