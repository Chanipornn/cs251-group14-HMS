
// =======================
// 📌 INITIAL DATA (ตัวอย่าง)
// =======================
/*
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
*/

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
const API = "http://localhost:8080/api";
const container = document.getElementById("appointmentsList");

let deleteId = null;
let editId = null;
let currentType = "today";

// =======================
// 📌 LOAD DATA
// =======================
async function loadAppointments() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user || !user.patientId) {
        console.error("No patientId");
        return [];
    }

       try {
        const res = await fetch(`${API}/appointments/patients/${user.patientId}`);

        if (!res.ok) {
            console.error("API ERROR");
            return [];
        }

        const data = await res.json();

        if (!Array.isArray(data)) return [];

        return data.map(transform);

    } catch (err) {
        console.error("โหลดไม่สำเร็จ", err);
        return [];
    }
/*
    const patientId = user.patientId;

    const res = await fetch(`${API}/appointments/patient/${patientId}`);
    const data = await res.json();

    console.log("APPOINTMENTS:", data);

    return data.map(transform);
    */
}


// =======================
// 📌 SWITCH TAB
// =======================
function switchTab(btn, type) {
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
    if (btn) btn.classList.add('active');

    //currentType = type;
    renderAppointments(type);
}

// =======================
// 📌 RENDER
// =======================
async function renderAppointments(type = "today") {
    currentType = type;
/*
    const all = await loadAppointments();
    const filtered = all.filter(a => 
        a.type === type && a.status !== "CANCELLED"
    );
    */
   const data = await loadAppointments();

    const filtered = data.filter(a =>
        a.type === type && a.status !== "CANCELLED"
    );

    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center; 
        color:#999; margin-top:50px;">ไม่พบรายการนัดหมาย</p>`;
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

async function confirmCancel() {
    const API = "http://localhost:8080/api";

    await fetch(`${API}/appointments/patients/${deleteId}/cancel`, {
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

    const data = await loadAppointments(); // 🔥 ต้อง await
    const item = data.find(a => a.id == id);

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
function convertToISO(dateStr) {
    const [d, m, y] = dateStr.split("-");
    return `${y}-${m}-${d}`;
}
async function saveReschedule() {
    let newDate = document.getElementById("editDate").value;

    // input type="date" → ได้ yyyy-MM-dd อยู่แล้ว ✅
    // ถ้าไม่ใช่ค่อย convert

    const reason = document.getElementById("editReason").value;
    const prepare = document.getElementById("editPrepare").value;

    console.log("SEND DATE:", newDate); // debug

    await fetch(`${API}/appointments/patients/${editId}/reschedule`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            appointmentDate: newDate,
            reason: reason,
            preparation: prepare
        })
    });

    closeRescheduleModal();
    document.getElementById("successEditModal").style.display = "flex";
}
/*
async function saveReschedule() {
    const API = "http://localhost:8080/api";
    const user = JSON.parse(localStorage.getItem("currentUser"));

    let newDate = document.getElementById("editDate").value;
    //newDate = convertToISO(newDate);

    const date = document.getElementById("editDate").value;
    const reason = document.getElementById("editReason").value;
    const prepare = document.getElementById("editPrepare").value;

    console.log("SEND DATE:", newDate);

    await fetch(`${API}/appointments/patients/${editId}/reschedule`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
    },
        body: JSON.stringify({
            appointmentDate: newDate,
            /*appointmentDate: date,
            patientId: user.patientId,
            doctorId: doctor.doctorId,
            date: date,
            time: time,
            reason: reason,
            preparation: prepare*/
     /*       //appointmentDate: date,
            reason: reason,
            preparation: prepare
            
        })
    });*/
/*
    closeRescheduleModal();
    //renderAppointments(currentType);

    document.getElementById("successEditModal").style.display = "flex";
}
*/

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
    
    initAppointments(); 
    renderAppointments("today");

    document.getElementById("confirmCancelBtn")
        .addEventListener("click", confirmCancel);
});


// =======================
//     Transform
// =======================
function transform(a) {
    return {
        id: a.appointmentId,
        date: a.appointmentDate,
        status: mapStatus(a.status),
        //dept: "ทั่วไป",
         dept: a.department || "-",
        doctor: a.doctorName || "-",      
        reason: a.reason || "-",          
        prepare: a.preparation || "-",    
        type: getType(a.appointmentDate)
    };
}

function mapStatus(status) {
    if (status === "WAITING") return "pending";
    if (status === "POSTPONED") return "pending";
    if (status === "CANCELLED") return "CANCELLED";
    return "confirmed";
}

/*
function getType(dateStr) {
    const today = new Date().toISOString().split("T")[0];

    // แปลง dd-MM-yyyy → yyyy-MM-dd
    const parts = dateStr.split("-");
    const formatted = `${parts[2]}-${parts[1]}-${parts[0]}`;

    return formatted === today ? "today" : "upcoming";
}
*/
function getType(dateStr) {
    const today = new Date().toISOString().split("T")[0];

    // แปลงเป็น Date object เทียบตรง ๆ
    const d1 = new Date(dateStr);
    const d2 = new Date(today);

    return d1.toDateString() === d2.toDateString() 
        ? "today" 
        : "upcoming";
}

// =======================
//     Queue
// =======================
function goToQueue() {
    closeSuccessModal();
    renderAppointments(currentType);
}