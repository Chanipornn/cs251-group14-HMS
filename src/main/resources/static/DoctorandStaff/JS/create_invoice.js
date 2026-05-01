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
        console.error("เกิดข้อผิดพลาด:", error); ฟ
    }
};
// 📌 1. กดปุ่ม "+ Add" เพื่อเพิ่มช่องกรอกรายการ
// รายการตัวเลือกพื้นฐานสำหรับสร้างบิล พร้อมราคาเริ่มต้น
const defaultItems = [
    { name: "เลือกรายการ...", price: "" },
    { name: "ค่าธรรมเนียมแพทย์ผู้เชี่ยวชาญ", price: 500 },
    { name: "ค่าบริการโรงพยาบาล", price: 200 },
    { name: "ค่าเครื่องมือแพทย์", price: 300 },
    { name: "ค่าตรวจทางห้องปฏิบัติการ (Lab)", price: 800 },
    { name: "อื่น ๆ (พิมพ์รายละเอียดเอง)", price: "" } // เผื่อให้พิมพ์เอง
];

// 📌 1. กดปุ่ม "+ Add" เพื่อเพิ่มช่องกรอกรายการ
document.getElementById('addItemLink').addEventListener('click', function(e) {
    e.preventDefault();
    itemCount++;

    const tbody = document.getElementById('invoiceItemsBody');
    const tr = document.createElement('tr');

    // สร้าง Dropdown `<select>` จาก defaultItems
    let optionsHtml = defaultItems.map(item =>
        `<option value="${item.name}" data-price="${item.price}">${item.name}</option>`
    ).join('');

    tr.innerHTML = `
        <td>${itemCount}</td>
        <td>
            <!-- Dropdown สำหรับเลือก -->
            <select class="item-select input" style="width: 45%; margin-right: 5px;">
                ${optionsHtml}
            </select>
            <!-- Input Text สำหรับพิมพ์เอง (ซ่อนไว้ก่อน) -->
            <input type="text" class="item-desc input" placeholder="ระบุรายการ" style="width: 45%; display: none;">
        </td>
        <td>
            <input type="number" class="item-amount input" placeholder="0.00" min="0" step="0.01" required style="width: 70%;">
            <!-- ปุ่มลบแถว (ของแถมเพื่อความสะดวก) -->
            <button type="button" class="btn-remove-row" style="color: red; background: none; border: none; cursor: pointer; margin-left: 10px;">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

    tbody.appendChild(tr);

    // --- จัดการ Event เมื่อเลือก Dropdown ---
    const selectEl = tr.querySelector('.item-select');
    const descInput = tr.querySelector('.item-desc');
    const amountInput = tr.querySelector('.item-amount');
    const removeBtn = tr.querySelector('.btn-remove-row');

    selectEl.addEventListener('change', function() {
        // ดึงราคาจาก Option ที่เลือก
        const selectedOption = selectEl.options[selectEl.selectedIndex];
        const price = selectedOption.getAttribute('data-price');
        const itemName = selectedOption.value;

        // ถ้าราคาไม่ใช่ค่าว่าง (คือเลือกรายการที่มีราคา) ให้ใส่ราคาในช่องเลย
        if (price !== "") {
            amountInput.value = price;
        } else {
            amountInput.value = ""; // เคลียร์ช่องให้พิมพ์เอง
        }

        // ถ้าเลือก "อื่น ๆ" ให้ซ่อน Dropdown แล้วโชว์ช่อง Text แทน
        if (itemName === "อื่น ๆ (พิมพ์รายละเอียดเอง)") {
            selectEl.style.display = "none";
            descInput.style.display = "inline-block";
            descInput.focus();
            descInput.required = true; // บังคับกรอกถ้าเลือกอื่นๆ
        } else {
            // ถ้าเป็นรายการปกติ ก็เอาค่าจาก Dropdown มาเป็น Description เลย
            descInput.value = itemName;
            descInput.required = false;
        }
    });

    // --- จัดการปุ่มลบแถว ---
    removeBtn.addEventListener('click', function() {
        tr.remove();
        // ไม่ต้องลด itemCount ก็ได้ ให้เลขมันรันไปเรื่อยๆ จะได้ไม่งง
    });
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