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


// ================= HELPER =================
function populateDepartment(selectEl, currentDept) {
    let options = '<option value="">-- กรุณาเลือกแผนก --</option>';

    departmentList.forEach(dept => {
        const selected = dept === currentDept ? "selected" : "";
        options += `<option value="${dept}" ${selected}>${dept}</option>`;
    });

    selectEl.innerHTML = options;
}

// ================= INIT PAGE =================
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

    // --- DEPARTMENT DROPDOWN ---
    const deptSelect = document.getElementById('deptSelect');
    if (deptSelect) {
        populateDepartment(deptSelect, userData.dept);
    }

    const expertiseInput = document.querySelector('input[placeholder="กรอกความเชี่ยวชาญ"]');
        if (expertiseInput && userData.expertise) {
            expertiseInput.value = userData.expertise; // นำค่าเดิมมาใส่ในช่อง Input
        }
});


// ================= SAVE =================
function saveData() {
    const userData = JSON.parse(localStorage.getItem('editUser'));
    if (!userData) return;

    // ดึงค่าจาก Select
    const updatedDept = document.getElementById('deptSelect').value;

    // เจาะจงไปที่ช่องความเชี่ยวชาญ (ป้องกันการไปดึงค่าจากช่อง Search)
    const expertiseInput = document.querySelector('input[placeholder="กรอกความเชี่ยวชาญ"]');
    const updatedExpertise = document.getElementById('expertiseInput').value;

    const newData = {
        ...userData,
        dept: updatedDept,
        expertise: updatedExpertise
    };

    // ===== UPDATE LIST หลัก =====
    let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];

    // ตรวจสอบ Index และอัปเดตข้อมูล
    if (userData.index !== undefined && allUsers[userData.index]) {
        allUsers[userData.index] = newData;
        
        // บันทึกกลับลง localStorage
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        
        alert("บันทึกข้อมูลของ " + newData.name + " สำเร็จ!");
        window.location.href = "dashboard.html";
    } else {
        alert("เกิดข้อผิดพลาด: ไม่พบข้อมูลพนักงานในระบบ");
    }
}

// ================= CANCEL =================
function cancelEdit() {
    window.location.href = "dashboard.html";
}