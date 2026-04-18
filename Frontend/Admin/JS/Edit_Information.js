// =========================
// INIT (สำคัญมาก)
// =========================
document.addEventListener("DOMContentLoaded", function () {

  const user = JSON.parse(localStorage.getItem("currentUser"));

  // =========================
  // LOAD USER
  // =========================
  if (user) {
    document.getElementById("username").innerText = user.username;
    document.getElementById("email").innerText = user.email;

    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("emailInput");
    const roleEl = document.getElementById("role");
    const statusEl = document.getElementById("status");

    if (nameEl) nameEl.value = user.name;
    if (emailEl) emailEl.value = user.email;
    if (roleEl) roleEl.value = user.role;
    if (statusEl) statusEl.value = user.status;

    // 🔥 set dropdown หลัง DOM พร้อม
    setDropdown("blood", user.blood || "เลือกกรุ๊ปเลือด");
  }

  // =========================
  // SAVE
  // =========================
  const form = document.getElementById("editForm");

  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      let users = JSON.parse(localStorage.getItem("users")) || [];

      const updatedUser = {
        name: document.getElementById("name").value,
        username: user.username,
        email: document.getElementById("emailInput").value,
        role: document.getElementById("role").value,
        status: document.getElementById("status").value,

        // 🔥 เพิ่มตรงนี้ (ของคุณไม่มี)
        blood: document.getElementById("blood").value
      };

      users = users.map(u => 
        u.username === user.username ? updatedUser : u
      );

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
  const arrow = el.querySelector(".arrow");

  options.classList.toggle("show");
  arrow.classList.toggle("rotate");
}

function selectOption(option, selectId) {
  const dropdown = option.closest(".custom-dropdown");

  dropdown.querySelector(".dropdown-selected span").innerText =
    option.innerText;

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
// SET DROPDOWN VALUE
// =========================
function setDropdown(id, value) {
  const input = document.getElementById(id);
  if (!input) return;

  input.value = value;

  const dropdown = input.previousElementSibling;
  if (dropdown) {
    const span = dropdown.querySelector("span");
    if (span) span.innerText = value;
  }
}