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

            console.log("ส่งคำขอไปฝั่งแพทย์เรียบร้อย:", requestData);
            
            alert("ระบบได้ส่งคำขอใบรับรองแพทย์ไปยังแพทย์ผู้ตรวจเรียบร้อยแล้ว");
            window.location.href ="home.html";
        });
    }
});