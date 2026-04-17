function goToDashboard() {
    window.location.href = "dashboard.html";
}

function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('hide');
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

function goProfile() {
  window.location.href = "profile.html";
}

/* highlight menu auto */
const links = document.querySelectorAll(".menu");
links.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});


//dropdown + filter
function toggleDropdown() {
  const menu = document.getElementById("dropdownMenu");
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

function filterRole(role) {
  const cards = document.querySelectorAll(".user-card");
  const label = document.getElementById("selectedRole");

  label.innerText = role === "all" ? "All" : role;

  cards.forEach(card => {
    if (role === "all") {
      card.style.display = "flex";
    } else {
      if (card.classList.contains(role)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    }
  });

  document.getElementById("dropdownMenu").style.display = "none";
}

document.addEventListener("click", function(e) {
  if (!e.target.closest('.role-dropdown')) {
    const menu = document.getElementById("dropdownMenu");
    if (menu) menu.style.display = "none";
  }
});


// user cards

const users = [
    { name: "นพ.สมชาย ศรีสุข", role: "Doctor", dept: "แผนก หู คอ จมูก", img: "../../img/doctor_img1.png", type: "doctor",phone: "091-888-2321" },
    { name: "น.ส. ศิริพร แสงทอง", role: "Staff", dept: "ตำแหน่ง พยาบาล", img: "../../img/staff_img1.png", type: "staff",phone: "092-888-2322" },
    { name: "พญ.วราภรณ์ ศิริชัย", role: "Doctor", dept: "แผนก ศัลยกรรม", img: "../../img/doctor_img2.png", type: "doctor",phone: "093-888-2323" },
    { name: "นพ.นนทพัทธ์ ใจดี", role: "Doctor", dept: "แผนก หู คอ จมูก", img: "../../img/doctor_img3.png", type: "doctor",phone: "094-888-2324" },
    { name: "น.ส. พรทิพย์ จิตดี", role: "Staff", dept: "ตำแหน่ง เจ้าหน้าที่การเงิน", img: "../../img/staff_img2.png", type: "staff",phone: "095-888-2325" },
    { name: "พญ.ชลธิชา คำดี", role: "Doctor", dept: "คลินิก ตา หู จมูก", img: "../../img/doctor_img4.png", type: "doctor",phone: "096-888-2326" },
    { name: "น.ส. นันทิชา กอดเสา", role: "Staff", dept: "ตำหน่ง เจ้าหน้าที่เวชระเบียน", img: "../../img/staff_img3.png", type: "staff",phone: "097-888-2327" },
    { name: "นพ.อัครพล ศรีนวล", role: "Doctor", dept: "แผนก อายุรกรรม", img: "../../img/doctor_img5.png", type: "doctor",phone: "098-888-2328" },
    { name: "น.ส. ก้านแก้ว พงศ์ดี", role: "Staff", dept: "ตำแหน่ง เจ้าหน้าที่ลงทะเบียนผู้ป่วย", img: "../../img/staff_img4.png", type: "staff",phone: "099-888-2329" }
  ];  

const userGrid = document.getElementById('userGrid');


// แก้ไขส่วนที่ render userGrid ในไฟล์ dashboard.js 
userGrid.innerHTML = users.map((user, index) => `
    <div class="user-card ${user.type}">
        <img src="${user.img}" class="user-img">
        <div class="user-info">
            <span class="badge ${user.type}">${user.role}</span>
            <div class="text-content">
                <h4>${user.name}</h4>
                <p>${user.dept}</p>
            </div>
        </div>
        <div class="edit-btn" onclick="goToEditPage(${index})">✎</div>
    </div>
`).join('');

// เพิ่มฟังก์ชันนำทาง (Navigation Function)
function goToStaffProfile(event, name) {
    // ใช้ stopPropagation เพื่อไม่ให้การคลิกปุ่มไปโดนตัวการ์ด (ถ้ามีการ์ดมี onclick อื่น)
    event.stopPropagation(); 
    
    // เปลี่ยนหน้าไปยัง StaffProfile.html พร้อมส่งชื่อไปทาง URL
    window.location.href = `StaffProfile.html?name=${encodeURIComponent(name)}`;

}

// เพิ่มฟังก์ชันนำทาง
// ฟังก์ชันสำหรับพาไปหน้าแก้ไข โดยแยกตามประเภท
function goToEditPage(index) {
    const selectedUser = users[index]; // ดึงข้อมูล user จาก array ตามลำดับที่กด
    
    // 1. เก็บข้อมูลลง localStorage ไว้เหมือนเดิมเพื่อให้หน้าปลายทางดึงไปใช้
    localStorage.setItem('editUser', JSON.stringify(selectedUser));

    // 2. เช็คเงื่อนไข user.type เพื่อเลือกหน้าไฟล์ HTML
    if (selectedUser.type === 'doctor') {
        window.location.href = "Doctor_Edit_Add.html";
    } else if (selectedUser.type === 'staff') {
        window.location.href = "Staff_Edit_Add.html";
    } else {
        alert("ไม่พบประเภทบุคลากร");
    }
}

// เพิ่มเข้าไปใน saveData ก่อนคำสั่ง alert
let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
// หาว่าคนที่เรากำลังแก้อยู่อยู่ลำดับไหนในรายชื่อทั้งหมด (หาด้วยชื่อหรือ ID)
const index = allUsers.findIndex(u => u.name === userData.name); 

if (index !== -1) {
    allUsers[index] = newData; // อัปเดตข้อมูลคนนั้นใน Array ใหญ่
    localStorage.setItem('allUsers', JSON.stringify(allUsers)); // เซฟรายการใหม่
}

