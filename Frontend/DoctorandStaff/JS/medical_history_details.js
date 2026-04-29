document.addEventListener('DOMContentLoaded', () => {
    handleSidebar();
    renderDetailPage();
    setupEditListeners();
});

const mockDatabase = {
        "2026-03-25": {
            stats: { completed: 20, today: 10, total: 30 },
            patients: [
                { 
                    id: "6780987", 
                    name: "นาย สมิ่ง เสือเก่ง", 
                    age: "75",
                    weight: "80",
                    height: "180",
                    date: "25/03/2569", 
                    diagnosis: "เบาหวาน, ความดันโลหิตสูง",
                    doctor: "1112222333",
                    diag_result: "อาการคงที่",
                    treatment: "กินยาต่อเนื่อง",
                    final_result: "เป็นโรคเบาหวาน ระยะเริ่มต้น และความดันโลหิต ระยะเริ่มต้น",
                    symptoms: "ติดตามอาการเบาหวาน, มีอาการวิงเวียนศีรษะเล็กน้อย", // อาการ
                    
                },
                { id: "6780988", name: "น.ส. ใยบัว แก้วหวาน", date: "25/03/2569", diagnosis: "มะเร็งปากมดลูก" },
                { id: "6780989", name: "นาย สไวย อิ่มเอม", date: "25/03/2569", diagnosis: "มะเร็งปอด" }
            ]
        }
    };

// 1. Sidebar Toggle
function handleSidebar() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const container = document.querySelector('.container');
    if (toggleBtn) {
        toggleBtn.onclick = () => container.classList.toggle('full');
    }
}

// 2. แสดงรายละเอียด (ดึงจาก mockDatabase)
function renderDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');
    if (!patientId) return;

    if (typeof mockDatabase !== 'undefined') {
        let foundPatient = null;
        for (let dateKey in mockDatabase) {
            const p = mockDatabase[dateKey].patients.find(item => item.id === patientId);
            if (p) { foundPatient = p; break; }
        }

        if (foundPatient) {
            document.getElementById('detName').innerText = foundPatient.name || "--";
            document.getElementById('detId').innerText = "รหัสประจำตัวผู้ป่วย : " + (foundPatient.id || "--");
            document.getElementById('detAge').innerText = "อายุ : " + (foundPatient.age || "--") + " ปี";
            document.getElementById('detWeight').innerText = "น้ำหนัก : " + (foundPatient.weight || "--") + " กก.";
            document.getElementById('detHeight').innerText = "ส่วนสูง : " + (foundPatient.height || "--") + " ซม.";
            if(document.getElementById('detDate')) {
            document.getElementById('detDate').innerText = "วันที่บันทึก : " + (foundPatient.date || "--");
        }
            
            // ข้อมูลประวัติการรักษา
            if(document.getElementById('detDiagnosis')) document.getElementById('detDiagnosis').innerText = "การวินิจฉัยโรค : " + (foundPatient.diagnosis || "--");
            if(document.getElementById('detPatientIdLabel')) document.getElementById('detPatientIdLabel').innerText = "รหัสประจำตัวผู้ป่วย : " + foundPatient.id;
            if(document.getElementById('detDoctor')) document.getElementById('detDoctor').innerText = "รหัสประจำตัวแพทย์ : " + (foundPatient.doctor || "--");
            if(document.getElementById('detDateVisit')) document.getElementById('detDateVisit').innerText = "วันที่เข้าพบแพทย์ : " + (foundPatient.date || "--");
            if(document.getElementById('detSymptoms')) document.getElementById('detSymptoms').innerText = "อาการ : " + (foundPatient.symptoms || "--");
            if(document.getElementById('detDocDiagnosis')) document.getElementById('detDocDiagnosis').innerText = "การวินิจฉัย : " + (foundPatient.diag_result || "--");
            if(document.getElementById('detTreatment')) document.getElementById('detTreatment').innerText = "รายละเอียดการรักษา : " + (foundPatient.treatment || "--");
            if(document.getElementById('detResult')) document.getElementById('detResult').innerText = "ผลการรักษา : " + (foundPatient.final_result || "--");
        }
    }
}

// 3. ตั้งค่าปุ่มแก้ไข (ไอคอนดินสอ)
    function setupEditListeners() {
    document.querySelectorAll('.edit-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const card = e.target.closest('.card-content');
            const fields = card.querySelectorAll('.info-list p');

                fields.forEach(p => {
                    if (
                        p.id === 'detDate' ||
                        p.id === 'detId' ||
                        p.id === 'detPatientIdLabel' ||
                        p.id === 'detDoctor' ||
                        p.innerText.includes("วันที่")
                    ) return;

                let label = "";
                    let value = "";

                    if (p.innerText.includes(" : ")) {
                        const parts = p.innerText.split(" : ");
                        label = parts[0].trim();
                        value = (parts[1] || "").trim();

                        if (label === "อายุ") {
                            value = value.replace("ปี", "").trim();
                        }
                        if (label === "น้ำหนัก") {
                            value = value.replace("กก.", "").trim();
                        }
                        if (label === "ส่วนสูง") {
                            value = value.replace("ซม.", "").trim();
                        }
                    } else {
                        // 🔥 สำหรับ detName ที่ไม่มี :
                        label = "ชื่อ";
                        value = p.innerText;
                    }

                p.innerHTML = `
                    ${label} : 
                    <input type="text" value="${value}" class="edit-input" data-field="${label}" />
                `;
            });

            // 🔥 สร้างปุ่ม (ถ้ายังไม่มี)
            if (!card.querySelector('.save-btn')) {
                const btn = document.createElement('button');
                btn.innerText = "บันทึกการแก้ไข";
                btn.className = "save-btn";
                btn.onclick = () => saveData(card);

                card.appendChild(btn);
            }
        });
    });


// 4. ฟังก์ชันบันทึกที่ "แก้ไขข้อมูลในตัวแปรจำลอง" ได้จริง
function saveData(card) {
    const USE_API = false;

    const inputs = card.querySelectorAll('input');

    const patientId = document.getElementById('detId')
        .innerText.replace("รหัสประจำตัวผู้ป่วย : ", "")
        .trim();
        
    inputs.forEach(input => {
        const field = input.dataset.field;

        for (let dateKey in mockDatabase) {
            const p = mockDatabase[dateKey].patients.find(item => item.id === patientId);
            if (p) {
                if (field.includes("ชื่อ")) p.name = input.value;
                if (field.includes("อายุ")) p.age = input.value;
                if (field.includes("น้ำหนัก")) p.weight = input.value;
                if (field.includes("ส่วนสูง")) p.height = input.value;
            }
        }
    });



        showSuccessModal(
            "บันทึกสำเร็จ",
            `อัปเดตข้อมูลเรียบร้อย`,
            `รหัสผู้ป่วย: ${patientId}`,
            null
        );

        card.querySelectorAll('p').forEach(p => {
            const input = p.querySelector('input');
            if (input) {
                const label = input.dataset.field;
                p.innerHTML = `${label} : ${input.value}`;
            }
        });

        renderDetailPage();
        return;
    }

    fetch('/api/update-patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            PatientID: patientId,
            Name: newName,
            Weight: newWeight,
            Height: newHeight
        })
    })
    .then(res => res.json())
    .then(() => {
        showSuccessModal("บันทึกสำเร็จ", "", "", null);
        renderDetailPage();
    })
    .catch(() => {
        showSuccessModal("บันทึก (Mock fallback)", "", "", null);
    });
}

// 5. ฟังก์ชัน Popup
function showSuccessModal(title, detail1, detail2, redirectUrl) {
    const oldModal = document.getElementById('successModal');
    if (oldModal) oldModal.remove();

    const modalHtml = `
        <div id="successModal" class="modal-overlay">
            <div class="modal-content-new">
                <div class="icon-check-circle">
                    <i class="fas fa-check"></i>
                </div>
                <h2 class="modal-title-bold">${title}</h2>
                <div class="modal-details-text">
                    <p>${detail1}</p>
                    <p>${detail2}</p>
                </div>
                <button onclick="closeCustomModal('${redirectUrl}')" class="btn-purple-pill">ตกลง</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 6. ปิด Modal และสะท้อนค่าที่แก้ลงหน้าจอ
window.closeCustomModal = function(url) {
    const modal = document.getElementById('successModal');
    if (modal) modal.remove();
    
    // เราไม่ใช้ location.reload(); เพราะจะทำให้ mockDatabase กลับไปเป็นค่าเริ่มต้น
    // แต่เราจะเรียก renderDetailPage(); อีกครั้งเพื่อดึงค่าใหม่ที่แก้ในตัวแปรมาโชว์
    renderDetailPage(); 
};