// ================= DATA =================
const doctorPositions = ["อายุรกรรม", "ศัลยกรรม", "หู คอ จมูก", "จิตเวช", "รังสีวิทยา", "กุมารเวชกรรม"];
const staffPositions  = ["พยาบาล", "เจ้าหน้าที่เวชระเบียน", "เจ้าหน้าที่การเงิน", "เจ้าหน้าที่ลงทะเบียนผู้ป่วย"];

// ================= HELPER =================
function populateSelect(selectElement, dataArray, labelText, currentValue) {
    let optionsHtml = `<option value="">-- กรุณาเลือก${labelText} --</option>`;

    dataArray.forEach(name => {
        const selected = name === currentValue ? "selected" : "";
        optionsHtml += `<option value="${name}" ${selected}>${name}</option>`;
    });

    selectElement.innerHTML = optionsHtml;
}

// ================= INIT PAGE =================
document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('editUser'));
    if (!userData) {
        alert("ไม่พบข้อมูลผู้ใช้");
        window.location.href = "dashboard.html";
        return;
    }

    // --- NAME ---
    const nameEl = document.querySelector('.display-name');
    if (nameEl) nameEl.innerText = userData.name;

    // --- PHONE ---
    const phoneEl = document.querySelector('.contact-info .value');
    if (phoneEl && userData.phone) phoneEl.innerText = userData.phone;

    // --- IMAGE ---
    const imgEl = document.querySelector('.profile-main-img');
    if (imgEl) {
        imgEl.src = userData.img || "../../img/staff_img1.png";
        imgEl.onerror = function () { this.src = "../../img/staff_img1.png"; };
    }

    // --- USERNAME / EMAIL ---
    const usernameEl = document.querySelector('.user-meta .value');
    if (usernameEl && userData.email) usernameEl.innerText = userData.email;

    // --- ROLE BADGE ---
    const roleBadge = document.querySelector('.role-badge');
    if (roleBadge) {
        roleBadge.innerText = userData.role || "Staff";
        roleBadge.className = `role-badge ${(userData.type || "staff").toLowerCase()}`;
    }

    // --- POSITION DROPDOWN ---
    // ใช้ ID "deptSelect" ตาม HTML (Staff_Edit_Add.html ควรมี id="deptSelect")
    const deptSelect = document.getElementById('deptSelect');
    if (deptSelect) {
        populateSelect(deptSelect, staffPositions, "ตำแหน่ง", userData.dept || "");
    }

    // --- EXPERTISE / NOTE (ถ้ามี input เพิ่มเติม) ---
    const expertiseInput = document.getElementById('expertiseInput');
    if (expertiseInput && userData.expertise) {
        expertiseInput.value = userData.expertise;
    }
});

// ================= SAVE =================
function saveData() {
    const userData = JSON.parse(localStorage.getItem('editUser'));
    if (!userData) return;

    const deptSelect     = document.getElementById('deptSelect');
    const expertiseInput = document.getElementById('expertiseInput');

    const updatedDept      = deptSelect     ? deptSelect.value     : "";
    const updatedExpertise = expertiseInput ? expertiseInput.value : "";

    if (!updatedDept) {
        alert("กรุณาเลือกตำแหน่ง");
        return;
    }

    const newData = {
        ...userData,
        dept:      updatedDept,
        expertise: updatedExpertise
    };

    // ===== UPDATE allUsers =====
    let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];

    if (userData.index !== undefined && allUsers[userData.index]) {
        allUsers[userData.index] = newData;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }

    // ===== SYNC กลับไป "users" ด้วย =====
    if (userData.userId) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === userData.userId);
        if (userIndex !== -1) {
            users[userIndex].dept      = updatedDept;
            users[userIndex].expertise = updatedExpertise;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    // อัปเดต editUser ด้วยข้อมูลใหม่
    localStorage.setItem('editUser', JSON.stringify(newData));

    alert("บันทึกข้อมูลของ " + newData.name + " สำเร็จ!");
    window.location.href = "dashboard.html";
}

// ================= CANCEL =================
function cancelEdit() {
    window.location.href = "dashboard.html";
}

// ================= SIDEBAR =================
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) sidebar.classList.toggle("hide");
}

// ================= LOGOUT =================
function logout() {
    localStorage.clear();
    window.location.href = "../../login.html";
}

// ================= DROPDOWN (หน้านี้) =================
function toggleDropdown() {
    const menu  = document.getElementById("dropdownMenu");
    const arrow = document.querySelector(".arrowdropdown");
    if (menu)  menu.classList.toggle("show");
    if (arrow) arrow.classList.toggle("rotate");
}

document.addEventListener("click", e => {
    if (!e.target.closest('.role-dropdown')) {
        const menu  = document.getElementById("dropdownMenu");
        const arrow = document.querySelector(".arrowdropdown");
        if (menu)  menu.classList.remove("show");
        if (arrow) arrow.classList.remove("rotate");
    }
});