// โหลดชื่อผู้ใช้จาก localStorage
document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
  
    const usernameEl = document.getElementById("username");
  
    if (usernameEl) {
      usernameEl.textContent = username || "Guest";
    }
  });