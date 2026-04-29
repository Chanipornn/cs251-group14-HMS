const queues = [
  {
    no: "A-023",
    dept: "หู คอ จมูก",
    doctor: "นพ.สมชาย ศรีสุข",
    reason: "ตรวจทั่วไป",
    date: "11 มี.ค. 2026 10:00 น."
  },
  {
    no: "B-104",
    dept: "ศัลยกรรม",
    doctor: "พญ.วราภรณ์ ศิริชัย",
    reason: "ผ่าตัดเล็ก",
    date: "15 มี.ค. 2026 13:30 น."
  },
  {
    no: "C-221",
    dept: "อายุรกรรม",
    doctor: "นพ.อัครพล ศรีนวล",
    reason: "ตรวจสุขภาพ",
    date: "20 มี.ค. 2026 09:00 น."
  }
];

const container = document.querySelector('.queue-content');

function renderQueues() {
    container.innerHTML = queues.map((q, index) => `
    <div class="queue-card">
        <div class="status-success">
            <i class="fa-solid fa-circle-check"></i> จองสำเร็จ
        </div>

        <div class="queue-number">Queue No. ${q.no}</div>

        <div class="info-row">
            <span class="label">แผนก</span>
            <span class="value">${q.dept}</span>
        </div>

        <div class="info-row">
            <span class="label">แพทย์</span>
            <span class="value">${q.doctor}</span>
        </div>

        <div class="info-row">
            <span class="label">นัดมาเพื่อ</span>
            <span class="value">${q.reason}</span>
        </div>

        <div class="date-time-box">
            <i class="fa-regular fa-calendar"></i> ${q.date}
        </div>

        <div class="card-actions">
            <button class="btn-edit">แก้ไขนัด</button>
            <button class="btn-cancel-red" onclick="cancelQueue(${index})">ยกเลิกคิว</button>
        </div>
    </div>
    `).join('');
}

let queueIndexToDelete = null; // ตัวแปรเก็บ index ที่จะลบ

const modal = document.getElementById("cancelModal");
const confirmBtn = document.getElementById("confirmCancelBtn");

// 1. ฟังก์ชันเรียกเปิด Modal
function cancelQueue(index) {
    queueIndexToDelete = index;
    modal.classList.add("active");
}

// 2. ฟังก์ชันปิด Modal
function closeCancelModal() {
    modal.classList.remove("active");
    queueIndexToDelete = null;
}

// 3. กดยืนยันการลบใน Modal
confirmBtn.addEventListener("click", () => {
    if (queueIndexToDelete !== null) {
        queues.splice(queueIndexToDelete, 1); // ลบข้อมูลจริง
        renderQueues(); // วาดใหม่
        closeCancelModal(); // ปิดหน้าต่าง
    }
});

// คลิกพื้นหลังสีดำเพื่อปิด
window.onclick = function(event) {
    if (event.target == modal) {
        closeCancelModal();
    }
}

renderQueues();