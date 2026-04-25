// ฟังก์ชันเปิด-ปิด Dropdown ตัวเลือก
function toggleDropdown() {
    const list = document.getElementById('drop-list');
    const icon = document.getElementById('drop-icon');
    
    if (list.style.display === "none") {
        list.style.display = "flex";
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        list.style.display = "none";
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

// คลิกเลือกวันที่
const dateItems = document.querySelectorAll('.date-item');
dateItems.forEach(item => {
    item.addEventListener('click', () => {
        dateItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// คลิกเลือกเวลา
const timeBtns = document.querySelectorAll('.time-btn');
timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        timeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});


// อ้างอิง Element
const btnSubmit = document.querySelector('.btn-submit');
const successModal = document.getElementById('successModal');

// เมื่อกดปุ่มจองคิว
btnSubmit.addEventListener('click', () => {
    // ตรงนี้สามารถเพิ่มเงื่อนไขการตรวจสอบข้อมูลก่อนได้
    showModal();
});

function showModal() {
    successModal.style.display = "flex";
}

function closeModal() {
    successModal.style.display = "none";
    // เมื่อกดตกลง อาจจะสั่งให้รีเฟรชหน้าหรือไปที่หน้าอื่น
    // window.location.href = "pending_page.html"; 
}

// ปิด Modal เมื่อคลิกพื้นหลังภายนอก
window.onclick = function(event) {
    if (event.target == successModal) {
        closeModal();
    }
}

document.addEventListener("DOMContentLoaded", () => {

    // ✅ ดึงข้อมูลหมอจากหน้า Queue
    const data = JSON.parse(localStorage.getItem("selectedDoctor"));

    if (data) {
        document.getElementById("doctorName").textContent = data.name;
        document.getElementById("doctorDept").textContent = data.dept;
        document.getElementById("doctorImg").src = data.img;
    }

    // ==========================
    // 🎯 เลือกเวลา
    // ==========================
    document.querySelectorAll(".time-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    // ==========================
    // 🎯 กดจองคิว
    // ==========================
    document.querySelector(".btn-submit").addEventListener("click", () => {
        document.getElementById("successModal").classList.add("active");
    });

});

// ==========================
// 🎯 Dropdown
// ==========================
function toggleDropdown() {
    document.getElementById("drop-list").classList.toggle("active");
}

// ==========================
// 🎯 ปิด Modal
// ==========================
function closeModal() {
    document.getElementById("successModal").classList.remove("active");
}