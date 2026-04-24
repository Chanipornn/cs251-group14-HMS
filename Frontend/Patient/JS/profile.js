// =========================
// DEFAULT AVATAR (SVG inline)
// =========================
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e0dff7'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%237b6ee6'/%3E%3Cellipse cx='50' cy='85' rx='28' ry='20' fill='%237b6ee6'/%3E%3C/svg%3E";

// =========================
// MOCK DATA (ถ้ายังไม่มี user)
// =========================
(function ensureMockUser() {
  const existing = localStorage.getItem("currentUser");
  if (existing) return;

  const mockUser = {
    username: "Rose",
    email: "Rose@gmail.com",
    fullname: "กุหลาบ ใจดี",
    firstname: "กุหลาบ",
    lastname: "ใจดี",
    phone: "0812345678",
    idcard: "1234567890123",
    gender: "female",
    birth: "1-1-2000",
    address: "กรุงเทพ",
    blood: "O",
    disease: "ไม่มี",
    allergy: "",
    weight: "50",
    height: "160",
    right: "สิทธิบัตรทอง",
    role: "Patient",
    status: "active",
    profileImage: ""
  };

  localStorage.setItem("currentUser", JSON.stringify(mockUser));
  localStorage.setItem("users", JSON.stringify([mockUser]));
})();

// =========================
// MAIN
// =========================
document.addEventListener("DOMContentLoaded", function () {
  let user = JSON.parse(localStorage.getItem("currentUser")) || {};

  const img = document.getElementById("profileImage");
  const upload = document.getElementById("imageUpload");

  // =========================
  // LOAD IMAGE
  // =========================
  if (img) {
    img.src =
      user.profileImage && user.profileImage !== ""
        ? user.profileImage
        : DEFAULT_AVATAR;

    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      if (upload) upload.click();
    });
  }

  // =========================
  // CHANGE IMAGE
  // =========================
  if (upload) {
    upload.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;

      // เช็คว่าเป็นรูปจริง
      if (!file.type.startsWith("image/")) {
        alert("กรุณาเลือกรูปภาพ");
        return;
      }

      const reader = new FileReader();

      reader.onload = function (event) {
        const imageData = event.target.result;

        // เปลี่ยนรูปทันที
        if (img) img.src = imageData;

        // update currentUser
        user.profileImage = imageData;
        localStorage.setItem("currentUser", JSON.stringify(user));

        // sync users
        let users = JSON.parse(localStorage.getItem("users")) || [];

        const index = users.findIndex(u => u.email === user.email);

        if (index !== -1) {
          users[index].profileImage = imageData;
        } else {
          users.push(user);
        }

        localStorage.setItem("users", JSON.stringify(users));
      };

      reader.readAsDataURL(file);
    });
  }

  // =========================
  // TEXT DATA
  // =========================
  setText("profileName", user.username);
  setText("profileEmail", user.email);

  const fullname =
    user.fullname ||
    `${user.firstname || ""} ${user.lastname || ""}`.trim();
  setText("fullname", fullname);

  setText("idcard", user.idcard);
  setText("gender", formatGender(user.gender));
  setText("phone", user.phone);
  setText("address", user.address);

  // birth
  if (user.birth) {
    const parts = user.birth.split("-");
    setText(
      "birth",
      parts.length === 3
        ? `${parts[0]}/${parts[1]}/${parts[2]}`
        : user.birth
    );
  } else {
    setText("birth", "-");
  }

  setText("blood", user.blood);
  setText("disease", user.disease);
  setText("allergy", user.allergy || "ไม่มี");
  setText("weight", user.weight ? `${user.weight} กก.` : "-");
  setText("height", user.height ? `${user.height} ซม.` : "-");
  setText("right", user.right);

  setText("userRole", user.role || "Patient");
  setText("userStatus", user.status || "active");
});

// =========================
// HELPER
// =========================
function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerText =
    value !== undefined && value !== null && value !== "" ? value : "-";
}

function formatGender(gender) {
  if (!gender) return "-";
  if (gender === "male") return "ผู้ชาย";
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