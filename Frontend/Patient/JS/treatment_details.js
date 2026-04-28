// 1. ข้อมูลประวัติการรักษาจำลอง (อิงตามตัวแปร RecordID, VisitDate, Symptoms, Diagnosis, ฯลฯ)
const treatmentDatabase = [
    {
        RecordID: "REC69001",
        PatientID: "P1001",
        PatientName: "นายสมิง เสือเก่ง",
        VisitDate: "11/04/2026 09:46:15",
        Symptoms: "ไอ จาม มีไข้ต่ำๆ",
        Diagnosis: "ไข้หวัดทั่วไป (Common Cold)",
        Medicine_Name: "Cyproheptadine 4mg", // เพิ่มชื่อยา
        TreatmentDetail: "ตรวจร่างกายเบื้องต้น และสั่งจ่ายยาบรรเทาอาการ",
        TreatmentResult: "อาการดีขึ้นตามลำดับ",
        Note: "ควรพักผ่อนอย่างน้อย 8 ชั่วโมง และดื่มน้ำอุ่น",
        DoctorID: "D2005",
        DoctorName: "นพ.สมชาย ศรีสุข",
        DeptName: "หู คอ จมูก"
    },
    {
        RecordID: "REC69002",
        PatientID: "P1002",
        PatientName: "นางสาวใยบัว แก้วหวาน",
        VisitDate: "30/01/2026 11:23:08",
        Symptoms: "ปวดท้องน้อยขวา คลื่นไส้",
        Diagnosis: "ไส้ติ่งอักเสบ (Appendicitis)",
        Medicine_Name: "Painkiller IV / Antibiotics", // เพิ่มชื่อยา
        TreatmentDetail: "ตรวจ MRI และเตรียมการผ่าตัดด่วน",
        TreatmentResult: "ส่งตัวเข้ารับการผ่าตัดทันที",
        Note: "งดน้ำและอาหาร (NPO) ทันที",
        DoctorID: "D3012",
        DoctorName: "พญ.วราภรณ์ ศิริชัย",
        DeptName: "ศัลยกรรม"
    }
];

// 2. ดึง ID จาก URL
const urlParams = new URLSearchParams(window.location.search);
const currentRecordID = urlParams.get('id');

// 3. ฟังก์ชันแสดงผลรายละเอียด (รูปแบบฟอร์มเดิม)
function displayDetail() {
    const content = document.getElementById('detailContent');
    const data = treatmentDatabase.find(item => item.RecordID === currentRecordID);

    if (!data) {
        content.innerHTML = "<div class='medical-card' style='text-align:center; padding:50px;'>ไม่พบข้อมูลการรักษา</div>";
        return;
    }

    content.innerHTML = `
        <div class="medical-card" style="min-height: 500px; padding: 30px;">
            
            <div class="card-top">
                <span><i class="fa-regular fa-calendar-check"></i> ${data.VisitDate}</span>
                <span style="color: var(--main-purple); font-weight: 600;">${data.RecordID}</span>
            </div>
            <div class="info-row">
                <span class="badge">อาการ</span>
                <span class="info-text">${data.Symptoms}</span>
            </div>
            <div class="info-row">
                <span class="badge">การวินิจฉัย</span>
                <span class="info-text">${data.Diagnosis}</span>
            </div>
            <div class="info-row">
                <span class="badge">ยาที่สั่ง</span>
                <span class="info-text">${data.Medicine_Name}</span>
            </div>
            <div class="info-row">
                <span class="badge">การรักษา</span>
                <span class="info-text">${data.TreatmentDetail}</span>
            </div>
            <div class="info-row">
                <span class="badge">ผลการรักษา</span>
                <span class="info-text">${data.TreatmentResult}</span>
            </div>
            <div class="info-row">
                <span class="badge">แผนก</span>
                <span class="info-text">${data.DeptName}</span>
            </div>
            <div class="info-row">
                <span class="badge">แพทย์</span>
                <span class="info-text">${data.DoctorName}</span>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">
            
            <div style="margin-top: 20px;">
                <h3 style="font-size: 14px; color: var(--text-main); margin-bottom: 10px;">คำแนะนำแพทย์</h3>
                <p style="font-size: 13px; color: #666; line-height: 1.6;">${data.Note}</p>
            </div>
        </div>
    `;
}

// เรียกทำงาน
window.onload = displayDetail;