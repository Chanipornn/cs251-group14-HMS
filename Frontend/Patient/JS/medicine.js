//จำลองข้อมูล
// จำลองข้อมูลยา อิงชื่อตัวแปรตาม Schema
const medicineDatabase = [
    {
        RecordID: "REC69001",
        PatientID: "P1001",
        PatientName: "นายสมิง เสือเก่ง",
        VisitDate: "11/04/2026 09:46:15",
        Medicine_Name: "Paracetamol 500mg",
        Dept_Name: "หู คอ จมูก",
        DoctorName: "นพ.สมชาย ศรีสุข"
    },
    {
        RecordID: "REC69002",
        PatientID: "P1002",
        PatientName: "นางสาวใยบัว แก้วหวาน",
        VisitDate: "30/01/2026 11:23:08",
        Medicine_Name: "Amoxicillin",
        Dept_Name: "ศัลยกรรม",
        DoctorName: "พญ.วราภรณ์ ศิริชัย"
    }
];
// ฟังก์ชันแสดงผลการ์ด
function displayMedicine(dataList) {
    const listElement = document.getElementById('medicineList');
    
    if (!listElement) return;

    if (dataList.length === 0) {
        listElement.innerHTML = '<p style="text-align:center; padding:20px;">ไม่พบข้อมูลยา</p>';
        return;
    }

    const html = dataList.map(item => `
        <div class="medical-card">
            <div class="card-top">
                <span>${item.VisitDate}</span>
                <i class="fa-solid fa-chevron-right arrow btn-detail" 
                onclick="handleCardClick('${item.RecordID}')" 
                style="cursor: pointer; padding: 10px;"></i>
            </div>
            

            <div class="info-row">
                <span class="badge badge-medicine">ชื่อยา</span>
                <span class="info-text">${item.Medicine_Name}</span>
            </div>

            <div class="info-row"><span class="badge">แผนก</span><span class="info-text">${item.Dept_Name}</span></div>
            <div class="info-row"><span class="badge">แพทย์</span><span class="info-text">${item.DoctorName}</span></div>
        </div>
    `).join('');

    listElement.innerHTML = html;
}

function handleCardClick(id) {
    console.log("Medicine Record ID " + id + " was clicked!");
    // ส่ง RecordID ไปที่หน้ารายละเอียดประวัติยา
    window.location.href = `medicine_details.html?id=${id}`;
}

// 4. ระบบค้นหา (กรองตาม ชื่อยา, RecordID, ชื่อหมอ, PatientID, PatientName)
document.getElementById('searchInput').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    
    const filtered = medicineDatabase.filter(item => 
        item.Medicine_Name.toLowerCase().includes(keyword) || 
        item.RecordID.toLowerCase().includes(keyword) || 
        item.DoctorName.toLowerCase().includes(keyword) || 
        item.PatientName.toLowerCase().includes(keyword) || 
        item.PatientID.toLowerCase().includes(keyword)
    );
    
    // สำคัญ: ต้องเรียก displayMedicine ให้ถูกฟังก์ชัน
    displayMedicine(filtered); 
});

// เริ่มการทำงานเมื่อโหลดหน้าเว็บเสร็จ
window.onload = () => {
    // ต้องเรียกชื่อฟังก์ชันให้ถูก (ในรูปคือฟังก์ชัน displayMedicine)
    setTimeout(() => { 
        displayMedicine(medicineDatabase); 
    }, 500);
};