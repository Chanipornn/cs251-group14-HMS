// =========================
// DEFAULT AVATAR (SVG inline — ใช้เมื่อไม่มีรูปโปรไฟล์)
// =========================
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e0dff7'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%237b6ee6'/%3E%3Cellipse cx='50' cy='85' rx='28' ry='20' fill='%237b6ee6'/%3E%3C/svg%3E";

document.addEventListener("DOMContentLoaded", function () {

  let user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    // ถ้าไม่มี currentUser ให้กลับหน้า login
    window.location.href = "../../login.html";
    return;
  }

  const img    = document.getElementById("profileImage");
  const upload = document.getElementById("imageUpload");

  // =========================
  // LOAD PROFILE IMAGE
  // ถ้าไม่มีรูปหรือเป็น "" ให้ใช้ DEFAULT_AVATAR (SVG icon)
  // =========================
  if (img) {
    img.src = (user.profileImage && user.profileImage !== "")
      ? user.profileImage
      : DEFAULT_AVATAR;

    // คลิกรูปเพื่อเปลี่ยน
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      if (upload) upload.click();
    });
  }

  // =========================
  // CHANGE PROFILE IMAGE
  // =========================
  if (upload) {
    upload.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = function (event) {
        const imageData = event.target.result;

        // อัปเดตรูปในหน้า
        if (img) img.src = imageData;

        // อัปเดต currentUser
        user.profileImage = imageData;
        localStorage.setItem("currentUser", JSON.stringify(user));

        // sync กลับไปใน users array (ใช้ email เป็น key)
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users = users.map(u =>
          u.email === user.email
            ? { ...u, profileImage: imageData }
            : u
        );
        localStorage.setItem("users", JSON.stringify(users));
      };

      reader.readAsDataURL(file);
    });
  }

  // =========================
  // TEXT DATA — ดึงจากข้อมูลตอนสมัครจริงๆ
  // =========================

  // ข้อมูลบัญชี
  setText("profileName",  user.username);
  setText("profileEmail", user.email);

  // ชื่อ-นามสกุลเต็ม
  // รองรับทั้ง fullname (จาก register), firstname+lastname, firstName+lastName
  const fullname = user.fullname
    || `${user.firstname || user.firstName || ""} ${user.lastname || user.lastName || ""}`.trim();
  setText("fullname", fullname);

  // ข้อมูลส่วนตัว
  setText("idcard",  user.idcard);
  setText("gender",  formatGender(user.gender));
  setText("phone",   user.phone);
  setText("address", user.address);

  // วันเกิด (เก็บเป็น "day-month-year" ตอนสมัคร)
  if (user.birth) {
    const parts = user.birth.split("-");
    setText("birth", parts.length === 3
      ? `${parts[0]}/${parts[1]}/${parts[2]}`
      : user.birth
    );
  } else {
    setText("birth", "-");
  }

  // ข้อมูลสุขภาพ
  setText("blood",   user.blood);
  setText("disease", user.disease);
  setText("allergy", user.allergy && user.allergy !== "" ? user.allergy : "ไม่มี");
  setText("weight",  user.weight  ? `${user.weight} กก.`  : "-");
  setText("height",  user.height  ? `${user.height} ซม.`  : "-");
  setText("right",   user.right);

  // role / สถานะ (แสดงถ้ามี element)
  setText("userRole",   user.role   || "Patient");
  setText("userStatus", user.status || "active");

});

// =========================
// HELPER: setText
// =========================
function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerText = (value !== undefined && value !== null && value !== "")
    ? value
    : "-";
}

// =========================
// HELPER: แปลง gender เป็นภาษาไทย
// =========================
function formatGender(gender) {
  if (!gender) return "-";
  if (gender === "male")   return "ผู้ชาย";
  if (gender === "female") return "ผู้หญิง";
  return gender;
}

// =========================
// LOGOUT
// =========================
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "../../login.html";
}