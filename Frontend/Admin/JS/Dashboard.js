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
    { name: "นพ.สมชาย ศรีสุข", role: "Doctor", dept: "แผนก หู คอ จมูก", img: "../../img/doctor_img1.png", type: "doctor" },
    { name: "น.ส. ศิริพร แสงทอง", role: "Staff", dept: "พยาบาล", img: "../../img/staff_img1.png", type: "staff" },
    { name: "พญ.วราภรณ์ ศิริชัย", role: "Doctor", dept: "แผนก ศัลยกรรม", img: "../../img/doctor_img2.png", type: "doctor" },
    { name: "นพ.นนทพัทธ์ ใจดี", role: "Doctor", dept: "แผนก หู คอ จมูก", img: "../../img/doctor_img3.png", type: "doctor" },
    { name: "น.ส. พรทิพย์ จิตดี", role: "Staff", dept: "ตำแหน่ง เจ้าหน้าที่การเงิน", img: "../../img/staff_img2.png", type: "staff" },
    { name: "พญ.ชลธิชา คำดี", role: "Doctor", dept: "คลินิก ตา หู จมูก", img: "../../img/doctor_img4.png", type: "doctor" },
    { name: "น.ส. นันทิชา กอดเสา", role: "Staff", dept: "ตำหน่ง เจ้าหน้าที่เวชระเบียน", img: "../../img/staff_img3.png", type: "staff" },
    { name: "นพ.อัครพล ศรีนวล", role: "Doctor", dept: "แผนก อายุรกรรม", img: "../../img/doctor_img5.png", type: "doctor" },
    { name: "น.ส. ก้านแก้ว พงศ์ดี", role: "Staff", dept: "ตำแหน่ง เจ้าหน้าที่ลงทะเบียนผู้ป่วย", img: "../../img/staff_img4.png", type: "staff" }
  ];  

const userGrid = document.getElementById('userGrid');


userGrid.innerHTML = users.map(user => `
    <div class="user-card ${user.type}">
        <img src="${user.img}" class="user-img">
        <div class="user-info">
            <span class="badge ${user.type}">${user.role}</span>
            <div class="text-content">
                <h4>${user.name}</h4>
                <p>${user.dept}</p>
            </div>
        </div>
        <div class="edit-btn">✎</div>
    </div>
`).join('');

// เพิ่มฟังก์ชันนำทาง (Navigation Function)
function goToStaffProfile(event, name) {
    // ใช้ stopPropagation เพื่อไม่ให้การคลิกปุ่มไปโดนตัวการ์ด (ถ้ามีการ์ดมี onclick อื่น)
    event.stopPropagation(); 
    
    // เปลี่ยนหน้าไปยัง StaffProfile.html พร้อมส่งชื่อไปทาง URL
    window.location.href = `StaffProfile.html?name=${encodeURIComponent(name)}`;
}

