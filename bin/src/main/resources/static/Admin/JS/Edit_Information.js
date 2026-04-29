/*// ============================================================
// Edit_Information.js
// ============================================================
document.addEventListener("DOMContentLoaded", function () {

  const users  = JSON.parse(localStorage.getItem("users")) || [];
  const editId = localStorage.getItem("editUserId");

  //  ใช้ == แทน === เพราะ editId จาก localStorage เป็น string แต่ u.id เป็น number
  const user = users.find(u => u.id == editId);
  if (!user) return;

  // =========================
  // LOAD USER
  // =========================
  document.getElementById("username").innerText = user.username || "-";
  document.getElementById("email").innerText    = user.email    || "-";

  document.getElementById("name")       && (document.getElementById("name").value       = user.name   || "");
  document.getElementById("emailInput") && (document.getElementById("emailInput").value = user.email  || "");
  document.getElementById("role")       && (document.getElementById("role").value       = user.role   || "");
  document.getElementById("status")     && (document.getElementById("status").value     = user.status || "");

  //  setDropdown หา span จาก closest(".custom-dropdown") แทน previousElementSibling
  setDropdown("blood", user.blood || "เลือกกรุ๊ปเลือด");

  // =========================
  // SAVE
  // =========================
  const form = document.getElementById("editForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let users = JSON.parse(localStorage.getItem("users")) || [];

      //  ใช้ == แทน ===
      const index = users.findIndex(u => u.id == editId);
      if (index === -1) return;

      users[index] = {
        ...users[index],
        name:     document.getElementById("name").value,
        fullname: document.getElementById("name").value,
        email:    document.getElementById("emailInput").value,
        role:     document.getElementById("role").value,
        status:   document.getElementById("status").value,
        blood:    document.getElementById("blood").value
      };

      localStorage.setItem("users", JSON.stringify(users));

      alert("บันทึกสำเร็จ!");
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

// =========================
// DROPDOWN
// =========================
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

// =========================
// CLICK OUTSIDE
// =========================
document.addEventListener("click", function (e) {
  if (!e.target.closest(".custom-dropdown")) {
    document.querySelectorAll(".dropdown-options").forEach(d => {
      d.classList.remove("show");
    });
    document.querySelectorAll(".arrow").forEach(a => {
      a.classList.remove("rotate");
    });
  }
});

// =========================
// SET DROPDOWN  
// =========================
function setDropdown(id, value) {
  const input = document.getElementById(id);
  if (!input) return;

  input.value = value;

  const container = input.closest(".custom-dropdown");
  if (container) {
    const span = container.querySelector("span");
    if (span) span.innerText = value;
  }
} */


// ============================================================
// Edit_Information.js — ใช้ API แทน localStorage
// ============================================================
const API_BASE = '/api/admin';

document.addEventListener("DOMContentLoaded", async function () {

  // ดึง user จาก sessionStorage (ส่งมาจาก User_Dashboard)
  const user = JSON.parse(sessionStorage.getItem("editUser"));
  if (!user) {
    alert("ไม่พบข้อมูลผู้ใช้");
    window.location.href = "User_Dashboard.html";
    return;
  }

  // =========================
  // LOAD USER INTO FORM
  // =========================
  const usernameEl = document.getElementById("username");
  const emailEl    = document.getElementById("email");
  if (usernameEl) usernameEl.innerText = user.username || "-";
  if (emailEl)    emailEl.innerText    = user.email    || "-";

  document.getElementById("name")       && (document.getElementById("name").value       = user.username || "");
  document.getElementById("emailInput") && (document.getElementById("emailInput").value = user.email    || "");
  document.getElementById("role")       && (document.getElementById("role").value       = user.role     || "");
  document.getElementById("status")     && (document.getElementById("status").value     = user.status   || "");

  // =========================
  // SAVE — เรียก PUT /api/admin/users/{id}
  // =========================
  const form = document.getElementById("editForm");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const payload = {};

      const nameVal     = document.getElementById("name")?.value.trim();
      const emailVal    = document.getElementById("emailInput")?.value.trim();
      const statusVal   = document.getElementById("status")?.value;
      const passwordVal = document.getElementById("passwordInput")?.value.trim();

      if (nameVal)     payload.username  = nameVal;
      if (emailVal)    payload.email     = emailVal;
      if (statusVal)   payload.status    = statusVal;
      if (passwordVal) payload.password  = passwordVal;

      try {
        const res = await fetch(`${API_BASE}/users/${user.userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
          alert("บันทึกไม่สำเร็จ: " + (data.message || res.statusText));
          return;
        }

        // อัปเดต sessionStorage ด้วยข้อมูลใหม่
        sessionStorage.setItem("editUser", JSON.stringify(data));

        alert("บันทึกสำเร็จ!");
        window.location.href = "User_Dashboard.html";

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
// SIDEBAR / LOGOUT
// =========================
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("hide");
}

function logout() {
  window.location.href = "../../login.html";
}

// =========================
// DROPDOWN
// =========================
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
  if (arrow) arrow.classList.toggle("rotate");
}

function selectOption(option, selectId) {
  const dropdown = option.closest(".custom-dropdown");
  dropdown.querySelector(".dropdown-selected span").innerText = option.innerText;
  const input = document.getElementById(selectId);
  if (input) input.value = option.innerText;
  dropdown.querySelector(".dropdown-options").classList.remove("show");
  dropdown.querySelector(".arrow")?.classList.remove("rotate");
}

document.addEventListener("click", function (e) {
  if (!e.target.closest(".custom-dropdown")) {
    document.querySelectorAll(".dropdown-options").forEach(d => d.classList.remove("show"));
    document.querySelectorAll(".arrow").forEach(a => a.classList.remove("rotate"));
  }
});

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