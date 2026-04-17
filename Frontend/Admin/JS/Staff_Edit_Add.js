

function toggleTopDropdown(event) {
    // ป้องกันไม่ให้ Event ส่งต่อไปยังส่วนอื่น
    event.stopPropagation();
    
    // หาเมนูโดยใช้ ID
    const menu = document.getElementById("topDropdownMenu");
    
    // ใช้ toggle คลาส 'show'
    menu.classList.toggle("show");
}

function selectTopRole(role) {
    // เปลี่ยนข้อความบนปุ่ม
    document.getElementById("selectedTopRole").innerText = role;
    
    // ปิดเมนูหลังจากเลือกเสร็จ
    document.getElementById("topDropdownMenu").classList.remove("show");
    
    console.log("คุณเลือก: " + role);
}

// คลิกที่อื่นในหน้าจอให้เมนูปิดลง
window.onclick = function(event) {
    if (!event.target.closest('.role-dropdown')) {
        const menu = document.getElementById("topDropdownMenu");
        if (menu && menu.classList.contains('show')) {
            menu.classList.remove('show');
        }
    }
}


// ฟังก์ชันสำหรับเลือกแผนก

// 1. รายการแผนก
const departmentList = [
    "อายุรกรรม",
    "ศัลยกรรม",
    "แผนก หู คอ จมูก",
    "จิตเวช",
    "รังสีวิทยา",
    "กุมารเวชกรรม"
];

// 2. ฟังก์ชันหลักสำหรับจัดการข้อมูลในหน้าแก้ไข
function initializeEditPage() {
    const selectEl = document.getElementById('deptSelect');
    const userData = JSON.parse(localStorage.getItem('editUser'));

    // --- ส่วนที่ 1: จัดการเมนู Dropdown แผนก ---
    if (selectEl) {
        // ตั้งค่า Default ให้มีค่าว่าง "" เพื่อให้แสดงคำว่า "กรุณาเลือกแผนก"
        selectEl.innerHTML = '<option value="" selected>-- กรุณาเลือกแผนก --</option>';
        
        departmentList.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            selectEl.appendChild(option);
        });
        console.log("เชื่อมต่อข้อมูลแผนกสำเร็จ!");
    }

    // --- ส่วนที่ 2: นำข้อมูลจาก localStorage มาหยอดใส่ ---
    // ในฟังก์ชัน initializeEditPage() ตรงส่วนที่จัดการ userData
if (userData) {
    // ... (โค้ดส่วนชื่อ/รูปภาพ/แผนก) ...

    // --- ส่วนแก้ไขป้าย Badge (Doctor / Staff) ---
    const roleText = document.getElementById('currentRole'); // ตัวหนังสือในป้าย
    const roleBadge = document.getElementById('roleDisplay'); // ตัวป้ายที่จะเปลี่ยนสี

    if (roleText && roleBadge) {
        // 1. เปลี่ยนตัวหนังสือตามข้อมูล (เช่น "Doctor" หรือ "Staff")
        roleText.innerText = userData.role;

        // 2. ลบ Class สีเก่าออกให้หมดก่อนเพื่อป้องกันสีตีกัน
        roleBadge.classList.remove('doctor', 'staff');

        // 3. ตรวจสอบเงื่อนไขเพื่อใส่ Class สีให้ถูกต้อง
        // เราจะใช้ userData.type (ค่าที่เป็น doctor หรือ staff ตัวเล็ก) มาเป็นชื่อ Class
        if (userData.type) {
            const typeClass = userData.type.toLowerCase(); // ปรับให้เป็นตัวเล็กเพื่อความชัวร์
            roleBadge.classList.add(typeClass); 
        }
    }
}
}

// 3. รันฟังก์ชันเมื่อโหลดหน้าเสร็จ
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeEditPage);
} else {
    initializeEditPage();
}

// --- ฟังก์ชันอื่นๆ (Dropdown Role / Save) คงไว้ตามเดิม ---
function toggleTopDropdown(event) {
    event.stopPropagation();
    document.getElementById("topDropdownMenu").classList.toggle("show");
}

function selectTopRole(role) {
    document.getElementById("selectedTopRole").innerText = role;
    document.getElementById("topDropdownMenu").classList.remove("show");
}

// --- ฟังก์ชันสำหรับปุ่ม "บันทึก" ---
function saveData() {
    // 1. ดึงข้อมูลปัจจุบันจาก localStorage มาก่อนเพื่อเอา ID หรือลำดับเดิม
    const userData = JSON.parse(localStorage.getItem('editUser'));
    
    if (!userData) {
        alert("ไม่พบข้อมูลที่ต้องการบันทึก");
        return;
    }

    // 2. อ่านค่าใหม่จาก Input/Select ในหน้าแก้ไข
    const updatedName = document.querySelector('.display-name').innerText;
    const updatedDept = document.getElementById('deptSelect').value;
    const updatedRole = document.getElementById('currentRole').innerText;
    const updatedExpertise = document.querySelector('input[placeholder="กรอกความเชี่ยวชาญ"]')?.value || "";

    // 3. สร้างก้อนข้อมูลใหม่
    const newData = {
        ...userData, // เอาข้อมูลเดิมมาทั้งหมด (เช่นรูปภาพ, ID, type)
        name: updatedName,
        dept: updatedDept,
        role: updatedRole,
        expertise: updatedExpertise
    };

    // 4. บันทึกกลับลง localStorage (ทับข้อมูลเดิมที่เลือกมา)
    // หมายเหตุ: ในระบบจริงตรงนี้ต้องส่ง fetch/API ไปที่หลังบ้าน
    localStorage.setItem('editUser', JSON.stringify(newData));

    alert("บันทึกข้อมูลของ " + updatedName + " สำเร็จ!");

    // 5. เด้งกลับหน้า Dashboard
    window.location.href = "dashboard.html";
}

// --- ฟังก์ชันสำหรับปุ่ม "ยกเลิก" ---
function cancelEdit() {
    // ไม่ต้องทำอะไรกับข้อมูล แค่เด้งกลับหน้า Dashboard ทันที
    // ข้อมูลในระบบจะยังคงเป็นอันเดิมเพราะเราไม่ได้สั่ง setItem ใหม่
    window.location.href = "dashboard.html";
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. ดึงข้อมูลพนักงานที่ถูกส่งมาจากหน้า Dashboard
    const userData = JSON.parse(localStorage.getItem('editUser'));

    if (userData) {
        // --- ส่วนที่ 1: แสดงข้อมูลที่เป็นตัวหนังสือ (Text) ---
        if (document.querySelector('.display-name')) {
            document.querySelector('.display-name').innerText = userData.name;
        }
        
        // แสดงเบอร์โทร (ถ้ามีในข้อมูล)
        const phoneVal = document.querySelector('.phone-value');
        if (phoneVal && userData.phone) {
            phoneVal.innerText = userData.phone;
        }

        // --- ส่วนที่ 2: แสดงรูปภาพ ---
        const profileImg = document.querySelector('.profile-main-img');
        if (profileImg && userData.img) {
            profileImg.src = userData.img;
        }

        // --- ส่วนที่ 3: ตั้งค่าป้าย Badge (Doctor/Staff) และสี ---
        const roleText = document.getElementById('currentRole');
        const roleBadge = document.getElementById('roleDisplay');
        if (roleText && roleBadge) {
            roleText.innerText = userData.role;
            // ล้างสีเก่าและใส่สีตามประเภท (doctor/staff)
            roleBadge.classList.remove('doctor', 'staff');
            roleBadge.classList.add(userData.type.toLowerCase());
        }

        // --- ส่วนที่ 4: ตั้งค่าแผนกใน Select (สำคัญมาก) ---
        // ต้องเรียกฟังก์ชันสร้าง Options ก่อน แล้วค่อยสั่ง Set Value
        setupDepartmentDropdown(userData.dept);
    }
});

// ฟังก์ชันสร้างเมนูแผนกและเลือกค่าปัจจุบัน
function setupDepartmentDropdown(currentDept) {
    const selectEl = document.getElementById('deptSelect');
    if (!selectEl) return;

    // รายการแผนก (ควรตรงกับที่เคยทำไว้)
    const departments = ["อายุรกรรม", "ศัลยกรรม", "แผนก หู คอ จมูก", "จิตเวช", "รังสีวิทยา", "กุมารเวชกรรม"];

    // สร้าง HTML สำหรับ Option
    let optionsHtml = '<option value="">-- กรุณาเลือกแผนก --</option>';
    departments.forEach(dept => {
        optionsHtml += `<option value="${dept}">${dept}</option>`;
    });
    
    selectEl.innerHTML = optionsHtml;

    // *** นี่คือคำสั่งที่ทำให้ "ข้อมูลปัจจุบัน" ขึ้นโชว์ ***
    if (currentDept) {
        selectEl.value = currentDept;
    }
}