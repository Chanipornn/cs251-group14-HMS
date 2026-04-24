document.addEventListener('DOMContentLoaded', () => {
    // 1. ตรวจสอบสถานะจาก localStorage
    const isPaid = localStorage.getItem('payment_status_bill_001');

    if (isPaid === 'paid') {
        // ค้นหาการ์ดใบที่ 1 (บิลที่เราจ่าย)
        const firstCard = document.querySelector('.payment-card'); 
        
        if (firstCard) {
            // 2. อัปเดตสถานะ (เปลี่ยนสีจุดและข้อความ)
            const statusBadge = firstCard.querySelector('.status-badge');
            statusBadge.classList.remove('unpaid');
            statusBadge.classList.add('paid');
            statusBadge.querySelector('.status-text').innerText = 'สถานะ: ชำระแล้ว';

            // 3. เปลี่ยนปุ่มจาก "ชำระเงิน" เป็น "ดูรายละเอียด"
            const actionArea = firstCard.querySelector('.action-area');
            actionArea.innerHTML = '<button class="btn btn-detail">ดูรายละเอียด</button>';

            // 4. ผูก Event ให้ปุ่ม "ดูรายละเอียด" ที่สร้างใหม่
            actionArea.querySelector('.btn-detail').addEventListener('click', () => {
                window.location.href = 'PaymentDetail.html';
            });
        }
    }

    // สำหรับปุ่มชำระเงินเดิม (ที่ยังไม่ได้เปลี่ยนเป็น 'ดูรายละเอียด')
    const payBtn = document.querySelector('.btn-pay');
    if (payBtn) {
        payBtn.addEventListener('click', () => {
            window.location.href = 'PaymentDetail.html';
        });
    }
});

// ==========================
// 🔙 BACK BUTTON (กันพลาด)
// ==========================
function handleBack(e) {
    e.preventDefault();

    // ถ้ามีหน้าก่อนหน้า → ย้อน
    if (document.referrer && window.history.length > 1) {
        window.history.back();
    } else {
        // ถ้าไม่มี → ไปหน้า Home
        window.location.href = "home.html";
    }
}


// ==========================
// 💳 ปุ่มชำระเงิน
// ==========================
document.addEventListener("DOMContentLoaded", function () {

    const payBtn = document.getElementById("btn-pay-now");

    if (payBtn) {
        payBtn.addEventListener("click", function () {
            alert("ดำเนินการชำระเงินสำเร็จ ✅");

            // ตัวอย่าง: เปลี่ยนสถานะ UI
            const status = document.querySelector(".status-badge.unpaid");
            if (status) {
                status.classList.remove("unpaid");
                status.classList.add("paid");
                status.querySelector(".status-text").textContent = "สถานะ: ชำระแล้ว";
            }
        });
    }

});