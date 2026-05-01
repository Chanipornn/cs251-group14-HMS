let itemCount = 0;
let DoctorID;

window.onload = async function() {
    try {
        const response = await fetch('/api/doctorandstaff/me');
        if (response.status === 401) {
            alert("กรุณาล็อคอินก่อนเข้าใช้งาน");
            window.location.href = "/doctorandstaff";
            return;
        }
        const data = await response.json();
        document.getElementById('displayName').textContent = data.name;

        // รองรับทั้ง camelCase และ PascalCase
        DoctorID = data.doctorId || data.DoctorID;

        if (!DoctorID) {
            console.error("ไม่พบรหัสแพทย์ใน Session");
            return;
        }

        // ดึงข้อมูล Prescription + Invoice History ของหมอคนนี้
        await fetchHistoryRecords();
        setupSearch();

    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
    }
};
// 📌 1. กดปุ่ม "+ Add" เพื่อเพิ่มช่องกรอกรายการ
document.getElementById('addItemLink').addEventListener('click', function(e) {
    e.preventDefault(); // กันไม่ให้หน้าเว็บเด้งกลับไปบนสุด
    itemCount++;

    const tbody = document.getElementById('invoiceItemsBody');
    const tr = document.createElement('tr');

    // สร้างช่องกรอกข้อมูล (Description กับ Amount)
    tr.innerHTML = `
            <td>${itemCount}</td>
            <td><input type="text" class="item-desc input" placeholder="ระบุรายการ (เช่น ค่าตรวจแพทย์)" required style="width: 90%;"></td>
            <td><input type="number" class="item-amount input" placeholder="0.00" min="0" step="0.01" required style="width: 80%;"></td>
        `;
    tbody.appendChild(tr);
});

// 📌 2. กดปุ่ม "ยืนยัน" เพื่อส่งข้อมูลเข้า Database
document.getElementById('invoiceForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const patientId = document.getElementById('invoicePatientId').value;
    const recordId = document.getElementById('invoiceTreatmentId').value;
    const rows = document.querySelectorAll('#invoiceItemsBody tr');

    if (rows.length === 0) {
        alert("กรุณาเพิ่มรายการค่าใช้จ่ายอย่างน้อย 1 รายการครับ!");
        return;
    }

    try {
        // Step 1: ยิง API สร้างบิลหลักก่อน
        const invoiceRes = await fetch('/api/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientId: parseInt(patientId),
                recordId: parseInt(recordId)
            })
        });

        if (!invoiceRes.ok) {
            throw new Error("ไม่สามารถสร้างใบแจ้งหนี้ได้ (เช็คว่ามีประวัติการรักษานี้จริงหรือไม่)");
        }

        const newInvoice = await invoiceRes.json();
        const generatedInvoiceId = newInvoice.invoiceId; // ได้รหัสบิลที่เพิ่งสร้างมาแล้ว!

        // Step 2: วนลูปยิง API เพิ่มรายการย่อย (InvoiceItems) ใส่บิลใบนั้น
        for (const row of rows) {
            const desc = row.querySelector('.item-desc').value;
            const amt = row.querySelector('.item-amount').value;

            if (desc && amt) {
                await fetch(`/api/invoices/${generatedInvoiceId}/items`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        description: desc,
                        amount: parseFloat(amt)
                    })
                });
            }
        }

        alert("สร้างใบแจ้งหนี้สำเร็จเรียบร้อย!");
        window.location.href = "invoice_history.html"; // เด้งกลับหน้าประวัติบิล

    } catch (error) {
        console.error(error);
        alert("เกิดข้อผิดพลาด: " + error.message);
    }
});

// ทริคเล็กๆ: สั่งให้กดปุ่ม Add รอไว้เลย 1 บรรทัดตอนเปิดหน้ามา
document.getElementById('addItemLink').click();