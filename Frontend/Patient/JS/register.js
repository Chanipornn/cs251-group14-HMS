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

  const username        = document.getElementById("username");
  const email           = document.getElementById("email");
  const password        = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  const firstname = document.getElementById("firstname");
  const lastname  = document.getElementById("lastname");

  const idCard  = document.getElementById("idcard");
  const phone   = document.getElementById("phone");
  const address = document.getElementById("address");

  const weight = document.getElementById("weight");
  const height = document.getElementById("height");

  const disease = document.getElementById("disease");

  const day   = document.getElementById("day");
  const month = document.getElementById("month");
  const year  = document.getElementById("year");

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
    showInlineAlert("กรุณาเลือกเพศ");
    valid = false;
  }

  // DATE
  if (!day.value || !month.value || !year.value) {
    showInlineAlert("กรุณาเลือกวันเกิด");
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
    showInlineAlert("กรุณาเลือกกรุ๊ปเลือด");
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
    showInlineAlert("กรุณาเลือกสิทธิการรักษา");
    valid = false;
  }

  return valid;
}

// =========================
// INLINE ALERT (แทน alert())
// =========================
function showInlineAlert(message) {
  let alertBox = document.getElementById("inlineAlert");

  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.id = "inlineAlert";
    alertBox.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffc107;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 0.9rem;
      z-index: 9998;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transition: opacity 0.3s;
    `;
    document.body.appendChild(alertBox);
  }

  alertBox.innerText = message;
  alertBox.style.opacity = "1";

  clearTimeout(alertBox._timer);
  alertBox._timer = setTimeout(() => {
    alertBox.style.opacity = "0";
  }, 2500);
}

// =========================
// SUBMIT
// =========================
function submitForm() {
  if (!validateForm()) return;

  const user = {
    // ข้อมูลระบบ
    id: Date.now(),
    role: "Patient",
    status: "active",

    // บัญชี
    username: document.getElementById("username").value.trim(),
    email:    document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim(),

    // ส่วนตัว
    firstname: document.getElementById("firstname").value.trim(),
    lastname:  document.getElementById("lastname").value.trim(),
    fullname:
      document.getElementById("firstname").value.trim() + " " +
      document.getElementById("lastname").value.trim(),

    idcard: document.getElementById("idcard").value.trim(),
    gender: document.querySelector('input[name="gender"]:checked')?.value || "",

    // วันเกิด
    birth:
      document.getElementById("day").value + "-" +
      document.getElementById("month").value + "-" +
      document.getElementById("year").value,

    // ติดต่อ
    phone:   document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim(),

    // สุขภาพ
    blood:   document.getElementById("blood").value,
    disease: document.getElementById("disease").value.trim(),
    allergy: document.getElementById("allergy").value.trim(),
    weight:  document.getElementById("weight").value.trim(),
    height:  document.getElementById("height").value.trim(),
    right:   document.getElementById("right").value,

    // รูปโปรไฟล์
    profileImage: "",
  };

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const exists = users.find(u => u.email === user.email);
  if (exists) {
    showInlineAlert("อีเมลนี้ถูกใช้งานแล้ว");
    return;
  }

  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(user));

  // ✅ แสดง popup สวยงามแทน alert
  showSuccessPopup();
}

// =========================
// SUCCESS POPUP (แทน alert)
// =========================
function showSuccessPopup() {
  // ป้องกันสร้างซ้ำ
  if (document.getElementById("successOverlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "successOverlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeInOverlay 0.2s ease;
  `;

  overlay.innerHTML = `
    <style>
      @keyframes fadeInOverlay {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes popIn {
        from { transform: scale(0.8); opacity: 0; }
        to   { transform: scale(1);   opacity: 1; }
      }
      #successCard {
        background: #ffffff;
        border-radius: 20px;
        padding: 44px 40px 36px;
        text-align: center;
        max-width: 380px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      #successCard .icon-wrap {
        width: 72px;
        height: 72px;
        background: #edfaf1;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
      }
      #successCard h3 {
        margin: 0 0 8px;
        font-size: 1.3rem;
        color: #1a1a2e;
        font-weight: 700;
      }
      #successCard p {
        margin: 0 0 28px;
        color: #6b7280;
        font-size: 0.95rem;
        line-height: 1.5;
      }
      #successCard .btn-go {
        background: #7b6ee6;
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 14px 0;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        transition: background 0.2s, transform 0.1s;
      }
      #successCard .btn-go:hover {
        background: #6558d3;
        transform: translateY(-1px);
      }
      #successCard .btn-go:active {
        transform: translateY(0);
      }
    </style>

    <div id="successCard">
      <div class="icon-wrap">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="18" fill="#22c55e"/>
          <path d="M10 18.5l5.5 5.5 10.5-11"
                stroke="#fff"
                stroke-width="2.8"
                stroke-linecap="round"
                stroke-linejoin="round"/>
        </svg>
      </div>
      <h3>สร้างบัญชีสำเร็จ!</h3>
      <p>ยินดีต้อนรับสู่ระบบ<br>บัญชีของคุณพร้อมใช้งานแล้ว</p>
      <button class="btn-go" onclick="goToHome()">เข้าสู่หน้าหลัก</button>
    </div>
  `;

  document.body.appendChild(overlay);
}

function goToHome() {
  window.location.href = "../../Patient/html/home.html";
}

// =========================
// PASSWORD TOGGLE
// =========================
function togglePassword(id, icon) {
  const input = document.getElementById(id);

  // toggle type
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";

  // toggle class
  icon.classList.toggle("active");

  // set icon ตาม state
  if (icon.classList.contains("active")) {
    icon.src = "../../img/eye-password-show.svg";      
  } else {
    icon.src = "../../img/eye-off.svg";   
  }
}

// =========================
// CUSTOM DROPDOWN
// =========================
function toggleDropdown(el) {
  const options = el.nextElementSibling;
  const arrow   = el.querySelector(".arrow");

  options.classList.toggle("show");
  arrow.classList.toggle("rotate");
}

function selectOption(option, selectId) {
  const dropdown = option.closest(".custom-dropdown");

  dropdown.querySelector(".dropdown-selected span").innerText = option.innerText;
  document.getElementById(selectId).value = option.innerText;

  dropdown.querySelector(".dropdown-options").classList.remove("show");
  dropdown.querySelector(".arrow").classList.remove("rotate");
}

// =========================
// GENERATE DATE
// =========================
window.onload = function () {
  const dayOptions   = document.getElementById("dayOptions");
  const monthOptions = document.getElementById("monthOptions");
  const yearOptions  = document.getElementById("yearOptions");

  const daySelect   = document.getElementById("day");
  const monthSelect = document.getElementById("month");
  const yearSelect  = document.getElementById("year");

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

// =========================
// TOAST (เก็บไว้กรณีใช้ที่อื่น)
// =========================
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}