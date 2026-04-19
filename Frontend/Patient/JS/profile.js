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
  
    // แสดงข้อมูล
    document.getElementById("profileName").innerText = user.username || "-";
    document.getElementById("profileEmail").innerText = user.email || "-";
  
    document.getElementById("fullname").innerText =
      (user.firstname || "-") + " " + (user.lastname || "");
  
    document.getElementById("phone").innerText = user.phone || "-";
    document.getElementById("idcard").innerText = user.idcard || "-";
    document.getElementById("gender").innerText = user.gender || "-";
  
    // วันเกิด (รวม DD/MM/YYYY)
    if (user.day && user.month && user.year) {
      document.getElementById("birth").innerText =
        user.day + "/" + user.month + "/" + user.year;
    } else {
      document.getElementById("birth").innerText = "-";
    }
  
  });