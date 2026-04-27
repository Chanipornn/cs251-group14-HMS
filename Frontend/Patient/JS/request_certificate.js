const mockDatabase = {
    "2024-05-10": {
        patients: [
            {
                id: "P001",
                name: "นายสมชาย ใจดี",
                date: "10 พฤษภาคม 2567",
                doctor: "นพ.ธีปรกร รักแฟ้น",
                diagnosis: "ไข้หวัดธรรมดา (Common Cold)",
                treatment: "จ่ายยาพาราเซตามอล และให้พักผ่อน"
            }
        ],
        certRequest: null // ไว้สำหรับเก็บข้อมูลเมื่อมีการส่งฟอร์ม
    },
    "2024-05-15": {
        patients: [
            {
                id: "P001",
                name: "นายสมชาย ใจดี",
                date: "15 พฤษภาคม 2567",
                doctor: "นพ.ธนวัฒน์ กุลพันธ์",
                diagnosis: "ปวดกล้ามเนื้อ (Muscle Strain)",
                treatment: "ทำกายภาพบำบัดเบื้องต้น"
            }
        ],
        certRequest: null
    },
    "2024-05-20": {
        patients: [
            {
                id: "P001",
                name: "นายสมชาย ใจดี",
                date: "20 พฤษภาคม 2567",
                doctor: "พญ.อชิรญา ขำปลอดภัย",
                diagnosis: "ภูมิแพ้อากาศ (Allergic Rhinitis)",
                treatment: "จ่ายยาแก้แพ้"
            }
        ],
        certRequest: null
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const certForm = document.getElementById('certificateForm');
    const dateSelect = document.getElementById('visitDateSelect');

    // 1. ดึงวันที่ที่มีประวัติการรักษามาใส่ในตัวเลือก (Dropdown)
    if (dateSelect) {
        Object.keys(mockDatabase).forEach(dateKey => {
            const option = document.createElement('option');
            option.value = dateKey;
            option.textContent = `${mockDatabase[dateKey].patients[0].date} - ตรวจทั่วไป`;
            dateSelect.appendChild(option);
        });


    }

    // 2. จัดการเมื่อกดยืนยันส่งฟอร์ม
    if (certForm) {
        certForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const selectedDateKey = document.getElementById('visitDateSelect').value;
            const patientData = mockDatabase[selectedDateKey].patients[0];

            const requestData = {
                visitDate: document.getElementById('visitDateSelect').value,
                reason: document.getElementById('requestReason').value,
                detail: document.getElementById('additionalDetail').value,
                status: 'pending', // สถานะเริ่มต้นคือรอดำเนินการ 
                requestDate: new Date().toLocaleDateString('th-TH')
            };

            // 3. จำลองการส่งข้อมูลไปที่ฐานข้อมูล (บันทึกลง mockDatabase)
            // ในที่นี้เราจะเพิ่มฟิลด์ certRequest เข้าไปในประวัติวันนั้นๆ
            if (mockDatabase[requestData.visitDate]) {
                mockDatabase[requestData.visitDate].certRequest = requestData;
            }

            showSuccessModal(patientData.date);

        });
    }
    // ฟังก์ชันสร้างและแสดง Modal
    function showSuccessModal(displayDate) {
        // สร้างโครงสร้าง Modal
        const modalHtml = `
            <div id="customModal" class="modal-overlay">
                <div class="modal-content">
                    <div class="icon-circle-success">
                        <i class="fas fa-check"></i>
                    </div>
                    <h2 class="modal-title">ส่งคำขอเรียบร้อยแล้ว!</h2>
                    <p class="modal-text">ระบบได้ส่งคำขอใบรับรองแพทย์</p>
                    <p class="modal-subtext">ประจำวันที่ <strong>${displayDate}</strong> เรียบร้อยแล้ว</p>
                    <button onclick="closeModalAndRedirect()" class="btn-modal-confirm">ตกลง</button>
                </div>
            </div>
        `;
        
        // แทรกเข้าไปใน Body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    window.closeModalAndRedirect = function() {
        const modal = document.getElementById('customModal');
        if (modal) modal.remove();
        window.location.href = "home.html";
    }
});