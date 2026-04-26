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

    // department
    const deptSelect = document.getElementById("deptSelect");
    if (deptSelect) {
        deptSelect.innerHTML = `<option value="">-- กรุณาเลือกแผนก --</option>`;
        departmentList.forEach(d => {
            const selected = d === userData.dept ? "selected" : "";
            deptSelect.innerHTML += `<option ${selected}>${d}</option>`;
        });
    }

    // expertise
    const exp = document.getElementById("expertiseInput");
    if (exp) exp.value = userData.expertise || "";
});

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
// success=true → ไอคอนถูก (สีเขียว), false → ไอคอนแจ้งเตือน
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

    // เก็บ callback ไว้ใน overlay
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