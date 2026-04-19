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
                    final_result: "เป็นโรคเบาหวาน ระยะเริ่มต้น และความดันโลหิต ระยะเริ่มต้น"
                },
                { id: "6780988", name: "น.ส. ใยบัว แก้วหวาน", date: "25/03/2569", diagnosis: "มะเร็งปากมดลูก" },
                { id: "6780989", name: "นาย สไวย อิ่มเอม", date: "25/03/2569", diagnosis: "มะเร็งปอด" }
            ]
        }
    };

    // 2. ตัวแปรอ้างอิง HTML (Common)
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

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
                <tr onclick="window.location.href='medical_history_detail.html?id=${p.id}'" style="cursor:pointer;">
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.date}</td>
                    <td>${p.diagnosis}</td>
                </tr>
            `).join('');
        }
    }

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
        if(document.getElementById('detDiagnosis')) document.getElementById('detDiagnosis').innerText = "การวินิจฉัยโรค : " + foundPatient.diagnosis;
        // ... เติมส่วนอื่นๆ ที่เหลือ ...
    }
}

    // 5. ผูก Event ปุ่มเลื่อนวันที่
    const prevBtn = document.getElementById('prevDate');
    const nextBtn = document.getElementById('nextDate');
    if (prevBtn) prevBtn.onclick = () => { currentDate.setDate(currentDate.getDate() - 1); updateUI(); };
    if (nextBtn) nextBtn.onclick = () => { currentDate.setDate(currentDate.getDate() + 1); updateUI(); };

    // 6. ผูก Event ปุ่ม 3 ขีด (Sidebar)
    if (toggleBtn) {
        toggleBtn.onclick = () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('full-width');
        };
    }

    // 7. เพิ่มประวัติการรักษา (Form)
    const historyForm = document.getElementById('createHistoryForm');
    if (historyForm) {
        historyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newRecord = {
                id: document.getElementById('patientId').value,
                name: document.getElementById('patientName').value,
                date: new Date().toLocaleDateString('th-TH'),
                diagnosis: document.getElementById('diagnosis').value
            };
            console.log("บันทึกข้อมูลใหม่:", newRecord);
            alert("บันทึกข้อมูลสำเร็จ!");
            window.location.href = 'medical_history.html'; 
        });
    }

    // เริ่มทำงานครั้งแรก
    updateUI();
    renderDetailPage();
});