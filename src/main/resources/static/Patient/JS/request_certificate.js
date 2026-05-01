document.addEventListener('DOMContentLoaded', async () => {
    const certForm = document.getElementById('certificateForm');
    const visitDateSelect = document.getElementById('visitDateSelect');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const patientId = currentUser?.patientId;

    if (!patientId) {
        alert('กรุณาเข้าสู่ระบบก่อน');
        window.location.href = '../../login.html';
        return;
    }

    // โหลดประวัติการรักษา
    let records = [];
    try {
        const res = await fetch('http://localhost:8080/api/medical-records?patientId=' + patientId);
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
    }

    if (certForm) {
        certForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const selectedRecordId = visitDateSelect.value;
            if (!selectedRecordId) {
                alert('กรุณาเลือกวันที่เคยเข้ารับการตรวจ');
                return;
            }

            // ดึง doctorId จาก record ที่เลือก
            const selectedRecord = records.find(r => r.recordId == selectedRecordId);
            const doctorId = selectedRecord?.doctorId;

            if (!doctorId) {
                alert('ไม่พบข้อมูลแพทย์จากประวัตินี้');
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

                alert('ระบบได้ส่งคำขอใบรับรองแพทย์เรียบร้อยแล้ว');
                window.location.href = 'home.html';

            } catch (err) {
                console.error(err);
                alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
            }
        });
    }
});