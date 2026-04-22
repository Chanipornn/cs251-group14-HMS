// ================== DATA ==================
const doctorPositions = ["อายุรกรรม", "ศัลยกรรม", "หู คอ จมูก", "จิตเวช", "รังสีวิทยา", "กุมารเวชกรรม"];
const staffPositions = ["พยาบาล", "เจ้าหน้าที่เวชระเบียน", "เจ้าหน้าที่การเงิน", "เจ้าหน้าที่ลงทะเบียนผู้ป่วย"];

// ================== HELPER ==================
function populateSelect(selectElement, dataArray, labelText, currentValue) {
    let optionsHtml = `<option value="">-- กรุณาเลือก${labelText} --</option>`;
    
    dataArray.forEach(name => {
        const selected = name === currentValue ? "selected" : "";
        optionsHtml += `<option value="${name}" ${selected}>${name}</option>`;
    });

    selectElement.innerHTML = optionsHtml;
}

// ================== INIT PAGE ==================
document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('editUser'));
    if (!userData) return;

    // --- NAME ---
    const nameEl = document.querySelector('.display-name');
    if (nameEl) nameEl.innerText = userData.name;

    // --- PHONE ---
    const phoneEl = document.querySelector('.contact-info .value');
    if (phoneEl && userData.phone) phoneEl.innerText = userData.phone;

    // --- IMAGE ---
    const imgEl = document.querySelector('.profile-main-img');
    if (imgEl && userData.img) imgEl.src = userData.img;

    // --- ROLE BADGE ---
    const roleText = document.getElementById('currentRole');
    const roleBadge = document.getElementById('roleDisplay');

    if (roleText && roleBadge) {
        roleText.innerText = userData.role;
        roleBadge.classList.remove('doctor', 'staff');
        roleBadge.classList.add(userData.type.toLowerCase());
    }

    // --- DROPDOWN (สำคัญ) ---
    const staffSelect = document.getElementById('staffDeptSelect');
    if (staffSelect) {
        populateSelect(staffSelect, staffPositions, "ตำแหน่ง", userData.dept || userData.position);
    }
});

// ================== SAVE ==================
function saveData() {
    const userData = JSON.parse(localStorage.getItem('editUser'));
    if (!userData) return;

    const updatedDept = document.getElementById('deptSelect')?.value 
                      || document.getElementById('staffDeptSelect')?.value;

    const updatedExpertise = document.querySelector('input')?.value || "";

    const newData = {
        ...userData,
        dept: updatedDept,
        expertise: updatedExpertise
    };

    // ===== UPDATE LIST หลัก =====
    let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];

    if (userData.index !== undefined) {
        allUsers[userData.index] = newData;
    }

    localStorage.setItem('allUsers', JSON.stringify(allUsers));

    alert("บันทึกสำเร็จ!");
    window.location.href = "dashboard.html";
}

// ================== CANCEL ==================
function cancelEdit() {
    window.location.href = "dashboard.html";
}

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("hide");
  }