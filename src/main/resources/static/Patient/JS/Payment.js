document.addEventListener('DOMContentLoaded', () => {

    // ==========================
    // BACK BUTTON
    // ==========================
    window.handleBack = function(e) {
        e.preventDefault();
        window.location.href = "home.html";
    };

    // ==========================
    // INIT โหลดข้อมูลเมื่อเปิดหน้า
    // ==========================
    loadInvoices();

});

// ==========================
// 📌 ดึงข้อมูล Invoice ตาม PatientId
// ==========================
async function loadInvoices() {
    const grid = document.getElementById("paymentGrid");

    // 1. เช็คว่ามีคนไข้ล็อคอินอยู่ไหม
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || !user.patientId) {
        grid.innerHTML = "<p style='text-align:center;'>กรุณาล็อคอินก่อนใช้งานระบบชำระเงิน</p>";
        return;
    }

    try {
        // 2. ยิง API ดึงบิลทั้งหมดของคนไข้คนนี้
        const res = await fetch(`/api/invoices/patient/${user.patientId}`);
        if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลใบแจ้งหนี้ได้");

        const invoices = await res.json();

        // 3. นำข้อมูลไปสร้างการ์ด
        renderInvoices(invoices);

    } catch (error) {
        console.error(error);
        grid.innerHTML = "<p style='text-align:center; color:red;'>เกิดข้อผิดพลาดในการดึงข้อมูล</p>";
    }
}

// ==========================
// 📌 สร้าง UI การ์ดบิล
// ==========================
async function renderInvoices(invoices) {
    const grid = document.getElementById("paymentGrid");
    grid.innerHTML = "";

    if (invoices.length === 0) {
        grid.innerHTML = "<p style='text-align:center; color:#999;'>คุณไม่มีรายการค้างชำระ</p>";
        return;
    }

    // วนลูปสร้างทีละใบ
    for (const inv of invoices) {
        let itemsHtml = "";

        try {
            // 🌟 ดึงข้อมูล InvoiceItem (รายการย่อย) ของบิลใบนี้
            const itemRes = await fetch(`/api/invoices/${inv.invoiceId}/items`);
            if (itemRes.ok) {
                const items = await itemRes.json();
                // จัดรูปแบบรายการย่อย
                itemsHtml = items.map(i => `<div style="color:#555; font-size:0.85rem;">- ${i.description} (${i.amount.toLocaleString()} ฿)</div>`).join("");
            }
        } catch (e) {
            console.error(`โหลดรายการย่อยของบิล ${inv.invoiceId} ไม่สำเร็จ`);
        }

        const isPaid = inv.status === 'PAID';
        const statusClass = isPaid ? 'paid' : 'unpaid';
        const statusText = isPaid ? 'สถานะ: ชำระแล้ว' : 'สถานะ: ค้างชำระ';

        // ถ้ายังไม่จ่าย โชว์ปุ่ม "ชำระเงิน"
        const actionHtml = isPaid ? '<div class="action-area"></div>' : `
            <div class="action-area">
                <button class="btn btn-pay" onclick="payInvoice(${inv.invoiceId})">ชำระเงิน</button>
            </div>
        `;

        grid.innerHTML += `
            <div class="payment-card">
                <div class="card-body">
                    <div class="date-title">No. ${inv.invoiceId} | วันที่ ${inv.invoiceDate || '-'}</div>

                    <div class="info-row">
                        <span class="label">แผนก</span>
                        <span class="value">${inv.department || 'ทั่วไป'}</span>
                    </div>

                    <div class="info-row">
                        <span class="label">แพทย์</span>
                        <span class="value">นพ. ${inv.doctorName || '-'}</span>
                    </div>

                    <div class="info-row" style="align-items: flex-start;">
                        <span class="label">รายการ</span>
                        <span class="value" style="text-align: right;">
                            ${itemsHtml || inv.diagnosis || '-'}
                        </span>
                    </div>

                    <div class="info-row" style="margin-top:5px;">
                        <span class="label">ยอดชำระ</span>
                        <span class="value" style="color: ${isPaid ? '#333' : 'var(--primary-color)'}; font-size: 1.1rem; font-weight: bold;">
                            ${inv.totalAmount ? inv.totalAmount.toLocaleString() : '0'} บาท
                        </span>
                    </div>

                    <div class="status-badge ${statusClass}">
                        <div class="dot"></div>
                        <span class="status-text">${statusText}</span>
                    </div>
                </div>
                ${actionHtml}
            </div>
        `;
    }
}

// ==========================
// 💳 ปุ่มชำระเงิน (จำลองการจ่ายเงิน)
// ==========================
function payInvoice(invoiceId) {
    // อนาคตสามารถเขียน fetch() ยิงแบบ PUT ไปอัปเดต Database ตรงนี้ได้เลย
    console.log(`กำลังจ่ายเงินบิล ID: ${invoiceId}`);

    // โชว์ popup สำเร็จไปก่อน
    document.getElementById("paymentModal").classList.add("active");
}

function closePaymentModal() {
    document.getElementById("paymentModal").classList.remove("active");
    // จ่ายเสร็จ โหลดหน้าใหม่เพื่อให้บิลเป็น "ชำระแล้ว"
    // window.location.reload(); 
}