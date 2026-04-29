// =========================
// DEFAULT AVATAR
// =========================
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e0dff7'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%237b6ee6'/%3E%3Cellipse cx='50' cy='85' rx='28' ry='20' fill='%237b6ee6'/%3E%3C/svg%3E";

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
    img.src = user.profileImage && user.profileImage !== ""
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

      if (!file.type.startsWith("image/")) {
        alert("กรุณาเลือกรูปภาพ");
        return;
      }

      const reader = new FileReader();

      reader.onload = function (event) {
        const imageData = event.target.result;

        // แสดงรูปทันที
        if (img) img.src = imageData;

        // update currentUser
        user.profileImage = imageData;
        localStorage.setItem("currentUser", JSON.stringify(user));

        // sync users
        let users = JSON.parse(localStorage.getItem("users")) || [];

        const index = users.findIndex(u => u.email === user.email);

        if (index !== -1) {
          users[index].profileImage = imageData;
        } else if (user.email) {
          users.push(user);
        }

        localStorage.setItem("users", JSON.stringify(users));
      };

      reader.readAsDataURL(file);
    });
  }

  loadProfileFromAPI();
  
});


// =========================
// HELPER
// =========================
function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerText =
    value !== undefined && value !== null && value !== ""
      ? value
      : "-";
}

function formatGender(gender) {
  if (gender === "M") return "ผู้ชาย";
  if (gender === "F") return "ผู้หญิง";
  return "-";
}

function formatDate(date) {
  if (!date) return "-";
  const [d, m, y] = date.split("-");
  return `${d}/${m}/${y}`;
}

// =========================
// LOAD PROFILE FROM API
// =========================
async function loadProfileFromAPI() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user || !user.patientId) {
    console.error("No patientId");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/patients/${user.patientId}`);
    const data = await res.json();

    console.log("PATIENT:", data);

    // ใช้ fullName จาก backend
    setText("profileName", data.fullName);
    setText("fullname", data.fullName);

    setText("idcard", data.thaiNationalId);
    setText("gender", formatGender(data.gender));
    setText("phone", data.telephone);
    setText("address", data.address);

    setText("birth", formatDate(data.dateOfBirth));

    setText("blood", data.bloodType);
    setText("disease", data.chronicIllness);
    setText("allergy", data.drugAllergy || "ไม่มี");
    setText("weight", data.weight ? data.weight + " กก." : "-");
    setText("height", data.height ? data.height + " ซม." : "-");
    setText("right", data.rightToHealthcare);

  } catch (err) {
    console.error("โหลดข้อมูลไม่สำเร็จ", err);
  }
}

async function loadUser() {
  const userId = localStorage.getItem("userId");

  if (!userId) return;

  const res = await fetch(`http://localhost:8080/api/users/${userId}`);
  const data = await res.json();

  setText("profileEmail", data.email);
}
loadUser();


// =========================
// LOGOUT
// =========================
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "../../login.html";
}