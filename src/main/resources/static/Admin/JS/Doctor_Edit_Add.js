/*// ================= DATA =================
const departmentList = [
    "อายุรกรรม",
    "ศัลยกรรม",
    "หู คอ จมูก",
    "จิตเวช",
    "รังสีวิทยา",
    "กุมารเวชกรรม",
    "จักษุ",
    "กระดูกและข้อ",
    "สูตินรีเวช",
    "ฉุกเฉินและอุบัติเหตุ",
    "ผู้ป่วยหนัก",
    "วิสัญญี",
    "เวชศาสตร์ฟื้นฟู"
];  


// ================= HELPER =================
function populateDepartment(selectEl, currentDept) {
    let options = '<option value="">-- กรุณาเลือกแผนก --</option>';

    departmentList.forEach(dept => {
        const selected = dept === currentDept ? "selected" : "";
        options += `<option value="${dept}" ${selected}>${dept}</option>`;
    });

    selectEl.innerHTML = options;
}

// ================= INIT PAGE =================
document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('editUser'));
    if (!userData) return;

    // --- NAME ---
    const nameEl = document.querySelector('.display-name');
    if (nameEl) nameEl.innerText = userData.name;

    // --- PHONE ---
    const phoneEl = document.querySelector('.contact-info .value');
    if (phoneEl && userData.phone) phoneEl.innerText = userData.phone;

    // --- IMAGE ---
    const imgEl = document.querySelector('.profile-main-img');
    if (imgEl && userData.img) imgEl.src = userData.img;

    // --- DEPARTMENT DROPDOWN ---
    const deptSelect = document.getElementById('deptSelect');
    if (deptSelect) {
        populateDepartment(deptSelect, userData.dept);
    }

    const expertiseInput = document.querySelector('input[placeholder="กรอกความเชี่ยวชาญ"]');
        if (expertiseInput && userData.expertise) {
            expertiseInput.value = userData.expertise; // นำค่าเดิมมาใส่ในช่อง Input
        }
});


// ================= SAVE =================
function saveData() {
    const userData = JSON.parse(localStorage.getItem('editUser'));
    if (!userData) return;

    // ดึงค่าจาก Select
    const updatedDept = document.getElementById('deptSelect').value;

    // เจาะจงไปที่ช่องความเชี่ยวชาญ (ป้องกันการไปดึงค่าจากช่อง Search)
    const expertiseInput = document.querySelector('input[placeholder="กรอกความเชี่ยวชาญ"]');
    const updatedExpertise = document.getElementById('expertiseInput').value;

    const newData = {
        ...userData,
        dept: updatedDept,
        expertise: updatedExpertise
    };

    // ===== UPDATE LIST หลัก =====
    let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];

    // ตรวจสอบ Index และอัปเดตข้อมูล
    if (userData.index !== undefined && allUsers[userData.index]) {
        allUsers[userData.index] = newData;
        
        // บันทึกกลับลง localStorage
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        
        alert("บันทึกข้อมูลของ " + newData.name + " สำเร็จ!");
        window.location.href = "dashboard.html";
    } else {
        alert("เกิดข้อผิดพลาด: ไม่พบข้อมูลพนักงานในระบบ");
    }
}

// ================= CANCEL =================
function cancelEdit() {
    window.location.href = "dashboard.html";
} */

// ============================================================
// Doctor_Edit_Add.js — ใช้ API แทน localStorage
// ============================================================
/*const API_BASE = '/api/admin';

const departmentList = [
  "อายุรกรรม", "ศัลยกรรม", "หู คอ จมูก", "จิตเวช",
  "รังสีวิทยา", "กุมารเวชกรรม", "จักษุ", "กระดูกและข้อ",
  "สูตินรีเวช", "ฉุกเฉินและอุบัติเหตุ", "ผู้ป่วยหนัก",
  "วิสัญญี", "เวชศาสตร์ฟื้นฟู"
];

// ================= HELPER =================
function populateDepartment(selectEl, currentDept) {
  let options = '<option value="">-- กรุณาเลือกแผนก --</option>';
  departmentList.forEach(dept => {
    const selected = dept === currentDept ? "selected" : "";
    options += `<option value="${dept}" ${selected}>${dept}</option>`;
  });
  selectEl.innerHTML = options;
}

// ================= INIT PAGE =================
document.addEventListener('DOMContentLoaded', () => {
  const userData = JSON.parse(sessionStorage.getItem('editUser'));
  if (!userData) {
    alert("ไม่พบข้อมูล");
    window.location.href = "Dashboard.html";
    return;
  }

  // --- NAME ---
  const nameEl = document.querySelector('.display-name');
  if (nameEl) nameEl.innerText = userData.username;

  // --- IMAGE ---
  const imgEl = document.querySelector('.profile-main-img');
  if (imgEl) imgEl.src = "../../img/profile.jpg";

  // --- DEPARTMENT DROPDOWN ---
  const deptSelect = document.getElementById('deptSelect');
  if (deptSelect) {
    populateDepartment(deptSelect, userData.dept || "");
  }

  const expertiseInput = document.getElementById('expertiseInput');
  if (expertiseInput && userData.specialization) {
    expertiseInput.value = userData.specialization;
  }
});

// ================= SAVE — เรียก PUT /api/admin/users/{id} =================
async function saveData() {
  const userData = JSON.parse(sessionStorage.getItem('editUser'));
  if (!userData) return;

  const updatedDept      = document.getElementById('deptSelect')?.value;
  const updatedExpertise = document.getElementById('expertiseInput')?.value || "";

  const payload = {
    specialization: updatedExpertise,
  };

  // ถ้า departmentId มีใน userData ให้ส่งด้วย (ต้องรู้ id จริง)
  // ถ้าโปรเจคมี endpoint แก้ doctor โดยตรงให้ใช้แทน
  try {
    const res = await fetch(`${API_BASE}/users/${userData.userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      alert("บันทึกไม่สำเร็จ: " + (data.message || res.statusText));
      return;
    }

    alert("บันทึกข้อมูลสำเร็จ!");
    window.location.href = "Dashboard.html";

  } catch (err) {
    alert("เชื่อมต่อ server ไม่ได้: " + err.message);
  }
}

// ================= CANCEL =================
function cancelEdit() {
  window.location.href = "Dashboard.html";
}

// ================= SIDEBAR / LOGOUT =================
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("hide");
}

function logout() {
  window.location.href = "../../login.html";
}*/
// ================= DATA =================
const departmentList = [
  "อายุรกรรม",
  "ศัลยกรรม",
  "หู คอ จมูก",
  "จิตเวช",
  "รังสีวิทยา",
  "กุมารเวชกรรม",
  "จักษุ",
  "กระดูกและข้อ",
  "สูตินรีเวช",
  "ฉุกเฉินและอุบัติเหตุ",
  "ผู้ป่วยหนัก",
  "วิสัญญี",
  "เวชศาสตร์ฟื้นฟู"
];

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {

  const userData = JSON.parse(localStorage.getItem("editUser"));
  if (!userData) {
    showModal("ไม่พบข้อมูลผู้ใช้", false, () => {
      window.location.href = "dashboard.html";
    });
    return;
  }

  // name
  const nameEl = document.querySelector(".display-name");
  if (nameEl) nameEl.innerText = userData.name || "";

  // phone
  const phoneEl = document.querySelector(".contact-info .value");
  if (phoneEl) phoneEl.innerText = userData.phone || "-";

  // image
  const img = document.querySelector(".profile-main-img");
  if (img) {
    img.src = userData.img || "../../img/doctor_img1.png";
    img.onerror = () => img.src = "../../img/doctor_img1.png";
  }

  // email
  const email = document.querySelector(".user-meta .value");
  if (email) email.innerText = userData.email || "-";

  // role
  const role = document.querySelector(".role-badge");
  if (role) {
    role.innerText = userData.role || "Doctor";
    role.className = `role-badge ${(userData.type || "doctor")}`;
  }

  // สร้าง custom dropdown สำหรับแผนก
  buildDeptDropdown(userData.dept || "");

  // expertise
  const exp = document.getElementById("expertiseInput");
  if (exp) exp.value = userData.expertise || "";

  // ปิด dropdown เมื่อคลิกข้างนอก
  document.addEventListener("click", e => {
    if (!e.target.closest(".custom-select-wrapper")) {
      closeDeptDropdown();
    }
  });
});

// ================= CUSTOM DROPDOWN =================
function buildDeptDropdown(currentValue) {
  const menu    = document.getElementById("deptMenu");
  const display = document.getElementById("deptDisplay");
  const hidden  = document.getElementById("deptSelect");

  if (!menu) return;

  menu.innerHTML = departmentList.map(d => `
        <div class="select-option ${d === currentValue ? 'selected' : ''}"
             onclick="selectDept('${d}')">
            <span class="option-check">${d === currentValue ? '✓' : ''}</span>
            <span>${d}</span>
        </div>
    `).join("");

  if (currentValue && display) {
    display.textContent = currentValue;
    display.classList.remove("placeholder");
  }
  if (hidden) hidden.value = currentValue;
}

function toggleDeptDropdown() {
  const menu  = document.getElementById("deptMenu");
  const arrow = document.querySelector(".select-arrow");
  if (!menu) return;
  const isOpen = menu.classList.contains("show");
  if (isOpen) {
    menu.classList.remove("show");
    if (arrow) arrow.classList.remove("rotate");
  } else {
    menu.classList.add("show");
    if (arrow) arrow.classList.add("rotate");
  }
}

function closeDeptDropdown() {
  const menu  = document.getElementById("deptMenu");
  const arrow = document.querySelector(".select-arrow");
  if (menu)  menu.classList.remove("show");
  if (arrow) arrow.classList.remove("rotate");
}

function selectDept(value) {
  const display = document.getElementById("deptDisplay");
  const hidden  = document.getElementById("deptSelect");
  const menu    = document.getElementById("deptMenu");

  if (display) {
    display.textContent = value;
    display.classList.remove("placeholder");
  }
  if (hidden) hidden.value = value;

  // อัปเดต checkmark
  menu.querySelectorAll(".select-option").forEach(opt => {
    const text  = opt.querySelector("span:last-child").textContent;
    const check = opt.querySelector(".option-check");
    if (text === value) {
      opt.classList.add("selected");
      check.textContent = "✓";
    } else {
      opt.classList.remove("selected");
      check.textContent = "";
    }
  });

  closeDeptDropdown();
}

// ================= SAVE =================
function saveData() {
  const userData = JSON.parse(localStorage.getItem("editUser"));
  if (!userData) return;

  const dept = document.getElementById("deptSelect")?.value;
  const exp  = document.getElementById("expertiseInput")?.value;

  if (!dept) {
    showModal("กรุณาเลือกแผนก", false);
    return;
  }

  const newData = { ...userData, dept, expertise: exp };

  let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

  if (userData.index !== undefined && allUsers[userData.index]) {
    allUsers[userData.index] = newData;
    localStorage.setItem("allUsers", JSON.stringify(allUsers));
  }

  localStorage.setItem("editUser", JSON.stringify(newData));

  showModal("บันทึกสำเร็จ!", true, () => {
    window.location.href = "dashboard.html";
  });
}

// ================= MODAL =================
function showModal(message, success = true, onClose = null) {
  const overlay = document.getElementById("successModal");
  const icon    = document.getElementById("modalIcon");
  const msg     = document.getElementById("modalMessage");

  if (!overlay) return;

  if (icon) {
    icon.textContent = success ? "✓" : "!";
    icon.className   = success ? "modal-icon success" : "modal-icon warning";
  }
  if (msg) msg.textContent = message;

  overlay._onClose = onClose;
  overlay.classList.add("show");
}

function closeModal() {
  const overlay = document.getElementById("successModal");
  if (!overlay) return;
  overlay.classList.remove("show");
  if (typeof overlay._onClose === "function") {
    overlay._onClose();
    overlay._onClose = null;
  }
}

// ================= CANCEL =================
function cancelEdit() {
  window.location.href = "dashboard.html";
}

// ================= BASIC =================
function toggleSidebar() {
  document.querySelector(".sidebar")?.classList.toggle("hide");
}

function logout() {
  localStorage.clear();
  window.location.href = "../../login.html";
}

function goProfile() {
  window.location.href = "profile.html";
}