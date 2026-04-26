// ================= BASIC =================
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('hide');
}

function logout() {
  localStorage.clear();
  window.location.href = "../../login.html";
}

function goProfile() {
  window.location.href = "profile.html";
}

// ================= DROPDOWN =================
function toggleDropdown(menuId, btn) {
  const menu  = document.getElementById(menuId);
  const arrow = btn.querySelector(".arrowdropdown");

  document.querySelectorAll(".dropdown-menu").forEach(m => {
    if (m !== menu) m.classList.remove("show");
  });

  document.querySelectorAll(".arrowdropdown").forEach(a => {
    if (a !== arrow) a.classList.remove("rotate");
  });

  menu.classList.toggle("show");
  arrow.classList.toggle("rotate");
}

// ================= FILTER ROLE =================
function filterRole(role) {
  document.getElementById("selectedRole").innerText =
    role === "all" ? "All" : role;

  const cards = document.querySelectorAll(".user-card");

  cards.forEach(card => {
    card.style.display =
      role === "all" || card.classList.contains(role)
        ? "flex"
        : "none";
  });

  document.getElementById("dropdownMenu").classList.remove("show");
  document.querySelectorAll(".arrowdropdown").forEach(a => {
    a.classList.remove("rotate");
  });
}

// ================= CLICK OUTSIDE =================
document.addEventListener("click", e => {
  if (!e.target.closest('.role-dropdown')) {
    document.querySelectorAll(".dropdown-menu").forEach(menu => {
      menu.classList.remove("show");
    });
    document.querySelectorAll(".arrowdropdown").forEach(arrow => {
      arrow.classList.remove("rotate");
    });
  }
});

// ================= SYNC users → allUsers =================
function syncUsersToAllUsers() {
  const users  = JSON.parse(localStorage.getItem("users"))    || [];
  let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

  const staffRoles = ["doctor", "staff"];
  let changed = false;

  // ถ้ายังไม่มีข้อมูลเลย → inject mock ครั้งเดียวตรงนี้ ไม่ใช่ใน renderUsers
  if (allUsers.length === 0 && users.filter(u => staffRoles.includes(u.role?.toLowerCase())).length === 0) {
    allUsers = [
      { name: "นพ.สมชาย ศรีสุข",     role: "Doctor", dept: "จิตเวช",                        img: "../../img/doctor_img1.png", type: "doctor", phone: "091-888-2321" },
      { name: "น.ส. ศิริพร แสงทอง",   role: "Staff",  dept: "พยาบาล",                        img: "../../img/staff_img1.png",  type: "staff",  phone: "092-888-2322" },
      { name: "พญ.วราภรณ์ ศิริชัย",   role: "Doctor", dept: "ศัลยกรรม",                      img: "../../img/doctor_img2.png", type: "doctor", phone: "093-888-2323" },
      { name: "นพ.นนทพัทธ์ ใจดี",     role: "Doctor", dept: "หู คอ จมูก",                    img: "../../img/doctor_img3.png", type: "doctor", phone: "094-888-2324" },
      { name: "น.ส. พรทิพย์ จิตดี",   role: "Staff",  dept: "เจ้าหน้าที่การเงิน",            img: "../../img/staff_img2.png",  type: "staff",  phone: "095-888-2325" },
      { name: "พญ.ชลธิชา คำดี",       role: "Doctor", dept: "หู คอ จมูก",                    img: "../../img/doctor_img4.png", type: "doctor", phone: "096-888-2326" },
      { name: "น.ส. นันทิชา กอดเสา",  role: "Staff",  dept: "เจ้าหน้าที่เวชระเบียน",        img: "../../img/staff_img3.png",  type: "staff",  phone: "097-888-2327" },
      { name: "นพ.อัครพล ศรีนวล",     role: "Doctor", dept: "อายุรกรรม",                     img: "../../img/doctor_img5.png", type: "doctor", phone: "098-888-2328" },
      { name: "น.ส. ก้านแก้ว พงศ์ดี", role: "Staff",  dept: "เจ้าหน้าที่ลงทะเบียนผู้ป่วย",  img: "../../img/staff_img4.png",  type: "staff",  phone: "099-888-2329" }
    ];
    allUsers = allUsers.map((u, i) => ({ ...u, index: i }));
    localStorage.setItem("allUsers", JSON.stringify(allUsers));
    return allUsers;
  }

  // merge รายการใหม่จาก users
  users.forEach(u => {
    if (!staffRoles.includes(u.role?.toLowerCase())) return;

    const exists = allUsers.some(
      a => a.userId === u.id || a.email === u.email
    );

    if (!exists) {
      allUsers.push({
        name:      u.fullname || `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.name,
        role:      u.role,
        dept:      "",
        expertise: "",
        img:       u.profileImage || "../../img/profile.jpg",
        type:      u.role.toLowerCase(),
        phone:     u.phone || "",
        email:     u.email || "",
        userId:    u.id,
      });
      changed = true;
    }
  });

  if (changed) {
    allUsers = allUsers.map((u, i) => ({ ...u, index: i }));
    localStorage.setItem("allUsers", JSON.stringify(allUsers));
  }

  return allUsers;
}

// ================= DATA =================
// sync ครั้งเดียวตอน script โหลด — ก่อน DOMContentLoaded
let users = syncUsersToAllUsers();

// ================= UPDATE SUMMARY CARDS =================
function updateSummary() {
  const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

  const doctorCount = allUsers.filter(u => u.type === "doctor").length;
  const staffCount  = allUsers.filter(u => u.type === "staff").length;

  const elDoc   = document.getElementById("countDoctor");
  const elStaff = document.getElementById("countStaff");

  if (elDoc)   elDoc.textContent   = `${doctorCount} Users`;
  if (elStaff) elStaff.textContent = `${staffCount} Users`;
}

// ================= RENDER =================
function renderUsers() {
  const userGrid = document.getElementById("userGrid");
  if (!userGrid) return;

  // โหลดจาก localStorage — sync เสร็จแล้วก่อนถึงบรรทัดนี้
  users = JSON.parse(localStorage.getItem("allUsers")) || [];

  updateSummary();

  userGrid.innerHTML = users.map((user, index) => {
    const deptText = user.dept
      ? user.dept
      : `<span style="color:#E24B4A;font-size:12px;">ยังไม่มีแผนก — กรุณาตั้งค่า</span>`;

    return `
      <div class="user-card ${user.type}">
          <img src="${user.img}" class="user-img" onerror="this.src='../../img/profile.jpg'">
          <div class="user-info">
              <span class="badge ${user.type}">${user.role}</span>
              <div class="text-content">
                  <h4>${user.name}</h4>
                  <p>${deptText}</p>
              </div>
          </div>
          <div class="edit-btn" onclick="goToEditPage(${index})">✎</div>
      </div>
    `;
  }).join("");

  requestAnimationFrame(() => userGrid.classList.add("ready"));
}

// render ครั้งเดียวหลัง DOM พร้อม — ไม่มี requestAnimationFrame ซ้อนอีกชั้น
document.addEventListener("DOMContentLoaded", () => {
  renderUsers();

  const searchInput = document.querySelector(".search");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchUsers(this.value);
    });
  }
});

// ================= EDIT =================
function goToEditPage(index) {
  const allUsers     = JSON.parse(localStorage.getItem("allUsers")) || [];
  const selectedUser = allUsers[index];
  if (!selectedUser) return;

  localStorage.setItem("editUser", JSON.stringify({
    ...selectedUser,
    index: index
  }));

  if (selectedUser.type === "doctor") {
    window.location.href = "Doctor_Edit_Add.html";
  } else {
    window.location.href = "Staff_Edit_Add.html";
  }
}