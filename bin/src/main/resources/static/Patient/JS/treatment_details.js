// จำลอง Database
const database = [
    {
        id: "REC001",
        date: "11/04/2026 09:46:15",
        symptoms: "ไอ จาม",
        diagnosis: "ไข้หวัด",
        medicine: "Cyproheptadine",
        dept: "ตา หู จมูก",
        doctor: "นพ.สมชาย ศรีสุข",
        advice: "พักผ่อนให้เพียงพอ ดื่มน้ำมากๆ"
    },
    {
        id: "REC002",
        date: "30/01/2026 11:23:08",
        symptoms: "ปวดท้องน้อยขวา",
        diagnosis: "ไส้ติ่งอักเสบ",
        medicine: "Painkiller IV",
        dept: "ศัลยกรรม",
        doctor: "พญ.วราภรณ์ ศิริชัย",
        advice: "งดน้ำและอาหาร เตรียมตัวผ่าตัดด่วน"
    }
];

// ดึง ID จาก URL
const urlParams = new URLSearchParams(window.location.search);
const recordId = urlParams.get('id');

// ฟังก์ชันแสดงผล
function displayDetail() {
    const content = document.getElementById('detailContent');
    // ค้นหาข้อมูลที่ตรงกับ ID
    const data = database.find(item => item.id === recordId);

    if (!data) {
        content.innerHTML = "<p>ไม่พบข้อมูลการรักษา</p>";
        return;
    }

    content.innerHTML = `
        <div class="medical-card" style="min-height: 500px; padding: 30px;">
            <div class="card-top">
                <span>${data.date}</span>
                <i class="fa-solid fa-chevron-right" style="color:#eee"></i>
            </div>
            
            <div class="info-row"><span class="badge">อาการ</span><span class="info-text">${data.symptoms}</span></div>
            <div class="info-row"><span class="badge">ผลวินิจฉัย</span><span class="info-text">${data.diagnosis}</span></div>
            <div class="info-row"><span class="badge">ยาที่สั่ง</span><span class="info-text">${data.medicine}</span></div>
            <div class="info-row"><span class="badge">แผนก</span><span class="info-text">${data.dept}</span></div>
            <div class="info-row"><span class="badge">แพทย์</span><span class="info-text">${data.doctor}</span></div>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">
            
            <div style="margin-top: 20px;">
                <h3 style="font-size: 14px; color: var(--text-main); margin-bottom: 10px;">คำแนะนำแพทย์</h3>
                <p style="font-size: 13px; color: #666; line-height: 1.6;">${data.advice}</p>
            </div>
        </div>
    `;
}

// โหลดข้อมูลทันที
window.onload = displayDetail;