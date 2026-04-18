//จำลองข้อมูล
const database = [
    {
        id: "REC001",
        date: "11/04/2026 09:46:15",
        symptoms: "ไอ จาม",
        diagnosis: "ไข้หวัด",
        dept: "หู คอ จมูก",
        doctor: "นพ.สมชาย ศรีสุข"
    },
    {
        id: "REC002",
        date: "30/01/2026 11:23:08",
        symptoms: "ปวดท้องน้อยขวา คลื่นไส้ / อาเจียน",
        diagnosis: "ไส้ติ่ง",
        dept: "ศัลยกรรม",
        doctor: "พญ.วราภรณ์ ศิริชัย"
    }
];

// ฟังก์ชันแสดงผลการ์ด
function displayRecords(dataList) {
    const listElement = document.getElementById('recordsList');
    
    if (dataList.length === 0) {
        listElement.innerHTML = '<p style="text-align:center; padding:20px;">ไม่พบข้อมูล</p>';
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
            <div class="info-row"><span class="badge">อาการ</span><span class="info-text">${item.symptoms}</span></div>
            <div class="info-row"><span class="badge">ผลวินิจฉัย</span><span class="info-text">${item.diagnosis}</span></div>
            <div class="info-row"><span class="badge">แผนก</span><span class="info-text">${item.dept}</span></div>
            <div class="info-row"><span class="badge">แพทย์</span><span class="info-text">${item.doctor}</span></div>
        </div>
        
    `).join('');

    listElement.innerHTML = html;
}

function handleCardClick(id) {
    console.log("Card ID " + id + " was clicked!");
    window.location.href = `treatment_details.html?id=${id}`;
}

// ระบบค้นหา
document.getElementById('searchInput').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = database.filter(item => 
        item.symptoms.toLowerCase().includes(keyword) || 
        item.doctor.toLowerCase().includes(keyword)
    );
    displayRecords(filtered);
});

// เริ่ทการทำงาน
window.onload = () => {
    // จำลองการโหลดข้อมูลจาก API โดยหน่วงเวลา 1 วินาที
    setTimeout(() => {
        displayRecords(database);
    }, 1000);
};