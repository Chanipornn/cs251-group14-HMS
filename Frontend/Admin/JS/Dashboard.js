// ================= BASIC =================
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

// ================= DROPDOWN =================
function toggleDropdown() {
  const menu = document.getElementById("dropdownMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function filterRole(role) {
  const cards = document.querySelectorAll(".user-card");
  document.getElementById("selectedRole").innerText = role === "all" ? "All" : role;

  cards.forEach(card => {
    card.style.display =
      role === "all" || card.classList.contains(role) ? "flex" : "none";
  });

  document.getElementById("dropdownMenu").style.display = "none";
}

document.addEventListener("click", e => {
  if (!e.target.closest('.role-dropdown')) {
    document.getElementById("dropdownMenu").style.display = "none";
  }
});

// ================= DATA =================

// 👉 ใช้ localStorage เป็นหลัก

// ================= DATA =================

let users = JSON.parse(localStorage.getItem('allUsers'));

// เพิ่มเงื่อนไข: ถ้าไม่มีข้อมูล หรือ ข้อมูลมีน้อยผิดปกติ (เช่นมีแค่ 1-2 คน) ให้โหลดใหม่
if (!users || users.length < 5) { 
    users = [
        { name: "นพ.สมชาย ศรีสุข", role: "Doctor", dept: "จิตเวช", img: "../../img/doctor_img1.png", type: "doctor", phone: "091-888-2321" },
        { name: "น.ส. ศิริพร แสงทอง", role: "Staff", dept: "พยาบาล", img: "../../img/staff_img1.png", type: "staff", phone: "092-888-2322" },
        { name: "พญ.วราภรณ์ ศิริชัย", role: "Doctor", dept: "ศัลยกรรม", img: "../../img/doctor_img2.png", type: "doctor", phone: "093-888-2323" },
        { name: "นพ.นนทพัทธ์ ใจดี", role: "Doctor", dept: "หู คอ จมูก", img: "../../img/doctor_img3.png", type: "doctor", phone: "094-888-2324" },
        { name: "น.ส. พรทิพย์ จิตดี", role: "Staff", dept: "เจ้าหน้าที่การเงิน", img: "../../img/staff_img2.png", type: "staff", phone: "095-888-2325" },
        { name: "พญ.ชลธิชา คำดี", role: "Doctor", dept: "หู คอ จมูก", img: "../../img/doctor_img4.png", type: "doctor", phone: "096-888-2326" },
        { name: "น.ส. นันทิชา กอดเสา", role: "Staff", dept: "เจ้าหน้าที่เวชระเบียน", img: "../../img/staff_img3.png", type: "staff", phone: "097-888-2327" },
        { name: "นพ.อัครพล ศรีนวล", role: "Doctor", dept: "อายุรกรรม", img: "../../img/doctor_img5.png", type: "doctor", phone: "098-888-2328" },
        { name: "น.ส. ก้านแก้ว พงศ์ดี", role: "Staff", dept: "เจ้าหน้าที่ลงทะเบียนผู้ป่วย", img: "../../img/staff_img4.png", type: "staff", phone: "099-888-2329" }
        
    ];
    localStorage.setItem('allUsers', JSON.stringify(users));
}

// ================= RENDER =================
function renderUsers() {
  const userGrid = document.getElementById('userGrid');

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
}

// โหลดครั้งแรก
renderUsers();

// ================= EDIT =================
function goToEditPage(index) {
  const selectedUser = users[index];

  // เก็บ "index" ไปด้วย (สำคัญมาก!)
  localStorage.setItem('editUser', JSON.stringify({
    ...selectedUser,
    index: index
  }));

  if (selectedUser.type === 'doctor') {
    window.location.href = "Doctor_Edit_Add.html";
  } else {
    window.location.href = "Staff_Edit_Add.html";
  }
}

