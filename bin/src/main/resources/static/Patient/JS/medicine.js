//จำลองข้อมูล
const medicineDatabase = [
    {
        id: "MED-001",
        date: "19/04/2026 09:46:15",
        name: "Amoxicillin 500mg",
        amount: "15 แคปซูล",
        instruction: "รับประทานครั้งละ 1 เม็ด วันละ 3 ครั้ง หลังอาหารทันที (เช้า-กลางวัน-เย็น)",
        note: "ต้องทานติดต่อกันจนหมด,",
        dept: "หู คอ จมูก",
        doctor: "นพ.สมชาย ศรีสุข"
    },
    {
        id: "MED-002",
        date: "15/04/2026 11:23:08",
        name: "Paracetamol 500mg",
        amount: "10 เม็ด",
        instruction: "รับประทานครั้งละ 1-2 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการปวดหรือไข้",
        note: "ห้ามทานเกินวันละ 8 เม็ด",
        dept: "ศัลยกรรม",
        doctor: "พญ.วราภรณ์ ศิริชัย"
    }
];
// ฟังก์ชันแสดงผลการ์ด
function displayMedicine(dataList) {
    const listElement = document.getElementById('medicineList'); // ต้องตรงกับ ID ใน HTML
    
    if (!listElement) return; // กัน Error ถ้าหา Element ไม่เจอ

    if (dataList.length === 0) {
        listElement.innerHTML = '<p style="text-align:center; padding:20px;">ไม่พบข้อมูลยา</p>';
        return;
    }

    const html = dataList.map(item => `
        <div class="medical-card">
            <div class="card-top">
                <span>${item.date}</span>
                <i class="fa-solid fa-chevron-right arrow btn-detail" 
                onclick="handleCardClick('${item.id}')" 
                style="cursor: pointer; padding: 10px;"></i>
            </div>
            
            <div class="info-row">
                <span class="badge badge-medicine">ชื่อยา</span>
                <span class="info-text"">
                    ${item.name}
                </span>
            </div>

            <div class="info-row"><span class="badge">แผนก</span><span class="info-text">${item.dept}</span></div>
            <div class="info-row"><span class="badge">แพทย์</span><span class="info-text">${item.doctor}</span></div>
        </div>
    `).join('');

    listElement.innerHTML = html;
}

function handleCardClick(id) {
    console.log("Medicine ID " + id + " was clicked!");
    // เปลี่ยนชื่อไฟล์เป็นของหน้ายา (ถ้ามี)
    window.location.href = `medicine_details.html?id=${id}`;
}

// ระบบค้นหา
document.getElementById('searchInput').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = medicineDatabase.filter(item => 
        item.name.toLowerCase().includes(keyword) // ค้นหาตามชื่อยา
    );
    displayRecords(filtered);
});

// เริ่มการทำงานเมื่อโหลดหน้าเว็บเสร็จ
window.onload = () => {
    // ต้องเรียกชื่อฟังก์ชันให้ถูก (ในรูปคือฟังก์ชัน displayMedicine)
    setTimeout(() => { 
        displayMedicine(medicineDatabase); 
    }, 500);
};