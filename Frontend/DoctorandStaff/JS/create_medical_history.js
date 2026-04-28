/**
 * ฟังก์ชันสำหรับแสดง Modal แจ้งเตือนเมื่อบันทึกสำเร็จ
 */
function showSuccessAddModal(patient_id, dateStr) {
    const oldModal = document.getElementById('successModal');
    if (oldModal) oldModal.remove();

    const modalHtml = `
        <div id="successModal" class="modal-overlay">
            <div class="modal-content">
                <div class="icon-circle-success">
                    <i class="fas fa-check"></i>
                </div>
                <h2 class="modal-title">บันทึกข้อมูลสำเร็จ!</h2>
                <p class="modal-text">เพิ่มประวัติการรักษาของรหัสผู้ป่วย <strong>${patient_id}</strong></p>
                <p class="modal-subtext">ประจำวันที่ ${dateStr} เรียบร้อยแล้ว</p>
                <button onclick="closeModalAndGoBack()" class="btn-modal-confirm">ตกลง</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/**
 * ฟังก์ชันสำหรับปิด Modal และกลับไปยังหน้าหลัก
 */
window.closeModalAndGoBack = function() {
    const modal = document.getElementById('successModal');
    if (modal) modal.remove();
    window.location.href = 'medical_history.html';
};

document.addEventListener('DOMContentLoaded', () => {
    // จัดการ Sidebar Toggle
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const container = document.querySelector('.container');

    if (toggleBtn && sidebar && container) {
        toggleBtn.onclick = () => {
            sidebar.classList.toggle('collapsed');
            container.classList.toggle('full');
        };
    }

    // จัดการฟอร์มบันทึกข้อมูล
    const historyForm = document.getElementById('historyForm');
    if (historyForm) {
        historyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const Patient_ID = document.getElementById('patientId')?.value;
            const Record_Date = document.getElementById('visitDate')?.value;
            
            if (!Patient_ID || !Record_Date) {
                alert("กรุณากรอกรหัสผู้ป่วยและวันที่ให้ครบถ้วน");
                return;
            }

            const dateObj = new Date(Record_Date);
            const displayDate = dateObj.toLocaleDateString('th-TH', {
                day: 'numeric', month: 'long', year: 'numeric'
            });

            // แสดง Popup
            showSuccessAddModal(Patient_ID, displayDate);
        });
    }
});