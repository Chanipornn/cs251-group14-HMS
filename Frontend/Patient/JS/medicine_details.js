// 1. ข้อมูลยาจำลอง (ให้ตรงกับหน้ารายการยา)
const medicineDatabase = [
    {
        id: "MED-001",
        date: "11/04/2026 09:46:15",
        name: "Cyproheptadine",
        dept: "ตา หู จมูก",
        doctor: "นพ.สมชาย ศรีสุข",
        usage: "ผู้ใหญ่ เริ่มให้รับประทาน 12 มิลลิกรัมทันที หลังจากนั้นให้รับประทาน 2 มิลลิกรัม ทุก 2 ชั่วโมง หลังอาหาร วันละ 3 ครั้ง"
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

// 2. ดึง ID จาก URL
const urlParams = new URLSearchParams(window.location.search);
const medId = urlParams.get('id');

// 3. ฟังก์ชันแสดงผล
function displayMedicineDetail() {
    const content = document.getElementById('medicineDetailContent');
    const data = medicineDatabase.find(item => item.id === medId);

    if (!data) {
        content.innerHTML = "<p style='text-align:center;'>ไม่พบข้อมูลการรับยา</p>";
        return;
    }

    content.innerHTML = `
        <div class="medical-card" style="min-height: 600px; padding: 25px;">
            <div class="card-top">
                <span>${data.date}</span>
                <i class="fa-solid fa-chevron-right" style="color:#eee"></i>
            </div>
            
            <div class="info-row">
                <span class="badge" style="background-color: #A8CFFF; color: #1b2057;">ชื่อยา</span>
                <span class="info-text">${data.name}</span>
            </div>
            <div class="info-row">
                <span class="badge" style="background-color: #A8CFFF; color: #1b2057;">แผนก</span>
                <span class="info-text">${data.dept}</span>
            </div>
            <div class="info-row">
                <span class="badge" style="background-color: #A8CFFF; color: #1b2057;">แพทย์</span>
                <span class="info-text">${data.doctor}</span>
            </div>
            <div class="info-row" style="align-items: flex-start;">
                <span class="badge" style="background-color: #A8CFFF; color: #1b2057;">วิธีใช้</span>
                <span class="info-text" style="line-height: 1.6;">${data.usage}</span>
            </div>
        </div>
    `;
}

window.onload = displayMedicineDetail;