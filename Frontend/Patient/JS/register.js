// =========================
// HELPER: show error
// =========================
function showError(input, message) {
  input.style.border = "1px solid red";

  let error = input.nextElementSibling;

  if (!error || !error.classList.contains("error-msg")) {
    error = document.createElement("div");
    error.className = "error-msg";
    error.innerText = message;
    input.after(error);
  } else {
    error.innerText = message;
  }
}

function clearError(input) {
  input.style.border = "1px solid #ddd";

  const error = input.nextElementSibling;
  if (error && error.classList.contains("error-msg")) {
    error.remove();
  }
}

// =========================
// VALIDATION FUNCTIONS
// =========================
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(pw) {
  return pw.length >= 6;
}

function isValidPhone(phone) {
  return /^0\d{9}$/.test(phone);
}

function isValidID(id) {
  return /^\d{13}$/.test(id);
}

function isNumber(value) {
  return !isNaN(value) && value.trim() !== "";
}

// =========================
// MAIN VALIDATE
// =========================
function validateForm() {
  let valid = true;

  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  const firstname = document.getElementById("firstname");
  const lastname = document.getElementById("lastname");

  const idCard = document.getElementById("idcard");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");

  const weight = document.getElementById("weight");
  const height = document.getElementById("height");

  const disease = document.getElementById("disease");

  const day = document.getElementById("day");
  const month = document.getElementById("month");
  const year = document.getElementById("year");

  const blood = document.getElementById("blood");
  const right = document.getElementById("right");

  const gender = document.querySelector('input[name="gender"]:checked');

  // USERNAME
  if (!username.value.trim()) {
    showError(username, "กรุณากรอกชื่อผู้ใช้");
    valid = false;
  } else clearError(username);

  // EMAIL
  if (!isValidEmail(email.value)) {
    showError(email, "รูปแบบอีเมลไม่ถูกต้อง");
    valid = false;
  } else clearError(email);

  // PASSWORD
  if (!isValidPassword(password.value)) {
    showError(password, "รหัสผ่านอย่างน้อย 6 ตัว");
    valid = false;
  } else clearError(password);

  if (password.value !== confirmPassword.value) {
    showError(confirmPassword, "รหัสผ่านไม่ตรงกัน");
    valid = false;
  } else clearError(confirmPassword);

  // NAME
  if (!firstname.value.trim()) {
    showError(firstname, "กรุณากรอกชื่อ");
    valid = false;
  } else clearError(firstname);

  if (!lastname.value.trim()) {
    showError(lastname, "กรุณากรอกนามสกุล");
    valid = false;
  } else clearError(lastname);

  // ID CARD
  if (!isValidID(idCard.value)) {
    showError(idCard, "เลขบัตรต้องมี 13 หลัก");
    valid = false;
  } else clearError(idCard);

  // GENDER
  if (!gender) {
    alert("กรุณาเลือกเพศ");
    valid = false;
  }

  // DATE (ใช้กับ custom dropdown)
  if (!day.value || !month.value || !year.value) {
    alert("กรุณาเลือกวันเกิด");
    valid = false;
  }

  // PHONE
  if (!isValidPhone(phone.value)) {
    showError(phone, "เบอร์โทรต้องเป็นตัวเลข 10 หลัก");
    valid = false;
  } else clearError(phone);

  // ADDRESS
  if (!address.value.trim()) {
    showError(address, "กรุณากรอกที่อยู่");
    valid = false;
  } else clearError(address);

  // BLOOD
  if (!blood.value) {
    alert("กรุณาเลือกกรุ๊ปเลือด");
    valid = false;
  }

  // DISEASE
  if (!disease.value.trim()) {
    showError(disease, "กรุณากรอกโรคประจำตัว");
    valid = false;
  } else clearError(disease);

  // WEIGHT / HEIGHT
  if (!isNumber(weight.value)) {
    showError(weight, "กรุณากรอกตัวเลข");
    valid = false;
  } else clearError(weight);

  if (!isNumber(height.value)) {
    showError(height, "กรุณากรอกตัวเลข");
    valid = false;
  } else clearError(height);

  // RIGHT
  if (!right.value) {
    alert("กรุณาเลือกสิทธิการรักษา");
    valid = false;
  }

  return valid;
}

// =========================
// SUBMIT
// =========================
function submitForm() {
  if (!validateForm()) return;

  const user = {
    username: document.getElementById("username").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim(),
    firstname: document.getElementById("firstname").value.trim(),
    lastname: document.getElementById("lastname").value.trim(),
  };

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const exists = users.find(u => u.email === user.email);
  if (exists) {
    alert("อีเมลนี้ถูกใช้งานแล้ว");
    return;
  }

  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  alert("สมัครสำเร็จ 🎉");

  window.location.href = "../../login.html";
}

// =========================
// PASSWORD TOGGLE
// =========================
function togglePassword(id, icon) {
  const input = document.getElementById(id);

  if (input.type === "password") {
    input.type = "text";
    icon.src = "../../img/eye.svg";
  } else {
    input.type = "password";
    icon.src = "../../img/eye-off.svg";
  }
}

// =========================
// CUSTOM DROPDOWN
// =========================
function toggleDropdown(el) {
  const options = el.nextElementSibling;
  const arrow = el.querySelector(".arrow");

  options.classList.toggle("show");
  arrow.classList.toggle("rotate");
}

function selectOption(option, selectId) {
  const dropdown = option.closest(".custom-dropdown");

  dropdown.querySelector(".dropdown-selected span").innerText =
    option.innerText;

  document.getElementById(selectId).value = option.innerText;

  dropdown.querySelector(".dropdown-options").classList.remove("show");
  dropdown.querySelector(".arrow").classList.remove("rotate");
}

// =========================
// GENERATE DATE (ใช้กับ custom dropdown)
// =========================
window.onload = function () {
  const dayOptions = document.getElementById("dayOptions");
  const monthOptions = document.getElementById("monthOptions");
  const yearOptions = document.getElementById("yearOptions");

  const daySelect = document.getElementById("day");
  const monthSelect = document.getElementById("month");
  const yearSelect = document.getElementById("year");

  // DAY
  for (let i = 1; i <= 31; i++) {
    addOption(dayOptions, daySelect, i);
  }

  // MONTH
  for (let i = 1; i <= 12; i++) {
    addOption(monthOptions, monthSelect, i);
  }

  // YEAR
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 100; i--) {
    addOption(yearOptions, yearSelect, i);
  }
};

function addOption(container, select, value) {
  const div = document.createElement("div");
  div.innerText = value;

  div.onclick = function () {
    container.previousElementSibling.querySelector("span").innerText = value;
    select.value = value;

    container.classList.remove("show");
    container.previousElementSibling
      .querySelector(".arrow")
      .classList.remove("rotate");
  };

  container.appendChild(div);
}