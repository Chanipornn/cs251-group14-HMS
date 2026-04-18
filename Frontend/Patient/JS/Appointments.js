const appointments = [
    {
        type: "today",
        date: "วันนี้",
        dept: "ตา หู จมูก",
        doctor: "นพ.สมชาย ศรีสุข",
        reason: "ตรวจทั่วไป",
        prepare: "เสียบบัตรประชาชนที่ตู้ออกรหัสรับคิว"
    },
    {
        type: "today",
        date: "วันนี้",
        dept: "อายุรกรรม",
        doctor: "นพ.พงศกร แก้วดี",
        reason: "ตรวจสุขภาพ",
        prepare: "งดอาหาร 8 ชั่วโมง"
    },
    {
        type: "upcoming",
        date: "25 เมษายน 2026",
        dept: "หู คอ จมูก",
        doctor: "นพ.นนทพัทธ์ ใจดี",
        reason: "ติดตามอาการ",
        prepare: "มาถึงก่อน 15 นาที"
    },
    {
        type: "upcoming",
        date: "30 เมษายน 2026",
        dept: "กุมารเวชกรรม",
        doctor: "พญ.มินตรา จันทร์ทรา",
        reason: "ตรวจเด็ก",
        prepare: "นำสมุดวัคซีนมาด้วย"
    }
];

const container = document.getElementById("appointmentsList");

// 🔥 render
function renderAppointments(type = "today") {
    const filtered = appointments.filter(a => a.type === type);

    container.innerHTML = filtered.map(a => `
        <div class="appointment-card">
            <div class="card-header">
                <i class="fa-regular fa-calendar-check"></i> ${a.date}
            </div>

            <div class="card-details">
                <div class="detail-row">
                    <span class="badge-label">แผนก</span>
                    <span class="detail-text">${a.dept}</span>
                </div>

                <div class="detail-row">
                    <span class="badge-label">แพทย์</span>
                    <span class="detail-text">${a.doctor}</span>
                </div>

                <div class="detail-row">
                    <span class="badge-label">นัดมาเพื่อ</span>
                    <span class="detail-text">${a.reason}</span>
                </div>

                <div class="detail-row">
                    <span class="badge-label">การเตรียมตัว</span>
                    <span class="detail-text">${a.prepare}</span>
                </div>
            </div>

            <div class="card-actions">
                <button class="btn-reschedule">เลื่อนนัด</button>
                <button class="btn-cancel" onclick="cancelAppointment('${a.doctor}')">
                    ยกเลิกนัด
                </button>
            </div>
        </div>
    `).join('');
}

// 🔥 tab switch
function switchTab(element, type) {
    document.querySelectorAll('.tab-item')
        .forEach(tab => tab.classList.remove('active'));

    element.classList.add('active');

    renderAppointments(type);
}

// 🔥 cancel (ลบจริง)
function cancelAppointment(doctorName) {
    if (confirm("ต้องการยกเลิกนัดใช่หรือไม่?")) {
        const index = appointments.findIndex(a => a.doctor === doctorName);
        if (index !== -1) {
            appointments.splice(index, 1);
        }

        const activeTab = document.querySelector('.tab-item.active');
        renderAppointments(activeTab.textContent.includes("วันนี้") ? "today" : "upcoming");
    }
}

// โหลดครั้งแรก
document.addEventListener("DOMContentLoaded", () => {
    renderAppointments("today");
});

let doctorToDelete = null; // เก็บชื่อแพทย์ที่จะลบชั่วคราว

// 1. ฟังก์ชันเปิด Modal
function cancelAppointment(doctorName) {
    doctorToDelete = doctorName; // ฝากชื่อไว้
    document.getElementById("cancelModal").style.display = "flex";
}

// 2. ฟังก์ชันปิด Modal
function closeCancelModal() {
    document.getElementById("cancelModal").style.display = "none";
    doctorToDelete = null;
}

// 3. ฟังก์ชันกดยืนยันลบจริง
document.getElementById("confirmCancelBtn").addEventListener("click", () => {
    if (doctorToDelete) {
        const index = appointments.findIndex(a => a.doctor === doctorToDelete);
        if (index !== -1) {
            appointments.splice(index, 1);
        }
        
        // ปิดหน้าต่าง
        closeCancelModal();
        
        // Refresh รายการ
        const activeTab = document.querySelector('.tab-item.active');
        const type = activeTab.innerText.includes("วันนี้") ? "today" : "upcoming";
        renderAppointments(type);
        
        // (Optional) แสดง alert สั้นๆ ว่าลบแล้ว
        // alert("ยกเลิกการนัดหมายเรียบร้อยแล้ว");
    }
});

// คลิกข้างนอก Modal ให้ปิดได้ (UX ที่ดี)
window.onclick = function(event) {
    const modal = document.getElementById("cancelModal");
    if (event.target == modal) {
        closeCancelModal();
    }
}