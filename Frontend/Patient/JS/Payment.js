const paymentData = [
    { id: 1, date: "11/04/2026 09:46:15", dept: "หู คอ จมูก", doctor: "นพ.สมชาย ศรีสุข", service: "ตรวจทั่วไป", amount: "500 บาท", status: "ค้างชำระ", statusType: "unpaid", active: true },
    { id: 2, date: "11/04/2026 10:30:00", dept: "ศัลยกรรม", doctor: "นพ.วราภรณ์ ศิริชัย", service: "ตรวจแผล", amount: "300 บาท", status: "ชำระแล้ว", statusType: "paid", active: false },
    { id: 3, date: "11/04/2026 11:15:20", dept: "อายุรกรรม", doctor: "นพ.อัครพล ศรีนวล", service: "ปรึกษาทั่วไป", amount: "500 บาท", status: "ค้างชำระ", statusType: "unpaid", active: false },
    { id: 4, date: "11/04/2026 13:00:45", dept: "จักษุ", doctor: "นพ.สมปอง สองสิบ", service: "วัดสายตา", amount: "450 บาท", status: "ชำระแล้ว", statusType: "paid", active: false }
];

function renderPayments() {
    const grid = document.getElementById('payment-list');
    grid.innerHTML = paymentData.map(item => `
        <div class="payment-card ${item.active ? 'active' : ''}">
            <div class="card-body">
                <div class="info-row" style="font-weight: 600; font-size: 1rem; margin-bottom: 15px;">
                    ${item.date}
                </div>
                <div class="info-row">
                    <span class="label">แผนก</span>
                    <span class="value">${item.dept}</span>
                </div>
                <div class="info-row">
                    <span class="label">แพทย์</span>
                    <span class="value">${item.doctor}</span>
                </div>
                <div class="info-row">
                    <span class="label">รายการ</span>
                    <span class="value">${item.service}</span>
                </div>
                <div class="info-row">
                    <span class="label">ยอดชำระ</span>
                    <span class="value" style="color: var(--primary-color); font-size: 1.1rem;">${item.amount}</span>
                </div>
                <div class="status-badge">
                    <div class="dot ${item.statusType}"></div>
                    <span class="${item.statusType}">${item.status}</span>
                </div>
            </div>
            <div class="action-area">
                <button class="btn ${item.statusType === 'unpaid' ? 'btn-pay' : 'btn-detail'}">
                    ${item.statusType === 'unpaid' ? 'ชำระเงิน' : 'ดูรายละเอียด'}
                </button>
            </div>
        </div>
    `).join('');
}

window.onload = renderPayments;