document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ตารางจำลองข้อมูล (เพิ่มข้อมูล อายุ น้ำหนัก ส่วนสูง และรายละเอียดลงไป)
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
                    symptoms: "ติดตามอาการเบาหวาน, ความดันโลหิตสูง",
                    diag_result: "อาการคงที่",
                    treatment: "กินยาต่อเนื่อง",
                    final_result: "เป็นโรคเบาหวาน ระยะเริ่มต้น และความดันโลหิต ระยะเริ่มต้น",
                    
                    doctor: "1112222333", // รหัสแพทย์
                    symptoms: "ติดตามอาการเบาหวาน, มีอาการวิงเวียนศีรษะเล็กน้อย", // อาการ
                    diag_result: "อาการคงที่", // การวินิจฉัย
                    treatment: "จ่ายยา Metformin 500mg และแนะนำการคุมอาหาร", // รายละเอียดการรักษา
                    final_result: "เป็นโรคเบาหวาน ระยะเริ่มต้น และความดันโลหิต ระยะเริ่มต้น" // ผลการรักษา
                },
                { id: "6780988", name: "น.ส. ใยบัว แก้วหวาน", date: "25/03/2569", diagnosis: "มะเร็งปากมดลูก" },
                { id: "6780989", name: "นาย สไวย อิ่มเอม", date: "25/03/2569", diagnosis: "มะเร็งปอด" }
            ]
        }
    };
    //-------------------------------------------------------------------------

    // 2. ตัวแปรอ้างอิง HTML (Common)
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const container = document.querySelector('.container');

    if (toggleBtn) {
        toggleBtn.onclick = () => {
            sidebar.classList.toggle('collapsed');
            container.classList.toggle('full');
        };
    }

    //-------------------------------------------------------------------------

    // 3. จัดการหน้า "ประวัติการรักษา" (Main Page)
    const dateDisplay = document.getElementById('currentDateText');
    const tableBody = document.getElementById('historyTableBody');
    let currentDate = new Date(2026, 2, 25); 

    function updateUI() {
        if (!dateDisplay || !tableBody) return; // ถ้าไม่มี element เหล่านี้ (เช่น อยู่หน้าอื่น) ให้ข้ามไป

        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        dateDisplay.innerText = currentDate.toLocaleDateString('th-TH', options);

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;

        const data = mockDatabase[dateKey] || { stats: { completed: 0, today: 0, total: 0 }, patients: [] };

        // อัปเดต Stats
        if(document.getElementById('statCompleted')) document.getElementById('statCompleted').innerText = data.stats.completed;
        if(document.getElementById('statToday')) document.getElementById('statToday').innerText = data.stats.today;
        if(document.getElementById('statTotal')) document.getElementById('statTotal').innerText = data.stats.total;

        // อัปเดตตาราง
        if (data.patients.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 40px;">ไม่พบข้อมูล</td></tr>`;
        } else {
            tableBody.innerHTML = data.patients.map(p => `
                <tr onclick="location.href='medical_history_details.html?id=${p.id}'" style="cursor:pointer;">
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.date}</td>
                    <td>${p.diagnosis}</td>
                </tr>
                
            `).join('');
        }
    }

    //-------------------------------------------------------------------------

    // 4. จัดการหน้า "รายละเอียดประวัติ" (Detail Page)
    function renderDetailPage() {
    const detailContainer = document.getElementById('patientDetailView');
    if (!detailContainer) return; 

    // 1. ดึง ID จาก URL ที่ส่งมาจากหน้าตาราง (เช่น ?id=6780987)
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');

    if (!patientId) {
        console.log("ไม่มี ID ส่งมา");
        return;
    }

    // 2. ค้นหาข้อมูลจากใน mockDatabase (วนหาจากทุกวันที่)
    let foundPatient = null;
    for (let dateKey in mockDatabase) {
        const p = mockDatabase[dateKey].patients.find(item => item.id === patientId);
        if (p) {
            foundPatient = p;
            break;
        }
    }

    // 3. นำข้อมูลที่เจอไปใส่ใน HTML
    if (foundPatient) {
        document.getElementById('detName').innerText = foundPatient.name;
        document.getElementById('detId').innerText = "รหัสประจำตัวผู้ป่วย : " + foundPatient.id;
        document.getElementById('detAge').innerText = "อายุ : " + (foundPatient.age || "--") + " ปี";
        document.getElementById('detWeight').innerText = "น้ำหนัก : " + (foundPatient.weight || "--") + " กก.";
        document.getElementById('detHeight').innerText = "ส่วนสูง : " + (foundPatient.height || "--") + " ซม.";
        document.getElementById('detDate').innerText = "วันที่บันทึก : " + foundPatient.date;
        
        // ข้อมูล Card ล่าง
        if(document.getElementById('detDiagnosis')) 
            document.getElementById('detDiagnosis').innerText = "การวินิจฉัยโรค : " + (foundPatient.diagnosis || "--");
        
        if(document.getElementById('detPatientIdLabel')) 
            document.getElementById('detPatientIdLabel').innerText = "รหัสประจำตัวผู้ป่วย : " + foundPatient.id;
        
        if(document.getElementById('detDoctor')) 
            document.getElementById('detDoctor').innerText = "รหัสประจำตัวแพทย์ : " + (foundPatient.doctor || "--");
        
        if(document.getElementById('detDateVisit')) 
            document.getElementById('detDateVisit').innerText = "วันที่เข้าพบแพทย์ : " + (foundPatient.date || "--");
        
        if(document.getElementById('detSymptoms')) 
            document.getElementById('detSymptoms').innerText = "อาการ : " + (foundPatient.symptoms || "--");
        
        if(document.getElementById('detDocDiagnosis')) 
            document.getElementById('detDocDiagnosis').innerText = "การวินิจฉัย : " + (foundPatient.diag_result || "--");
        
        if(document.getElementById('detTreatment')) 
            document.getElementById('detTreatment').innerText = "รายละเอียดการรักษา : " + (foundPatient.treatment || "--");
        
        if(document.getElementById('detResult')) 
            document.getElementById('detResult').innerText = "ผลการรักษา : " + (foundPatient.final_result || "--");
    }
}

    //-------------------------------------------------------------------------

    // 5. ผูก Event ปุ่มเลื่อนวันที่
    const prevBtn = document.getElementById('prevDate');
    const nextBtn = document.getElementById('nextDate');
    if (prevBtn) prevBtn.onclick = () => { currentDate.setDate(currentDate.getDate() - 1); updateUI(); };
    if (nextBtn) nextBtn.onclick = () => { currentDate.setDate(currentDate.getDate() + 1); updateUI(); };

    //-------------------------------------------------------------------------

    // 6. ผูก Event ปุ่ม 3 ขีด (Sidebar)

    if (toggleBtn) {
        toggleBtn.onclick = () => {
            sidebar.classList.toggle('collapsed');
            container.classList.toggle('full');
        };
}

    //-------------------------------------------------------------------------

    // 7. เพิ่มประวัติการรักษา (จัดการผ่าน Form id="historyForm")
    const historyForm = document.getElementById('historyForm');

if (historyForm) {
    historyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const patientIdEl = document.getElementById('patientId');
        const doctorIdEl = document.getElementById('doctorId');
        const visitDateEl = document.getElementById('visitDate');
        const symptomsEl = document.getElementById('symptoms');
        const diagnosisEl = document.getElementById('diagnosis');
        const resultEl = document.getElementById('treatmentResult');
        const detailsEl = document.getElementById('treatmentDetail');

        // 🔥 กัน null ทุกตัว
        if (!patientIdEl || !doctorIdEl || !visitDateEl) return;

        const pId = patientIdEl.value;
        const dId = doctorIdEl.value;
        const vDate = visitDateEl.value;
        const symptoms = symptomsEl?.value || "";
        const diagnosis = diagnosisEl?.value || "";
        const result = resultEl?.value || "";
        const details = detailsEl?.value || "";

        if (!pId || !vDate) {
            alert("กรุณากรอกข้อมูลให้ครบ");
            return;
        }

        const dateKey = vDate;

        if (!mockDatabase[dateKey]) {
            mockDatabase[dateKey] = {
                stats: { completed: 0, today: 0, total: 0 },
                patients: []
            };
        }

        const newPatientData = {
            id: pId,
            name: "ผู้ป่วยใหม่ (" + pId + ")",
            date: new Date(vDate).toLocaleDateString('th-TH'),
            diagnosis,
            doctor: dId,
            symptoms,
            diag_result: diagnosis,
            treatment: details,
            final_result: result,
            age: "30",
            weight: "65",
            height: "170"
        };

        mockDatabase[dateKey].patients.push(newPatientData);

        alert("เพิ่มสำเร็จ");
        window.location.href = 'medical_history.html';
    });
}
    
    //-------------------------------------------------------------------------

    // 8. ฟังก์ชันสำหรับการค้นหา (Search)
const searchInput = document.querySelector('.search-container input'); // เลือกช่อง input
const searchIcon = document.querySelector('.search-icon'); // ถ้าคุณมีไอคอนแว่นขยาย

if (searchInput) {
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim();
        renderTable(searchTerm); // เรียกฟังก์ชันวาดตารางใหม่พร้อมคำค้นหา
    });
}

// แยกฟังก์ชันวาดตารางออกมาเพื่อให้เรียกใช้ซ้ำได้ง่าย
function renderTable(searchTerm = "") {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    const data = mockDatabase[dateKey] || { patients: [] };
    
    // กรองข้อมูล (Filter) ตามรหัสผู้ป่วย
    const filteredPatients = data.patients.filter(p => 
        p.id.includes(searchTerm) || p.name.includes(searchTerm)
    );

    if (filteredPatients.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 40px;">ไม่พบข้อมูลที่ค้นหา</td></tr>`;
    } else {
        tableBody.innerHTML = filteredPatients.map(p => `
            <tr onclick="location.href='medical_history_details.html?id=${p.id}'" style="cursor:pointer;">
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.date}</td>
                <td>${p.diagnosis}</td>
            </tr>
        `).join('');
    }
}

// แก้ไขฟังก์ชัน updateUI เดิมให้เรียก renderTable()
function updateUI() {
    if (!dateDisplay || !tableBody) return;
    
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    dateDisplay.innerText = currentDate.toLocaleDateString('th-TH', options);

    // ... ส่วนอัปเดต Stats (เหมือนเดิม) ...

    renderTable(searchInput ? searchInput.value : ""); // วาดตาราง
}

    // เริ่มทำงานครั้งแรก
    updateUI();
    renderDetailPage();

    //แก้ไขข้อมูลผู้ป่วย
document.querySelectorAll('.edit-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
        const card = e.target.closest('.card-content');
        const fields = card.querySelectorAll('.info-list p');

        fields.forEach(p => {
            const text = p.innerText;
            const value = text.split(" : ")[1] || "";

            p.innerHTML = `
                ${text.split(" : ")[0]} :
                <input type="text" value="${value}" />
            `;
        });

        // เพิ่มปุ่ม Save
        if (!card.querySelector('.save-btn')) {
            const btn = document.createElement('button');
            btn.innerText = "บันทึก";
            btn.className = "save-btn";
            card.appendChild(btn);

            btn.onclick = () => saveData(card);
        }
    });
});



});


