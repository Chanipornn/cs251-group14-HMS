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
  
    // =========================
    // MODAL STATE
    // =========================
    let currentField = null;
  
    // =========================
    // EDIT (เปิด modal)
    // =========================
    window.editField = function(field) {
  
      currentField = field;
  
      const input = document.getElementById("editInput");
      input.value = currentUser[field] || "";
  
      document.getElementById("editModal").classList.add("show");
    };
  
    // =========================
    // CLOSE MODAL
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
  
      // validate phone
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
      const index = users.findIndex(u => u.id === currentUser.id);
  
      if (index !== -1) {
        users[index] = currentUser;
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