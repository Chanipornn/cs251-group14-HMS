// 1. ข้อมูลยาจำลอง (ให้ตรงกับหน้ารายการยา)
const medicineDatabase = [
    {
        Record_ID: "REC001", // เปลี่ยนจาก id เป็น Record_ID
        Patient_ID: "P1001",
        Patient_Name: "นายสมิง เสือเก่ง",
        Record_Date: "11/04/2026 09:46:15", // เปลี่ยนจาก date เป็น Record_Date
        Medicine_Name: "Cyproheptadine", // เปลี่ยนจาก name เป็น Medicine_Name
        Dept_Name: "ตา หู จมูก", // เปลี่ยนจาก dept เป็น Dept_Name
        Doctor_Name: "นพ.สมชาย ศรีสุข", // เปลี่ยนจาก doctor เป็น Doctor_Name
        Usage_Detail: "ผู้ใหญ่ เริ่มให้รับประทาน 12 มิลลิกรัมทันที หลังจากนั้นให้รับประทาน 2 มิลลิกรัม ทุก 2 ชั่วโมง หลังอาหาร วันละ 3 ครั้ง"
    },
    {
        Record_ID: "REC002",
        Patient_ID: "P1002",
        Patient_Name: "นางสาวใยบัว แก้วหวาน",
        Record_Date: "15/04/2026 11:23:08",
        Medicine_Name: "Paracetamol 500mg",
        Dept_Name: "ศัลยกรรม",
        Doctor_Name: "พญ.วราภรณ์ ศิริชัย",
        Usage_Detail: "รับประทานครั้งละ 1-2 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการปวดหรือไข้ (ห้ามทานเกินวันละ 8 เม็ด)"
    }
];

// 2. ดึง ID จาก URL
const urlParams = new URLSearchParams(window.location.search);
const currentRecordId = urlParams.get('id');

// 3. ฟังก์ชันแสดงผล
function displayMedicineDetail() {
    const content = document.getElementById('medicineDetailContent');
    const data = medicineDatabase.find(item => item.Record_ID === currentRecordId);

    if (!data) {
        content.innerHTML = "<p style='text-align:center;'>ไม่พบข้อมูลการรับยา</p>";
        return;
    }

    content.innerHTML = `
        <div class="medical-card" style="min-height: 600px; padding: 25px;">
            <div class="card-top">
                <span>${data.Record_Date}</span>
                <i class="fa-solid fa-chevron-right" style="color:#eee"></i>
            </div>
            
            <div class="info-row">
                <span class="badge" style="background-color: #A8CFFF; color: #1b2057;">ชื่อยา</span>
                <span class="info-text">${data.Medicine_Name}</span>
            </div>
            <div class="info-row">
                <span class="badge" style="background-color: #A8CFFF; color: #1b2057;">แผนก</span>
                <span class="info-text">${data.Dept_Name}</span>
            </div>
            <div class="info-row">
                <span class="badge" style="background-color: #A8CFFF; color: #1b2057;">แพทย์</span>
                <span class="info-text">${data.Doctor_Name}</span>
            </div>
            <div class="info-row" style="align-items: flex-start;">
                <span class="badge" style="background-color: #A8CFFF; color: #1b2057;">วิธีใช้</span>
                <span class="info-text" style="line-height: 1.6;">${data.Usage_Detail}</span>
            </div>
        </div>
    `;
}

window.onload = displayMedicineDetail;