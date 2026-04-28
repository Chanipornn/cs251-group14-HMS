// 1. จำลองข้อมูล (อิงตามตัวแปร RecordID, VisitDate, Symptoms, ฯลฯ)
const database = [
    {
        RecordID: "REC69001",           // รหัสประวัติการรักษา (PK)
        PatientID: "P1001",            // ไอดีคนไข้ (FK)
        PatientName: "นายสมิง เสือเก่ง",  // ชื่อคนไข้
        VisitDate: "11/04/2026 09:46:15", // วันที่รักษา
        Symptoms: "ไอ จาม มีไข้ต่ำๆ",      // อาการ
        Diagnosis: "ไข้หวัดทั่วไป",       // การวินิจฉัย
        Dept_Name: "หู คอ จมูก",        // แผนก
        DoctorName: "นพ.สมชาย ศรีสุข",   // ชื่อหมอ
        DoctorID: "D2005"              // ไอดีหมอ (FK)
    },
    {
        RecordID: "REC69002",
        PatientID: "P1002",
        PatientName: "นางสาวใยบัว แก้วหวาน",
        VisitDate: "30/01/2026 11:23:08",
        Symptoms: "ปวดท้องน้อยขวา คลื่นไส้",
        Diagnosis: "ไส้ติ่งอักเสบ",
        Dept_Name: "ศัลยกรรม",
        DoctorName: "พญ.วราภรณ์ ศิริชัย",
        DoctorID: "D3012"
    }
];

// 2. ฟังก์ชันแสดงผลการ์ด
function displayRecords(dataList) {
    const listElement = document.getElementById('recordsList');
    
    if (dataList.length === 0) {
        listElement.innerHTML = '<p style="text-align:center; padding:20px;">ไม่พบข้อมูล</p>';
        return;
    }

    const html = dataList.map(item => `
        <div class="medical-card">
            <div class="card-top">
                <span><i class="fa-regular fa-calendar"></i> ${item.VisitDate}</span>
                <i class="fa-solid fa-chevron-right arrow btn-detail" 
                   onclick="handleCardClick('${item.RecordID}')" 
                   style="cursor: pointer; padding: 10px;"></i>
            </div>

            <div style="margin-bottom: 12px; font-weight: 600; color: #4e4878a5;">
                <i class="fa-solid fa-user-injured"></i> ${item.PatientName} (${item.PatientID})
            </div>

            <div class="info-row"><span class="badge">อาการ</span><span class="info-text">${item.Symptoms}</span></div>
            <div class="info-row"><span class="badge">ผลวินิจฉัย</span><span class="info-text">${item.Diagnosis}</span></div>
            <div class="info-row"><span class="badge">แผนก</span><span class="info-text">${item.Dept_Name}</span></div>
            <div class="info-row"><span class="badge">แพทย์</span><span class="info-text">${item.DoctorName}</span></div>
        </div>
    `).join('');

    listElement.innerHTML = html;
}

// 3. ฟังก์ชันคลิกไปดูรายละเอียด
function handleCardClick(id) {
    console.log("Record ID " + id + " was clicked!");
    // ส่ง RecordID ไปที่หน้ารายละเอียด
    window.location.href = `treatment_details.html?id=${id}`;
}

// 4. ระบบค้นหา (กรองตาม RecordID, ชื่อหมอ, PatientID, PatientName)
document.getElementById('searchInput').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    
    const filtered = database.filter(item => 
        item.RecordID.toLowerCase().includes(keyword) || 
        item.DoctorName.toLowerCase().includes(keyword) ||
        item.PatientID.toLowerCase().includes(keyword) ||
        item.PatientName.toLowerCase().includes(keyword)
    );
    displayRecords(filtered);
});

// 5. เริ่มทำงานเมื่อโหลดหน้าเว็บ
window.onload = () => {
    // จำลองการโหลดข้อมูล 1 วินาที
    setTimeout(() => {
        displayRecords(database);
    }, 1000);
};