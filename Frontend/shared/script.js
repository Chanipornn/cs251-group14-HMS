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

async function login() {
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  let valid = true;

  if (!email.value.trim()) {
    showError(email, "กรุณากรอกอีเมล");
    valid = false;
  } else if (!isValidEmail(email.value)) {
    showError(email, "รูปแบบอีเมลไม่ถูกต้อง");
    valid = false;
  } else {
    clearError(email);
  }

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

  try {
    const res = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Email: email.value.trim(),
        Password: password.value.trim()
      })
    });

    const data = await res.json();

    console.log("LOGIN RESPONSE:", data);

    if (!data.status) {
      alert(data.message);
      return;
    }

    // ✅ เก็บ user
    localStorage.setItem("currentUser", JSON.stringify(data));

    const role = (data.role || "").toLowerCase();

    if (role === "admin") {
      window.location.href = "./Admin/html/User_Dashboard.html";
    } 
    else if (role === "doctor" || role === "staff") {
      window.location.href = "./DoctorandStaff/html/history.html";
    } 
    else {
      window.location.href = "./Patient/html/home.html";
    }

  } catch (err) {
    console.error(err);
    alert("เชื่อมต่อ server ไม่ได้");
  }
}

/*
async function login() {
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

  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  try {
    // =========================
    // เรียก Backend API
    // =========================
    /*
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: emailValue,
        password: passwordValue
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    const user = data.user;
    */


/*
    // =========================
    // 🔧 (ปัจจุบัน) ใช้ localStorage ไปก่อน
    // =========================
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      u => u.email === emailValue && u.password === passwordValue
    );

    if (!user) {
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }
*/
/*
    // =========================
    // SAVE SESSION
    // =========================
    localStorage.setItem("currentUser", JSON.stringify(user));

    // =========================
    // ROLE REDIRECT (ใช้ role จริง แทน email)
    // =========================
    const role = (user.role || "").toLowerCase();

    if (role === "admin") {
      window.location.href = "./Admin/html/User_Dashboard.html";
    } 
    else if (role === "doctor" || role === "staff") {
      window.location.href = "./DoctorandStaff/html/history.html";
    } 
    else {
      window.location.href = "./Patient/html/home.html";
    }

  } catch (err) {
    console.error(err);
    alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
  }
}
*/