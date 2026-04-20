// โหลดรูปจาก localStorage ตอนเปิดหน้า
document.addEventListener("DOMContentLoaded", function () {
    const savedImage = localStorage.getItem("profileImage");
  
    if (savedImage) {
      document.getElementById("profileImage").src = savedImage;
    }
  });
  
  // กดที่รูป → เปิดเลือกไฟล์
  document.getElementById("profileImage").addEventListener("click", function () {
    document.getElementById("imageUpload").click();
  });
  
  // เมื่อเลือกรูป
  document.getElementById("imageUpload").addEventListener("change", function (e) {
    const file = e.target.files[0];
  
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = function (event) {
      const imageData = event.target.result;
  
      // แสดงรูป
      document.getElementById("profileImage").src = imageData;
  
      // เก็บลง localStorage
      localStorage.setItem("profileImage", imageData);
    };
  
    reader.readAsDataURL(file);
  });

  function logout() {
    // ลบข้อมูล session / user
    localStorage.clear();
  
    // เด้งไปหน้า login
    window.location.href = "../../login.html";
  }

  document.addEventListener("DOMContentLoaded", function () {

    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;
  
    const img = document.getElementById("profileImage");
  
    // =========================
    // LOAD IMAGE
    // =========================
    img.src = user.profileImage && user.profileImage !== ""
      ? user.profileImage
      : "../../img/profile.png";
  
    // =========================
    // CLICK → UPLOAD
    // =========================
    img.addEventListener("click", function () {
      document.getElementById("imageUpload").click();
    });
  
    // =========================
    // CHANGE IMAGE
    // =========================
    document.getElementById("imageUpload").addEventListener("change", function (e) {
  
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
  
      reader.onload = function (event) {
        const imageData = event.target.result;
  
        // เปลี่ยนรูปทันที
        img.src = imageData;
  
        // =========================
        // UPDATE currentUser
        // =========================
        user.profileImage = imageData;
        localStorage.setItem("currentUser", JSON.stringify(user));
  
        // =========================
        // UPDATE users (สำคัญมาก)
        // =========================
        let users = JSON.parse(localStorage.getItem("users")) || [];
  
        users = users.map(u => {
          if (u.username === user.username) {
            return user;
          }
          return u;
        });
  
        localStorage.setItem("users", JSON.stringify(users));
      };
  
      reader.readAsDataURL(file);
    });
  
    // =========================
    // TEXT DATA
    // =========================
    document.getElementById("profileName").innerText = user.username || "-";
    document.getElementById("profileEmail").innerText = user.email || "-";
  
    document.getElementById("fullname").innerText =
      (user.firstname || "-") + " " + (user.lastname || "");
  
    document.getElementById("phone").innerText = user.phone || "-";
    document.getElementById("idcard").innerText = user.idcard || "-";
    document.getElementById("gender").innerText = user.gender || "-";
  
    // วันเกิด
    if (user.day && user.month && user.year) {
      document.getElementById("birth").innerText =
        user.day + "/" + user.month + "/" + user.year;
    } else {
      document.getElementById("birth").innerText = "-";
    }
  
  });
  
  
  // =========================
  // LOGOUT
  // =========================
  function logout() {
    localStorage.clear();
    window.location.href = "../../login.html";
  }