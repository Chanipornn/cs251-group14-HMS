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