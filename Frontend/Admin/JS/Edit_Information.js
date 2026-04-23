// ============================================================
// Edit_Information.js
// ============================================================


// DEFAULT AVATAR
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e0dff7'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%237b6ee6'/%3E%3Cellipse cx='50' cy='85' rx='28' ry='20' fill='%237b6ee6'/%3E%3C/svg%3E";

// รูปที่เลือกใหม่ (ยังไม่ save)
let selectedProfileImage = null;

// ============================================================
// ROLE CONFIG — กำหนดว่าแต่ละ role แก้ไขฟิลไหนได้บ้าง
// ============================================================
const EDITABLE_BY_ROLE = {
  patient: [
    "name", "emailInput", "firstName", "lastName",
    "blood", "disease", "allergy", "weight", "height", "phone", "address"
  ],
  doctor:  ["name", "emailInput", "firstName", "lastName", "role", "status"],
  staff:   ["name", "emailInput", "firstName", "lastName", "role", "status"],
  admin:   ["name", "emailInput", "firstName", "lastName", "role", "status"],
};

// normalize role string → key ใน EDITABLE_BY_ROLE
function normalizeRole(role) {
  if (!role) return "patient";
  const r = role.toLowerCase().trim();
  if (r === "patient"  || r === "ผู้ป่วย")                return "patient";
  if (r === "doctor"   || r === "แพทย์" || r === "หมอ")   return "doctor";
  if (r === "staff"    || r === "เจ้าหน้าที่")            return "staff";
  if (r === "admin"    || r === "ผู้ดูแลระบบ")            return "admin";
  return "patient"; // default
}

// ============================================================
// DOMContentLoaded
// ============================================================
document.addEventListener("DOMContentLoaded", function () {

  const users  = JSON.parse(localStorage.getItem("users")) || [];
  const editId = localStorage.getItem("editUserId");

  // ใช้ == เพราะ editId จาก localStorage เป็น string
  const user = users.find(u => u.id == editId);
  if (!user) {
    alert("ไม่พบข้อมูลผู้ใช้");
    window.location.href = "User_Dashboard.html";
    return;
  }

  // =========================
  // PROFILE IMAGE UPLOAD (Edit)
  // =========================
  const fileInput = document.getElementById("profileFileInput");
  const preview   = document.getElementById("profilePreview");

  // โหลดรูปเดิมของ user
  if (preview) {
    preview.src = user.profileImage || DEFAULT_AVATAR;
  }

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

  // -------------------------------------------------------
  // 1. LOAD — แสดงข้อมูลเดิมทุกฟิล
  // -------------------------------------------------------
  loadUserData(user);

  // inject <span class="req"> ครอบ * ใน label ทุกอัน → CSS จะทำให้เป็นสีแดง
  document.querySelectorAll(".form-group label").forEach(label => {
    label.innerHTML = label.innerHTML.replace(/ \*/g, ' <span class="req">*</span>');
  });

  // -------------------------------------------------------
  // 2. LOCK — ล็อกฟิลที่แก้ไขไม่ได้ตาม role
  // -------------------------------------------------------
  const roleKey  = normalizeRole(user.role);
  const editable = EDITABLE_BY_ROLE[roleKey] || [];
  lockFields(editable);
  showFieldsByRole(roleKey);

  // -------------------------------------------------------
  // 3. SAVE
  // -------------------------------------------------------
  const form = document.getElementById("editForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      saveUser(editId, roleKey);
    });
  }

});

// ============================================================
// LOAD USER DATA — เติมข้อมูลเดิมลงทุกฟิล
// key map ตรงกับที่ create_users.js บันทึกลง localStorage
// ============================================================
function loadUserData(user) {

  // Header
  setText("username", user.username || user.name || "-");
  setText("email",    user.email    || "-");
  setText("roleText", user.role     || "-");

  // ฟิลทั่วไป
  setVal("name",       user.name    || "");
  setVal("emailInput", user.email   || "");
  setVal("role",       user.role    || "");
  setVal("status",     user.status  || "");
  setVal("disease",    user.disease || "");
  setVal("allergy",    user.allergy || "");
  setVal("phone",      user.phone   || "");
  setVal("address",    user.address || "");
  setVal("weight",     user.weight  || "");
  setVal("height",     user.height  || "");

  // create_users.js บันทึก key ต่างกัน → map ให้ตรง
  setVal("nationalId", user.idcard || "");   // idcard → nationalId
  setVal("gender",     user.gender || "");
  setVal("birthdate",  user.birth  || "");   // birth  → birthdate
  setVal("treatment",  user.right  || "");   // right  → treatment

  // firstName / lastName
  // create เก็บรวมใน fullname เช่น "สมชาย ใจดี" → ต้อง split ออก
  // แต่ถ้าเคย save แยก key ไว้แล้ว (จาก edit ครั้งก่อน) ใช้ key นั้นเลย
  if (user.firstName || user.lastName) {
    setVal("firstName", user.firstName || "");
    setVal("lastName",  user.lastName  || "");
  } else if (user.fullname) {
    const parts = user.fullname.trim().split(/\s+/);
    setVal("firstName", parts[0] || "");
    setVal("lastName",  parts.slice(1).join(" ") || "");
  }

  // Dropdown — กรุ๊ปเลือด
  setDropdown("blood", user.blood || "เลือกกรุ๊ปเลือด");
}

// ============================================================
// LOCK FIELDS — disable ฟิลที่ไม่อยู่ใน editable list
// ============================================================
function lockFields(editableIds) {
  // รายการ id ของฟิลทั้งหมดในฟอร์ม
  const ALL_FIELDS = [
    "name", "emailInput", "role", "status",
    "disease", "allergy", "firstName", "lastName",
    "phone", "address", "weight", "height",
    "treatment", "blood",
    // ฟิลที่ lock ตายตัวเสมอ (ไม่ต้องสน editable list)
    "nationalId", "gender", "birthdate"
  ];

  ALL_FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    // nationalId, gender, birthdate → disabled เสมอ
    const alwaysLocked = ["nationalId", "gender", "birthdate"];
    if (alwaysLocked.includes(id)) {
      el.disabled = true;
      return;
    }

    if (editableIds.includes(id)) {
      el.disabled = false;
      el.classList.remove("field-locked");
    } else {
      el.disabled = true;
      el.classList.add("field-locked");
    }
  });

  // Dropdown กรุ๊ปเลือด — ถ้า blood ไม่อยู่ใน editable ให้ disable trigger
  const bloodDropdown = document.querySelector("#blood")
    ?.closest(".custom-dropdown")
    ?.querySelector(".dropdown-selected");

  if (bloodDropdown) {
    if (editableIds.includes("blood")) {
      bloodDropdown.style.pointerEvents = "";
      bloodDropdown.style.opacity = "";
    } else {
      bloodDropdown.style.pointerEvents = "none";
      bloodDropdown.style.opacity = "0.6";
    }
  }
}

// ============================================================
// SHOW / HIDE FIELDS BY ROLE
// ใช้ data-roles attribute บน .form-group เพื่อกำหนดว่า role ไหนเห็นฟิลนี้
// ============================================================
function showFieldsByRole(roleKey) {
  document.querySelectorAll(".form-grid .form-group[data-roles]").forEach(group => {
    const allowed = group.getAttribute("data-roles").split(",").map(r => r.trim());
    if (allowed.includes(roleKey)) {
      group.style.display = "";
    } else {
      group.style.display = "none";
    }
  });
}

// ============================================================
// SAVE USER
// ============================================================
function saveUser(editId, roleKey) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const index = users.findIndex(u => u.id == editId);
  if (index === -1) return;

  const editable = EDITABLE_BY_ROLE[roleKey] || [];

  // เริ่มจากข้อมูลเดิม แล้ว overwrite เฉพาะฟิลที่แก้ไขได้
  const updated = { ...users[index] };

  const FIELD_MAP = {
    // บันทึก key ตรงกับ create_users.js เสมอ
    name:       () => ({ name: getVal("name") }),
    emailInput: () => ({ email: getVal("emailInput") }),
    role:       () => ({ role: getVal("role") }),
    status:     () => ({ status: getVal("status") }),
    blood:      () => ({ blood: getVal("blood") }),
    disease:    () => ({ disease: getVal("disease") }),
    allergy:    () => ({ allergy: getVal("allergy") }),
    phone:      () => ({ phone: getVal("phone") }),
    address:    () => ({ address: getVal("address") }),
    weight:     () => ({ weight: getVal("weight") }),
    height:     () => ({ height: getVal("height") }),
    treatment:  () => ({ right: getVal("treatment") }),  // เก็บกลับเป็น right ตาม create

    // firstName / lastName → อัปเดตทั้ง key แยก และ fullname รวม
    firstName: () => {
      const fn = getVal("firstName");
      const ln = getVal("lastName");
      return { firstName: fn, lastName: ln, fullname: `${fn} ${ln}`.trim() };
    },
    lastName: () => {
      const fn = getVal("firstName");
      const ln = getVal("lastName");
      return { firstName: fn, lastName: ln, fullname: `${fn} ${ln}`.trim() };
    },
  };

  editable.forEach(id => {
    if (FIELD_MAP[id]) {
      Object.assign(updated, FIELD_MAP[id]());
    }
  });

  // บันทึกรูปโปรไฟล์ถ้ามีการเปลี่ยนใหม่
  if (selectedProfileImage) {
    updated.profileImage = selectedProfileImage;
  }

  users[index] = updated;
  localStorage.setItem("users", JSON.stringify(users));

  alert("บันทึกสำเร็จ!");
  window.location.href = "User_Dashboard.html";
}

// ============================================================
// HELPERS
// ============================================================
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

// ============================================================
// BACK
// ============================================================
function goBack() {
  window.location.href = "User_Dashboard.html";
}

// ============================================================
// SIDEBAR
// ============================================================
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("hide");
}

// ============================================================
// LOGOUT
// ============================================================
function logout() {
  localStorage.clear();
  window.location.href = "../../login.html";
}

// ============================================================
// DROPDOWN
// ============================================================
function toggleDropdown(el) {
  document.querySelectorAll(".dropdown-options").forEach(d => {
    if (d !== el.nextElementSibling) d.classList.remove("show");
  });
  document.querySelectorAll(".arrow").forEach(a => {
    if (a !== el.querySelector(".arrow")) a.classList.remove("rotate");
  });

  const options = el.nextElementSibling;
  const arrow   = el.querySelector(".arrow");
  options.classList.toggle("show");
  arrow.classList.toggle("rotate");
}

function selectOption(option, selectId) {
  const dropdown = option.closest(".custom-dropdown");
  dropdown.querySelector(".dropdown-selected span").innerText = option.innerText;
  const input = document.getElementById(selectId);
  if (input) input.value = option.innerText;
  dropdown.querySelector(".dropdown-options").classList.remove("show");
  dropdown.querySelector(".arrow").classList.remove("rotate");
}

// ============================================================
// CLICK OUTSIDE
// ============================================================
document.addEventListener("click", function (e) {
  if (!e.target.closest(".custom-dropdown")) {
    document.querySelectorAll(".dropdown-options").forEach(d => d.classList.remove("show"));
    document.querySelectorAll(".arrow").forEach(a => a.classList.remove("rotate"));
  }
});

// ============================================================
// SET DROPDOWN
// ============================================================
function setDropdown(id, value) {
  const input = document.getElementById(id);
  if (!input) return;
  input.value = value;
  const container = input.closest(".custom-dropdown");
  if (container) {
    const span = container.querySelector("span");
    if (span) span.innerText = value;
  }
}