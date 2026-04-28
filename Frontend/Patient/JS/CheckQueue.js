document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector(".queue-content");

    if (!container) return;

    // ==========================
    // DATA (FIXED)
    // ==========================
    let queues = JSON.parse(localStorage.getItem("queues")) || [
        {
            no: "A-023",
            dept: "หู คอ จมูก",
            doctor: "นพ.สมชาย ศรีสุข",
            reason: "ตรวจทั่วไป",
            date: "11 มี.ค. 2026 10:00 น.",
            status: "confirmed"
        },
        {
            no: "B-104",
            dept: "ศัลยกรรม",
            doctor: "พญ.วราภรณ์ ศิริชัย",
            reason: "ผ่าตัดเล็ก",
            date: "15 มี.ค. 2026 13:30 น.",
            status: "confirmed"
        }
    ];

    // ==========================
    // SAVE
    // ==========================
    function saveData() {
        localStorage.setItem("queues", JSON.stringify(queues));
    }

    // ==========================
    // RENDER
    // ==========================
    function renderQueues() {
        container.innerHTML = queues.length
            ? queues.map((q, index) => `
        <div class="queue-card">
            <div class="status-success ${q.status}">
  <span class="status-text">
    ${q.status === "pending" ? "⏳ รอการยืนยัน" : `<i class="fa-solid fa-circle-check"></i> จองสำเร็จ`}
  </span>
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
                <button class="btn-edit" onclick="openEdit(${index})">แก้ไขนัด</button>
                <button class="btn-cancel-red" onclick="openCancel(${index})">ยกเลิกคิว</button>
            </div>

        </div>
    `).join("")
            : `<p style="text-align:center; color:#999;">ไม่มีคิว</p>`;
    }

    // ==========================
    // CANCEL
    // ==========================
    let deleteIndex = null;

    window.openCancel = (index) => {
        deleteIndex = index;
        document.getElementById("cancelModal").classList.add("active");
    };

    window.closeCancelModal = () => {
        document.getElementById("cancelModal").classList.remove("active");
        deleteIndex = null;
    };

    document.getElementById("confirmCancelBtn")?.addEventListener("click", () => {
        if (deleteIndex !== null) {
            queues.splice(deleteIndex, 1);
            saveData();
            renderQueues();
            closeCancelModal();
        }
    });

    // ==========================
    // EDIT
    // ==========================
    let editIndex = null;

    window.openEdit = (index) => {
        editIndex = index;
        const q = queues[index];

        document.getElementById("editDept").value = q.dept;
        document.getElementById("editDoctor").value = q.doctor;
        document.getElementById("editReason").value = q.reason;
        document.getElementById("editDate").value = q.date;

        document.getElementById("editModal").classList.add("active");
    };

    window.closeEditModal = () => {
        document.getElementById("editModal").classList.remove("active");
        editIndex = null;
    };

    // ==========================
    // SAVE EDIT (FIX STATUS HERE)
    // ==========================
    window.saveEdit = () => {
        if (editIndex === null) return;

        queues[editIndex] = {
            ...queues[editIndex],
            dept: document.getElementById("editDept").value,
            doctor: document.getElementById("editDoctor").value,
            reason: document.getElementById("editReason").value,
            date: document.getElementById("editDate").value,

            // 🔥 FIX: เปลี่ยนเป็นรอการยืนยัน
            status: "pending"
        };

        saveData();
        renderQueues();
        closeEditModal();

        document.getElementById("successEditModal").classList.add("active");

        setTimeout(() => {
            closeSuccessModal();
        }, 2000);
    };

    // ==========================
    // SUCCESS
    // ==========================
    window.closeSuccessModal = () => {
        document.getElementById("successEditModal").classList.remove("active");
    };

    window.goToQueue = () => {
        closeSuccessModal();
    };

    // ==========================
    // INIT
    // ==========================
    renderQueues();

});