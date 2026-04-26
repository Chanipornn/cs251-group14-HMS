// ================= DATA =================
const staffPositions = [
    "พยาบาล",
    "เจ้าหน้าที่เวชระเบียน",
    "เจ้าหน้าที่การเงิน",
    "เจ้าหน้าที่ลงทะเบียนผู้ป่วย"
];

// ================= HELPER =================
function populateSelect(selectElement, dataArray, labelText, currentValue) {
    let optionsHtml = `<option value="">-- กรุณาเลือก${labelText} --</option>`;
    dataArray.forEach(name => {
        const selected = name === currentValue ? "selected" : "";
        optionsHtml += `<option value="${name}" ${selected}>${name}</option>`;
    });
    selectElement.innerHTML = optionsHtml;
}

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

    // position dropdown
    const deptSelect = document.getElementById("deptSelect") || document.getElementById("staffDeptSelect");
    if (deptSelect) {
        populateSelect(deptSelect, staffPositions, "ตำแหน่ง", userData.dept || "");
    }

    // expertise
    const expertiseInput = document.getElementById("expertiseInput");
    if (expertiseInput && userData.expertise) {
        expertiseInput.value = userData.expertise;
    }
});

// ================= SAVE =================
function saveData() {
    const userData = JSON.parse(localStorage.getItem("editUser"));
    if (!userData) return;

    const deptSelect     = document.getElementById("deptSelect") || document.getElementById("staffDeptSelect");
    const expertiseInput = document.getElementById("expertiseInput");

    const updatedDept      = deptSelect     ? deptSelect.value      : "";
    const updatedExpertise = expertiseInput ? expertiseInput.value  : "";

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

// ================= DROPDOWN =================
function toggleDropdown() {
    const menu  = document.getElementById("dropdownMenu");
    const arrow = document.querySelector(".arrowdropdown");
    if (menu)  menu.classList.toggle("show");
    if (arrow) arrow.classList.toggle("rotate");
}

document.addEventListener("click", e => {
    if (!e.target.closest(".role-dropdown")) {
        const menu  = document.getElementById("dropdownMenu");
        const arrow = document.querySelector(".arrowdropdown");
        if (menu)  menu.classList.remove("show");
        if (arrow) arrow.classList.remove("rotate");
    }
});