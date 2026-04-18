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

function cancelQueue(index) {
    if (confirm("ต้องการยกเลิกคิวใช่หรือไม่?")) {
        queues.splice(index, 1); // ลบข้อมูล
        renderQueues(); // render ใหม่
    }
}

renderQueues();