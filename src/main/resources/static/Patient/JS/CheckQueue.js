document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector(".queue-content");

    if (!container) return;

    // ==========================
    // DATA (FIXED)
    // ==========================
    /*
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
*/


// ==========================
// Load QUEUE
// ==========================
async function loadQueues() {
    const container = document.querySelector(".queue-content");
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user || !user.patientId) {
        container.innerHTML = "ไม่พบผู้ใช้";
        return;
    }

    try {
        const res = await fetch(`http://localhost:8080/api/appointments/patients/${user.patientId}`);
        const data = await res.json();

        console.log("API DATA:", data);

        if (!data || data.length === 0) {
            container.innerHTML = `<p style="text-align:center;">ไม่มีคิว</p>`;
            return;
        }

        data.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
        renderQueues(data);
        /*
        // 👉 เอาคิวล่าสุด
        const latest = data[data.length - 1];

        renderQueue(latest);
        */

    } catch (err) {
        console.error(err);
        container.innerHTML = "โหลดข้อมูลไม่สำเร็จ";
    }

}


    // ==========================
    // SAVE
    // ==========================
    function saveData() {
        localStorage.setItem("queues", JSON.stringify(queues));
    }


    // ==========================
    // STATUS
    // ==========================
    function getStatusHTML(status) {
    if (status === "WAITING") {
        return `<div class="status-waiting">⏳ รอการยืนยัน</div>`;
    }
    if (status === "COMPLETED") {
        return `<div class="status-success"><i class="fa-solid fa-circle-check"></i> เสร็จสิ้น</div>`;
    }
    if (status === "CANCELLED") {
        return `<div class="status-cancel">❌ ยกเลิก</div>`;
    }
    if (status === "POSTPONED") {
        return `<div class="status-postpone">📅 เลื่อนนัด</div>`;
    }
    return `<div class="status-unknown">-</div>`;
}

    // ==========================
    // RENDER
    // ==========================
function renderQueues(list) {
    const container = document.querySelector(".queue-content");

    container.innerHTML = list.map(q => `
        <div class="queue-card">

            ${getStatusHTML(q.status)}

            <div class="queue-number">
                Queue No. A-${q.queueNumber}
            </div>

            <div class="info-row">
                <span class="label">แผนก</span>
                <span class="value">${q.department || "-"}</span>
            </div>

            <div class="info-row">
                <span class="label">แพทย์</span>
                <span class="value">${q.doctorName || "-"}</span>
            </div>

            <div class="info-row">
                <span class="label">นัดมาเพื่อ</span>
                <span class="value">${q.reason || "-"}</span>
            </div>

            <div class="date-time-box">
                <i class="fa-regular fa-calendar"></i>
                ${q.appointmentDate} ${q.appointmentTime}
            </div>

        </div>
    `).join("");
}

//อันเก่า
/*
function renderQueue(q) {
    const container = document.querySelector(".queue-content");

    container.innerHTML = `
        <div class="queue-card">

            <div class="status-success">
                <i class="fa-solid fa-circle-check"></i> จองสำเร็จ
            </div>

            <div class="queue-number">
                Queue No. A-${q.queueNumber}
            </div>

            <div class="info-row">
                <span class="label">แผนก</span>
                <span class="value">${q.department || "-"}</span>
            </div>

            <div class="info-row">
                <span class="label">แพทย์</span>
                <span class="value">${q.doctorName || "-"}</span>
            </div>

            <div class="info-row">
                <span class="label">นัดมาเพื่อ</span>
                <span class="value">${q.reason || "-"}</span>
            </div>

            <div class="date-time-box">
                <i class="fa-regular fa-calendar"></i>
                ${q.appointmentDate} ${q.appointmentTime}
            </div>

        </div>
    `;
}
    */

    /*
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
*/

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
    //renderQueues();
    loadQueues();

});