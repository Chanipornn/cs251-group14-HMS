document.addEventListener('DOMContentLoaded', () => {
    handleSidebar();
    renderDetailPage();
    setupEditListeners();
});

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
            document.getElementById('detName').innerText = foundPatient.name;
            document.getElementById('detId').innerText = "รหัสประจำตัวผู้ป่วย : " + foundPatient.id;
            document.getElementById('detAge').innerText = "อายุ : " + (foundPatient.age || "--") + " ปี";
            document.getElementById('detWeight').innerText = "น้ำหนัก : " + (foundPatient.weight || "--") + " กก.";
            document.getElementById('detHeight').innerText = "ส่วนสูง : " + (foundPatient.height || "--") + " ซม.";
            document.getElementById('detDate').innerText = "วันที่บันทึก : " + foundPatient.date;
            
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
                if (p.id === 'detDate') return; 
                const text = p.innerText;
                const parts = text.split(" : ");
                const label = parts[0];
                const value = parts[1] || "";

                p.innerHTML = `${label} : <input type="text" value="${value.trim()}" class="edit-input" style="width: 200px; padding: 5px; border-radius: 5px; border: 1px solid #ccc; margin-left: 10px;" />`;
            });

            if (!card.querySelector('.save-btn')) {
                const btn = document.createElement('button');
                btn.innerText = "บันทึกการแก้ไข";
                btn.className = "btn-confirm";
                btn.style.marginTop = "20px";
                btn.style.cursor = "pointer";
                card.appendChild(btn);
                // เปลี่ยนไปเรียกใช้ saveData
                btn.onclick = () => saveData(card);
            }
        });
    });
}

// 4. ฟังก์ชันบันทึกที่ "แก้ไขข้อมูลในตัวแปรจำลอง" ได้จริง
function saveData(card) {
    const inputs = card.querySelectorAll('input');
    const patientId = document.getElementById('detId').innerText.replace("รหัสประจำตัวผู้ป่วย : ", "").trim();

    // ดึงค่าใหม่จาก Input
    const newName = inputs[0]?.value;
    const newAge = inputs[1]?.value;
    const newWeight = inputs[2]?.value;
    const newHeight = inputs[3]?.value;

    // --- ส่วนสำคัญ: อัปเดตข้อมูลใน mockDatabase จริงๆ ---
    if (typeof mockDatabase !== 'undefined') {
        for (let dateKey in mockDatabase) {
            const p = mockDatabase[dateKey].patients.find(item => item.id === patientId);
            if (p) {
                p.name = newName;
                p.age = newAge;
                p.weight = newWeight;
                p.height = newHeight;
                break; 
            }
        }
    }

    // แสดง Popup สำเร็จ (ขอบมนปุ่มม่วง)
    showSuccessModal(
        "บันทึกข้อมูลสำเร็จ!", 
        `อัปเดตข้อมูลของ: ${newName}`, 
        `รหัสผู้ป่วย: ${patientId}`, 
        null 
    );
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