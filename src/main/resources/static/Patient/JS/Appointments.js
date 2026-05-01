// =======================
// 📌 INIT LOCALSTORAGE
// =======================
function initAppointments() {
    const data = localStorage.getItem("appointments");
    if (!data) {
        localStorage.setItem("appointments", JSON.stringify([]));
        return;
    }
    try {
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) {
            localStorage.setItem("appointments", JSON.stringify([]));
        }
    } catch (e) {
        localStorage.setItem("appointments", JSON.stringify([]));
    }
}

// =======================
// 📌 STATE
// =======================
const API = "http://localhost:8080/api";
const container = document.getElementById("appointmentsList");

let deleteId    = null;
let editId      = null;
let currentType = "today";

// =======================
// 📌 LOAD DATA
// =======================
async function loadAppointments() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user || !user.patientId) {
        console.error("No patientId found in currentUser");
        return [];
    }

    try {
        const res = await fetch(`${API}/appointments/patients/${user.patientId}`);
        if (!res.ok) {
            console.error("API ERROR:", res.status);
            return [];
        }

        const data = await res.json();
        if (!Array.isArray(data)) return [];

        return data.map(transform);

    } catch (err) {
        console.error("โหลดไม่สำเร็จ", err);
        return [];
    }
}

// =======================
// 📌 SWITCH TAB
// =======================
function switchTab(btn, type) {
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderAppointments(type);
}

// =======================
// 📌 RENDER
// =======================
async function renderAppointments(type = "today") {
    currentType = type;

    const data = await loadAppointments();

    const filtered = data.filter(a =>
        a.type === type && a.status !== "CANCELLED"
    );

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
                        ${a.status === "pending"
        ? "⏳ รอยืนยัน"
        : a.status === "CANCELLED"
            ? "❌ ยกเลิกแล้ว"
            : "✅ ยืนยันแล้ว"}
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
                <button class="btn-reschedule" onclick="openReschedule(${a.id})">เลื่อนนัด</button>
                <button class="btn-cancel"     onclick="openCancelModal(${a.id})">ยกเลิกนัด</button>
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

async function confirmCancel() {
    // ✅ PUT /api/appointments/{id}/cancel
    await fetch(`${API}/appointments/${deleteId}/cancel`, {
        method: "PUT"
    });
    closeCancelModal();
    renderAppointments(currentType);
}

function closeCancelModal() {
    document.getElementById("cancelModal").style.display = "none";
}

// =======================
// 🔵 RESCHEDULE
// =======================
async function openReschedule(id) {
    editId = id;

    const data = await loadAppointments();
    const item = data.find(a => a.id === id);

    if (!item) {
        console.error("หา appointment ไม่เจอ id:", id);
        return;
    }

    document.getElementById("editDate").value    = item.rawDate || "";
    document.getElementById("editDept").value    = item.dept;
    document.getElementById("editDoctor").value  = item.doctor;
    document.getElementById("editReason").value  = item.reason;
    document.getElementById("editPrepare").value = item.prepare;

    // ✅ ใช้ id "rescheduleModal" ตามที่ HTML กำหนด
    document.getElementById("rescheduleModal").style.display = "flex";
}

// =======================
// 💾 SAVE RESCHEDULE
// =======================
async function saveReschedule() {
    const newDate = document.getElementById("editDate").value;   // yyyy-MM-dd
    const reason  = document.getElementById("editReason").value;
    const prepare = document.getElementById("editPrepare").value;

    // ✅ PUT /api/appointments/{id}/reschedule
    const res = await fetch(`${API}/appointments/${editId}/reschedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            appointmentDate: newDate,
            reason:          reason,
            preparation:     prepare
        })
    });

    if (!res.ok) {
        console.error("Reschedule failed:", res.status);
        return;
    }

    closeRescheduleModal();
    document.getElementById("successEditModal").style.display = "flex";
}

// =======================
// ❌ MODAL HELPERS
// =======================
function openModal(id) {
    document.getElementById(id).style.display = "flex";
}
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}
function closeSuccessModal() {
    document.getElementById("successEditModal").style.display = "none";
}
function closeRescheduleModal() {
    // ✅ ใช้ id "rescheduleModal" ตามที่ HTML กำหนด
    document.getElementById("rescheduleModal").style.display = "none";
}

// =======================
// 🚀 INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {
    initAppointments();
    renderAppointments("today");
    document.getElementById("confirmCancelBtn")
        .addEventListener("click", confirmCancel);
});

// =======================
// 📌 TRANSFORM
// =======================
function transform(a) {
    // ✅ Java LocalDate อาจส่งมาเป็น array [y,m,d] หรือ string "yyyy-MM-dd"
    const rawDate = parseLocalDate(a.appointmentDate);

    return {
        id:      a.appointmentId,
        date:    formatDate(rawDate),
        rawDate: rawDate,
        status:  mapStatus(a.status),
        dept:    a.department  || "-",
        doctor:  a.doctorName  || "-",
        reason:  a.reason      || "-",
        prepare: a.preparation || "-",
        type:    getType(rawDate)
    };
}

// ✅ รองรับทั้ง [2025,5,2] และ "2025-05-02"
function parseLocalDate(val) {
    if (!val) return null;

    if (Array.isArray(val) && val.length >= 3) {
        const [y, m, d] = val;
        return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }

    if (typeof val === "string") return val.substring(0, 10);

    return null;
}

function formatDate(dateStr) {
    if (!dateStr) return "-";
    try {
        const [y, m, d] = dateStr.split("-").map(Number);
        return new Date(y, m - 1, d).toLocaleDateString("th-TH", {
            year:  "numeric",
            month: "long",
            day:   "numeric"
        });
    } catch (e) {
        return dateStr;
    }
}

function mapStatus(status) {
    if (status === "WAITING")   return "pending";
    if (status === "POSTPONED") return "pending";
    if (status === "CANCELLED") return "CANCELLED";
    return "confirmed";
}

function getType(dateStr) {
    if (!dateStr) return "upcoming";
    const today = new Date();
    const [y, m, d] = dateStr.split("-").map(Number);
    return (
        y === today.getFullYear() &&
        m === today.getMonth() + 1 &&
        d === today.getDate()
    ) ? "today" : "upcoming";
}

// =======================
// 📌 QUEUE
// =======================
function goToQueue() {
    closeSuccessModal();
    renderAppointments(currentType);
}