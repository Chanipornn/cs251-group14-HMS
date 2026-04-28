
// =======================
// 📌 INITIAL DATA (ตัวอย่าง)
// =======================
const baseAppointments = [
    {
        id: "1",
        type: "today",
        date: "วันนี้",
        dept: "ตา หู จมูก",
        doctor: "นพ.สมชาย ศรีสุข",
        reason: "ตรวจทั่วไป",
        prepare: "เสียบบัตรประชาชนที่ตู้ออกรหัสรับคิว",
        status: "confirmed"
    },
    {
        id: "2",
        type: "today",
        date: "วันนี้",
        dept: "อายุรกรรม",
        doctor: "นพ.พงศกร แก้วดี",
        reason: "ตรวจสุขภาพ",
        prepare: "งดอาหาร 8 ชั่วโมง",
        status: "confirmed"
    }
];

// =======================
// 📌 INIT LOCALSTORAGE (ชัวร์ 100%)
// =======================
function initAppointments() {
    const data = localStorage.getItem("appointments");

    if (!data) {
        localStorage.setItem("appointments", JSON.stringify(baseAppointments));
        return;
    }

    try {
        const parsed = JSON.parse(data);

        if (!Array.isArray(parsed) || parsed.length === 0) {
            localStorage.setItem("appointments", JSON.stringify(baseAppointments));
        }
    } catch (e) {
        localStorage.setItem("appointments", JSON.stringify(baseAppointments));
    }
}

// =======================
// 📌 STATE
// =======================
const container = document.getElementById("appointmentsList");

let deleteId = null;
let editId = null;
let currentType = "today";

// =======================
// 📌 LOAD DATA
// =======================
function loadAppointments() {
    return JSON.parse(localStorage.getItem("appointments")) || [];
}

// =======================
// 📌 SWITCH TAB
// =======================
function switchTab(btn, type) {
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
    if (btn) btn.classList.add('active');

    currentType = type;
    renderAppointments(type);
}

// =======================
// 📌 RENDER
// =======================
function renderAppointments(type = "today") {
    currentType = type;

    const all = loadAppointments();
    const filtered = all.filter(a => a.type === type);

    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#999; margin-top:50px;">ไม่พบรายการนัดหมาย</p>`;
        return;
    }

    container.innerHTML = filtered.map(a => `
        <div class="appointment-card">
            <div class="card-header">
                <i class="fa-regular fa-calendar-check"></i> ${a.date}
            </div>

            <div class="card-details">
                <div class="detail-row">
                    <span class="badge-label">สถานะ</span>
                    <span class="detail-text">
                        ${a.status === "pending" ? "⏳ รอยืนยัน" : "✅ ยืนยันแล้ว"}
                    </span>
                </div>

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
                <button class="btn-reschedule" onclick="openReschedule('${a.id}')">เลื่อนนัด</button>
                <button class="btn-cancel" onclick="openCancelModal('${a.id}')">ยกเลิกนัด</button>
            </div>
        </div>
    `).join("");
}

// =======================
// 🔴 CANCEL
// =======================
function openCancelModal(id) {
    deleteId = id;
    document.getElementById("cancelModal").style.display = "flex";
}

function confirmCancel() {
    let data = loadAppointments();

    data = data.filter(item => item.id !== deleteId);

    localStorage.setItem("appointments", JSON.stringify(data));

    closeCancelModal();
    renderAppointments(currentType);
}

function closeCancelModal() {
    document.getElementById("cancelModal").style.display = "none";
}

// =======================
// 🔵 RESCHEDULE
// =======================
function openReschedule(id) {
    editId = id;

    const data = loadAppointments();
    const item = data.find(a => a.id === id);

    document.getElementById("editDate").value = item.date;
    document.getElementById("editDept").value = item.dept;
    document.getElementById("editDoctor").value = item.doctor;
    document.getElementById("editReason").value = item.reason;
    document.getElementById("editPrepare").value = item.prepare;

    document.getElementById("rescheduleModal").style.display = "flex";
}

// =======================
// 💾 SAVE RESCHEDULE
// =======================
function saveReschedule() {
    let data = loadAppointments();

    const newDate = document.getElementById("editDate").value;
    const newType = (newDate === "วันนี้") ? "today" : "upcoming";
    const newStatus = (newType === "upcoming") ? "pending" : "confirmed";

    const index = data.findIndex(a => a.id === editId);

    if (index !== -1) {
        data[index] = {
            ...data[index],
            date: newDate,
            type: newType,
            dept: document.getElementById("editDept").value,
            doctor: document.getElementById("editDoctor").value,
            reason: document.getElementById("editReason").value,
            prepare: document.getElementById("editPrepare").value,
            status: newStatus   // 🔥 สำคัญ
        };
    }

    localStorage.setItem("appointments", JSON.stringify(data));

    closeRescheduleModal();
    renderAppointments(currentType);

    document.getElementById("successEditModal").style.display = "flex";

    setTimeout(() => {
        closeSuccessModal();
    }, 2000);
}

function openModal(id) {
    document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}



//ปิดหน้าต่าง popup
function closeSuccessModal() {
    document.getElementById("successEditModal").style.display = "none";
}

// =======================
// ❌ MODAL CLOSE
// =======================
function closeRescheduleModal() {
    document.getElementById("rescheduleModal").style.display = "none";
}

// =======================
// 🚀 INIT SYSTEM
// =======================
document.addEventListener("DOMContentLoaded", () => {
    initAppointments(); // 🔥 สำคัญที่สุด
    renderAppointments("today");

    document.getElementById("confirmCancelBtn")
        .addEventListener("click", confirmCancel);
});