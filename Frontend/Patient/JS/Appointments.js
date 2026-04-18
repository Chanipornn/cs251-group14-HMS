function switchTab(element, type) {
    // 1. สลับไฮไลท์ที่ปุ่ม Tab
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');

    // 2. ค้นหา Card ทั้งหมด
    const allCards = document.querySelectorAll('.appointment-card');

    allCards.forEach(card => {
        // ตรวจสอบว่า Card มีคลาสตรงกับประเภทที่เลือกหรือไม่
        if (card.classList.contains(type)) {
            card.style.display = "block"; // แสดง
        } else {
            card.style.display = "none";  // ซ่อน
        }
    });
}

// ตั้งค่าเริ่มต้น: เมื่อโหลดหน้ามา ให้แสดงแค่ 'today'
document.addEventListener("DOMContentLoaded", () => {
    const todayTab = document.querySelector('.tab-item.active');
    if (todayTab) switchTab(todayTab, 'today');
});