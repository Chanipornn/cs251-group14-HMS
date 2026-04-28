// ================= DATA =================
const staffPositions = [
    "พยาบาล",
    "เจ้าหน้าที่เวชระเบียน",
    "เจ้าหน้าที่การเงิน",
    "เจ้าหน้าที่ลงทะเบียนผู้ป่วย"
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
        img.src = userData.img || "../../img/staff_img1.png";
        img.onerror = () => img.src = "../../img/staff_img1.png";
    }

    // email
    const email = document.querySelector(".user-meta .value");
    if (email) email.innerText = userData.email || "-";

    // role badge
    const roleBadge = document.querySelector(".role-badge");
    if (roleBadge) {
        roleBadge.innerText = userData.role || "Staff";
        roleBadge.className = `role-badge ${(userData.type || "staff").toLowerCase()}`;
    }

    // สร้าง custom dropdown สำหรับตำแหน่ง
    buildPositionDropdown(userData.dept || "");

    // expertise
    const expertiseInput = document.getElementById("expertiseInput");
    if (expertiseInput && userData.expertise) {
        expertiseInput.value = userData.expertise;
    }

    // ปิด dropdown เมื่อคลิกข้างนอก
    document.addEventListener("click", e => {
        if (!e.target.closest(".custom-select-wrapper")) {
            closePositionDropdown();
        }
    });
});

// ================= CUSTOM DROPDOWN =================
function buildPositionDropdown(currentValue) {
    const menu    = document.getElementById("deptMenu");
    const display = document.getElementById("deptDisplay");
    const hidden  = document.getElementById("deptSelect");

    if (!menu) return;

    menu.innerHTML = staffPositions.map(p => `
        <div class="select-option ${p === currentValue ? 'selected' : ''}"
             onclick="selectPosition('${p}')">
            <span class="option-check">${p === currentValue ? '✓' : ''}</span>
            <span>${p}</span>
        </div>
    `).join("");

    if (currentValue && display) {
        display.textContent = currentValue;
        display.classList.remove("placeholder");
    }
    if (hidden) hidden.value = currentValue;
}

function togglePositionDropdown() {
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

function closePositionDropdown() {
    const menu  = document.getElementById("deptMenu");
    const arrow = document.querySelector(".select-arrow");
    if (menu)  menu.classList.remove("show");
    if (arrow) arrow.classList.remove("rotate");
}

function selectPosition(value) {
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

    closePositionDropdown();
}

// ================= SAVE =================
function saveData() {
    const userData = JSON.parse(localStorage.getItem("editUser"));
    if (!userData) return;

    const updatedDept      = document.getElementById("deptSelect")?.value || "";
    const expertiseInput   = document.getElementById("expertiseInput");
    const updatedExpertise = expertiseInput ? expertiseInput.value : "";

    if (!updatedDept) {
        showModal("กรุณาเลือกตำแหน่ง", false);
        return;
    }

    const newData = { ...userData, dept: updatedDept, expertise: updatedExpertise };

    // อัปเดต allUsers
    let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
    if (userData.index !== undefined && allUsers[userData.index]) {
        allUsers[userData.index] = newData;
        localStorage.setItem("allUsers", JSON.stringify(allUsers));
    }

    // sync กลับ users
    if (userData.userId) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.id === userData.userId);
        if (userIndex !== -1) {
            users[userIndex].dept      = updatedDept;
            users[userIndex].expertise = updatedExpertise;
            localStorage.setItem("users", JSON.stringify(users));
        }
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