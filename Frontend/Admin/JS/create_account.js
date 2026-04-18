// =========================
// INIT (รอ DOM โหลดก่อน)
// =========================
document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // GO BACK
    // =========================
    window.goBack = function () {
      window.location.href = "User_Dashboard.html";
    };
  
    // =========================
    // FORM SUBMIT
    // =========================
    const form = document.getElementById("createForm");
  
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
  
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const role = document.getElementById("role").value;
  
        // validate
        if (password !== confirmPassword) {
          alert("รหัสผ่านไม่ตรงกัน");
          return;
        }
  
        if (!role) {
          alert("กรุณาเลือก Role");
          return;
        }
  
        let users = JSON.parse(localStorage.getItem("users")) || [];
  
        const newUser = {
          name,
          username: name,
          email,
          status: "active",
          role
        };
  
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
  
        alert("สร้างผู้ใช้สำเร็จ 🎉");
  
        window.location.href = "User_Dashboard.html";
      });
    }
  
    // =========================
    // ROLE SELECT (แก้ให้ไม่พัง)
    // =========================
    const roleButtons = document.querySelectorAll(".role-btn");
    const roleInput = document.getElementById("role");
  
    roleButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        roleButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
  
        if (roleInput) {
          roleInput.value = btn.dataset.role;
        }
      });
    });
  
  });
  
  
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
    if (input) {
      input.value = option.innerText;
    }
  
    dropdown.querySelector(".dropdown-options").classList.remove("show");
    dropdown.querySelector(".arrow").classList.remove("rotate");
  }
  
  
  // =========================
  // CLICK OUTSIDE CLOSE
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

  window.onload = function () {
    generateDOB();
  };
  
  function generateDOB() {
    const dayOptions = document.getElementById("dayOptions");
    const monthOptions = document.getElementById("monthOptions");
    const yearOptions = document.getElementById("yearOptions");
  
    // กันซ้ำ
    dayOptions.innerHTML = "";
    monthOptions.innerHTML = "";
    yearOptions.innerHTML = "";
  
    // DAY
    for (let i = 1; i <= 31; i++) {
      addOption(dayOptions, "day", i);
    }
  
    // MONTH
    for (let i = 1; i <= 12; i++) {
      addOption(monthOptions, "month", i);
    }
  
    // YEAR
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 100; i--) {
      addOption(yearOptions, "year", i);
    }
  }
  
  function addOption(container, inputId, value) {
    const div = document.createElement("div");
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