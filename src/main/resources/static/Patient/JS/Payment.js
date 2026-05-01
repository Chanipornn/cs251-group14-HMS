document.addEventListener('DOMContentLoaded', () => {

    // ==========================
    // BACK BUTTON (ไป home ตรง)
    // ==========================
    window.handleBack = function (e) {
        e.preventDefault();
        window.location.href = "home.html";
    };

    // ==========================
    // โหลดสถานะจาก localStorage
    // ==========================
    const isPaid = localStorage.getItem('payment_status_bill_001');
    const firstCard = document.querySelector('.payment-card');

    if (isPaid === 'paid' && firstCard) {
        updateCardToPaid(firstCard);
    }

    // ==========================
    // 💳 ปุ่มชำระเงิน
    // ==========================
    const payBtn = document.getElementById("btn-pay-now");

    if (payBtn) {
        payBtn.addEventListener("click", function () {

            localStorage.setItem('payment_status_bill_001', 'paid');

            if (firstCard) {
                updateCardToPaid(firstCard);
            }

            openPaymentModal(); // ✅ popup
        });
    }

});

// ==========================
// อัปเดตการ์ด
// ==========================
function updateCardToPaid(card) {

    const statusBadge = card.querySelector('.status-badge');

    statusBadge.classList.remove('unpaid');
    statusBadge.classList.add('paid');
    statusBadge.querySelector('.status-text').innerText = 'สถานะ: ชำระแล้ว';

    const actionArea = card.querySelector('.action-area');

    actionArea.innerHTML = '<button class="btn btn-detail">ดูรายละเอียด</button>';

    actionArea.querySelector('.btn-detail').addEventListener('click', () => {
        window.location.href = 'PaymentDetail.html';
    });
}

// ==========================
// MODAL
// ==========================
function openPaymentModal() {
    document.getElementById("paymentModal").classList.add("active");
}

function closePaymentModal() {
    document.getElementById("paymentModal").classList.remove("active");
}