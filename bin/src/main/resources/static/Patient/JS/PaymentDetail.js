document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.querySelector('.btn-confirm');
    const cancelBtn = document.querySelector('.btn-cancel');
    const backBtn = document.querySelector('.back-btn');
    const modal = document.getElementById('successModal');

    // ฟังก์ชันกลับหน้าหลัก
    const goBack = () => {
        window.location.href = 'Payment.html';
    };

    // ปุ่มย้อนกลับ และ ปุ่มยกเลิก
    backBtn.addEventListener('click', goBack);
    cancelBtn.addEventListener('click', goBack);

    // ปุ่มยืนยันการชำระเงิน
    confirmBtn.addEventListener('click', () => {
        // 1. แสดง Modal (ใช้สไตล์ inline เพื่อความชัวร์ หรือใช้ class active)
        modal.style.display = 'flex';

        // 2. บันทึกสถานะลง localStorage (กุญแจสำคัญ)
        // เราใช้ Key เดียวกับที่หน้า Payment.html ตรวจสอบ
        localStorage.setItem('payment_status_bill_001', 'paid');

        // 3. หน่วงเวลา 2 วินาทีเพื่อให้ User เห็นเครื่องหมายถูก แล้วค่อยกลับหน้าหลัก
        setTimeout(() => {
            goBack();
        }, 2000);
    });
});