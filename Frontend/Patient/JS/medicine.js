//จำลองข้อมูล
// จำลองข้อมูลยา อิงชื่อตัวแปรตาม Schema
const medicineDatabase = [
    {
        Record_ID: "REC001",
        Patient_ID: "P1001",
        Patient_Name: "นายสมิง เสือเก่ง",
        Record_Date: "11/04/2026 09:46:15",
        Medicine_Name: "Paracetamol 500mg",
        Dept_Name: "หู คอ จมูก",
        Doctor_Name: "นพ.สมชาย ศรีสุข"
    },
    {
        Record_ID: "REC002",
        Patient_ID: "P1002",
        Patient_Name: "นางสาวใยบัว แก้วหวาน",
        Record_Date: "30/01/2026 11:23:08",
        Medicine_Name: "Amoxicillin",
        Dept_Name: "ศัลยกรรม",
        Doctor_Name: "พญ.วราภรณ์ ศิริชัย"
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
                <span>${item.Record_Date}</span>
                <i class="fa-solid fa-chevron-right arrow btn-detail" 
                onclick="handleCardClick('${item.Record_ID}')" 
                style="cursor: pointer; padding: 10px;"></i>
            </div>
            

            <div class="info-row">
                <span class="badge badge-medicine">ชื่อยา</span>
                <span class="info-text">${item.Medicine_Name}</span>
            </div>

            <div class="info-row"><span class="badge">แผนก</span><span class="info-text">${item.Dept_Name}</span></div>
            <div class="info-row"><span class="badge">แพทย์</span><span class="info-text">${item.Doctor_Name}</span></div>
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
        item.Medicine_Name.toLowerCase().includes(keyword) || // ค้นหาชื่อยา
        item.Record_ID.toLowerCase().includes(keyword) ||     // ค้นหารหัสประวัติ
        item.Doctor_Name.toLowerCase().includes(keyword) ||   // ค้นหาชื่อหมอ
        item.Patient_Name.toLowerCase().includes(keyword) ||  // ค้นหาชื่อคนไข้
        item.Patient_ID.toLowerCase().includes(keyword)       // ค้นหาไอดีคนไข้
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