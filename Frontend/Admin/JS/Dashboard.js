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

// ================= DEFAULT AVATAR =================
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e0dff7'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%237b6ee6'/%3E%3Cellipse cx='50' cy='85' rx='28' ry='20' fill='%237b6ee6'/%3E%3C/svg%3E";

// ================= FIX BROKEN IMAGES IN LOCALSTORAGE =================
// วิ่งครั้งเดียวตอน script โหลด — แทน path รูปเสียด้วย DEFAULT_AVATAR
(function fixBrokenImages() {
  let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
  let changed = false;

  allUsers = allUsers.map(u => {
    if (!u.img || !u.img.startsWith("data:")) {
      changed = true;
      return { ...u, img: DEFAULT_AVATAR };
    }
    return u;
  });

  if (changed) localStorage.setItem("allUsers", JSON.stringify(allUsers));
})();

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

  if (allUsers.length === 0 && users.filter(u => staffRoles.includes(u.role?.toLowerCase())).length === 0) {
    allUsers = [
      { name: "นพ.สมชาย ศรีสุข",     role: "Doctor", dept: "จิตเวช",                        img: DEFAULT_AVATAR, type: "doctor", phone: "091-888-2321" },
      { name: "น.ส. ศิริพร แสงทอง",   role: "Staff",  dept: "พยาบาล",                        img: DEFAULT_AVATAR, type: "staff",  phone: "092-888-2322" },
      { name: "พญ.วราภรณ์ ศิริชัย",   role: "Doctor", dept: "ศัลยกรรม",                      img: DEFAULT_AVATAR, type: "doctor", phone: "093-888-2323" },
      { name: "นพ.นนทพัทธ์ ใจดี",     role: "Doctor", dept: "หู คอ จมูก",                    img: DEFAULT_AVATAR, type: "doctor", phone: "094-888-2324" },
      { name: "น.ส. พรทิพย์ จิตดี",   role: "Staff",  dept: "เจ้าหน้าที่การเงิน",            img: DEFAULT_AVATAR, type: "staff",  phone: "095-888-2325" },
      { name: "พญ.ชลธิชา คำดี",       role: "Doctor", dept: "หู คอ จมูก",                    img: DEFAULT_AVATAR, type: "doctor", phone: "096-888-2326" },
      { name: "น.ส. นันทิชา กอดเสา",  role: "Staff",  dept: "เจ้าหน้าที่เวชระเบียน",        img: DEFAULT_AVATAR, type: "staff",  phone: "097-888-2327" },
      { name: "นพ.อัครพล ศรีนวล",     role: "Doctor", dept: "อายุรกรรม",                     img: DEFAULT_AVATAR, type: "doctor", phone: "098-888-2328" },
      { name: "น.ส. ก้านแก้ว พงศ์ดี", role: "Staff",  dept: "เจ้าหน้าที่ลงทะเบียนผู้ป่วย",  img: DEFAULT_AVATAR, type: "staff",  phone: "099-888-2329" }
    ];
    allUsers = allUsers.map((u, i) => ({ ...u, index: i }));
    localStorage.setItem("allUsers", JSON.stringify(allUsers));
    return allUsers;
  }

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
        img:       u.profileImage || DEFAULT_AVATAR,
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

  users = JSON.parse(localStorage.getItem("allUsers")) || [];

  updateSummary();

  userGrid.innerHTML = users.map((user, index) => {
    const deptText = user.dept
      ? user.dept
      : `<span style="color:#E24B4A;font-size:12px;">ยังไม่มีแผนก — กรุณาตั้งค่า</span>`;

    const imgSrc = user.img || DEFAULT_AVATAR;

    return `
      <div class="user-card ${user.type}">
          <img src="${imgSrc}" class="user-img" onerror="this.onerror=null;this.src='${DEFAULT_AVATAR}'">
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