// =========================
// HELPER: show error
// =========================
function showError(input, message) {
  input.style.border = "1px solid red";

  let error = input.nextElementSibling;
  if (!error || !error.classList.contains("error-msg")) {
    error = document.createElement("div");
    error.className = "error-msg";
    error.style.color = "red";
    error.style.fontSize = "12px";
    error.style.marginTop = "4px";
    input.after(error);
  }

  error.innerText = message;
}

function clearError(input) {
  input.style.border = "1px solid #ddd";

  const error = input.nextElementSibling;
  if (error && error.classList.contains("error-msg")) {
    error.remove();
  }
}

// =========================
// VALIDATION
// =========================
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =========================
// toggle password
// =========================
function togglePassword() {
  const password = document.getElementById("password");
  const eye = document.getElementById("eyeIcon");

  if (password.type === "password") {
    password.type = "text";
    eye.src = "./img/eye-password-show-svgrepo-com.svg";
  } else {
    password.type = "password";
    eye.src = "./img/eye-off-c-os-208494.svg";
  }
}

// =========================
// LOGIN + VALIDATION
// =========================
function login() {
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  let valid = true;

  // EMAIL
  if (!email.value.trim()) {
    showError(email, "กรุณากรอกอีเมล");
    valid = false;
  } else if (!isValidEmail(email.value)) {
    showError(email, "รูปแบบอีเมลไม่ถูกต้อง");
    valid = false;
  } else {
    clearError(email);
  }

  // PASSWORD
  if (!password.value.trim()) {
    showError(password, "กรุณากรอกรหัสผ่าน");
    valid = false;
  } else if (password.value.length < 6) {
    showError(password, "รหัสผ่านต้องอย่างน้อย 6 ตัว");
    valid = false;
  } else {
    clearError(password);
  }

  if (!valid) return;

  // =========================
  // ดึง user จาก register
  // =========================
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    u => u.email === email.value && u.password === password.value
  );

  // =========================
  // ไม่เจอ user
  // =========================
  if (!user) {
    alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    return;
  }

  // =========================
  // ✅ login สำเร็จ
  // =========================
  localStorage.setItem("username", user.firstname);

  // =========================
  // ROLE
  // =========================
  if (user.email.includes("doctor")) {
    window.location.href = "./DoctorandStaff/html/dashboard.html";
  } 
  else if (user.email.includes("admin")) {
    window.location.href = "./Admin/html/dashboard.html";
  } 
  else {
    window.location.href = "./Patient/html/dashboard.html";
  }
}