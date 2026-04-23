document.addEventListener("DOMContentLoaded", () => {

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    // =========================
    // MOCK DATA
    // =========================
    if (!currentUser) {
      currentUser = {
        id: 1,
        name: "Admin Test",
        email: "admin@test.com",
        firstName: "สมชาย",
        lastName: "ใจดี",
        phone: "0999999999",
        profileImage: "../../img/profile.jpg"
      };
  
      console.warn("ใช้ mock user");
    }
  
    // =========================
    // LOAD DATA
    // =========================
    setText("username", currentUser.name);
    setText("email", currentUser.email);
    setText("firstName", currentUser.firstName);
    setText("lastName", currentUser.lastName);
    setText("phone", currentUser.phone);
  
    // โหลดรูป
    const img = document.getElementById("profileImage");
    if (img && currentUser.profileImage) {
      img.src = currentUser.profileImage;
    }
  // =========================
// SYNC HEADER (ชื่อ + รูป)
// =========================
const headerName = document.getElementById("headerName");
const headerAvatar = document.getElementById("headerAvatar");

// ชื่อ
if (headerName) {
    headerName.innerText = currentUser.username || currentUser.name || "Admin";
  }

// รูป
if (headerAvatar) {
  if (currentUser.profileImage) {
    headerAvatar.style.backgroundImage = `url('${currentUser.profileImage}')`;
  } else {
    headerAvatar.style.backgroundImage = "url('../../img/profile.png')";
  }

  headerAvatar.style.backgroundSize = "cover";
  headerAvatar.style.backgroundPosition = "center";
}
    // =========================
    // IMAGE UPLOAD 
    // =========================
    const imageInput = document.getElementById("imageUpload");
  
    if (imageInput) {
      imageInput.addEventListener("change", function () {
  
        const file = this.files[0];
        console.log("เลือกไฟล์:", file);
  
        if (!file) return;
  
        if (!file.type.startsWith("image/")) {
          alert("กรุณาเลือกไฟล์รูปภาพ");
          return;
        }
  
        const reader = new FileReader();
  
        reader.onload = function (e) {
  
          const base64 = e.target.result;
          console.log("โหลดรูปสำเร็จ");
  
          const img = document.getElementById("profileImage");
  
          if (!img) {
            console.error("ไม่เจอ img profileImage");
            return;
          }
  
          // เปลี่ยนรูปทันที
          img.src = base64;
  
          // save ลง user
          currentUser.profileImage = base64;
  
          saveUser();
        };
  
        reader.readAsDataURL(file);
      });
    }
  
    // =========================
    // MODAL STATE
    // =========================
    let currentField = null;
  
    // =========================
    // EDIT
    // =========================
    window.editField = function(field) {
      currentField = field;
  
      const input = document.getElementById("editInput");
      input.value = currentUser[field] || "";
  
      document.getElementById("editModal").classList.add("show");
    };
  
    // =========================
    // CLOSE
    // =========================
    window.closeModal = function() {
      document.getElementById("editModal").classList.remove("show");
    };
  
    // =========================
    // SAVE EDIT
    // =========================
    window.saveEdit = function() {
  
      const input = document.getElementById("editInput");
      let value = input.value.trim();
  
      if (!value) return;
  
      if (currentField === "phone") {
        if (!/^[0-9]{9,10}$/.test(value)) {
          alert("เบอร์ไม่ถูกต้อง");
          return;
        }
      }
  
      currentUser[currentField] = value;
  
      setText(currentField, value);
  
      saveUser();
  
      closeModal();
    };
  
    // =========================
    // HELPER
    // =========================
    function setText(id, value) {
      const el = document.getElementById(id);
      if (el) el.innerText = value || "-";
    }
  
    function saveUser() {
        let users = JSON.parse(localStorage.getItem("users")) || [];
      
        const index = users.findIndex(u => u.id === currentUser.id);
      
        if (index !== -1) {
          users[index] = currentUser;
        } else {
          users.push(currentUser);
        }
      
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      }
  
  });
  
  
  // =========================
  // SIDEBAR
  // =========================
  function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("hide");
  }
  
  // =========================
  // LOGOUT
  // =========================
  function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "../../login.html";
  }
  
  // =========================
  // GO PROFILE
  // =========================
  function goProfile() {
    window.location.href = "profile.html";
  }