document.addEventListener('DOMContentLoaded', async () => {
    const certForm = document.getElementById('certificateForm');
    const visitDateSelect = document.getElementById('visitDateSelect');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const patientId = currentUser?.patientId;

    // ❌ ไม่ login
    if (!patientId) {
        showPopup("error", "กรุณาเข้าสู่ระบบก่อน", () => {
            window.location.href = '../../login.html';
        });
        return;
    }

    // โหลดประวัติการรักษา
    let records = [];
    try {
        const res = await fetch('http://localhost:8080/api/medical-records?patientId=' + patientId);
        if (!res.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ');

        records = await res.json();

        visitDateSelect.innerHTML = '<option value="">เลือกวันที่เคยเข้ารับการตรวจ</option>';

        records.forEach(record => {
            const option = document.createElement('option');
            option.value = record.recordId;
            option.textContent = record.visitDate + ' — ' + (record.diagnosis || 'ตรวจทั่วไป');
            visitDateSelect.appendChild(option);
        });

    } catch (err) {
        console.error(err);
        visitDateSelect.innerHTML = '<option value="">โหลดประวัติไม่ได้</option>';
        showPopup("error", "โหลดประวัติการรักษาไม่สำเร็จ");
    }

    // submit form
    if (certForm) {
        certForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const selectedRecordId = visitDateSelect.value;

            if (!selectedRecordId) {
                showPopup("error", "กรุณาเลือกวันที่เคยเข้ารับการตรวจ");
                return;
            }

            // หา record
            const selectedRecord = records.find(r => r.recordId == selectedRecordId);
            const doctorId = selectedRecord?.doctorId;

            if (!doctorId) {
                showPopup("error", "ไม่พบข้อมูลแพทย์จากประวัตินี้");
                return;
            }

            const reason = document.getElementById('requestReason').value;
            const detail = document.getElementById('additionalDetail').value;
            const description = detail ? reason + ' - ' + detail : reason;

            try {
                const res = await fetch('http://localhost:8080/api/certificates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        patient: { patientId: patientId },
                        doctor: { doctorId: doctorId },
                        description: description
                    })
                });

                if (!res.ok) throw new Error('Request failed');

                // ✅ success
                showPopup("success", "ระบบได้ส่งคำขอใบรับรองแพทย์เรียบร้อยแล้ว", () => {
                    window.location.href = 'home.html';
                });

            } catch (err) {
                console.error(err);
                showPopup("error", "เกิดข้อผิดพลาด กรุณาลองใหม่");
            }
        });
    }
});


/* =========================
   POPUP UI
========================= */

function showPopup(type, message, callback = null) {
    const popup = document.getElementById("popup");
    const icon = popup.querySelector(".popup-icon");
    const text = document.getElementById("popupMessage");

    popup.style.display = "flex";
    text.innerText = message;

    icon.className = "popup-icon " + (type === "success" ? "success" : "error");
    icon.innerHTML = type === "success"
        ? '<i class="fa-solid fa-check"></i>'
        : '<i class="fa-solid fa-xmark"></i>';

    // เก็บ callback ไว้ใช้ตอนกดปิด
    popup.dataset.callback = callback ? "true" : "false";
    popup._callback = callback;
}

function closePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none";

    if (popup.dataset.callback === "true" && typeof popup._callback === "function") {
        popup._callback();
    }
}