// =========================
// LOAD USER DATA
// =========================
document.addEventListener("DOMContentLoaded", () => {

 // ===== USERNAME =====
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const usernameEl = document.getElementById("username");

if (usernameEl) {
  usernameEl.textContent = currentUser?.username || "Guest";
}

// ===== PROFILE IMAGE =====
const profileImg = document.getElementById("profileImage");
const savedImage = currentUser?.profileImage || localStorage.getItem("profileImage");

if (profileImg && savedImage) {
  profileImg.src = savedImage;
}
  // =========================
  // BANNER SLIDER
  // =========================
  const slider = document.getElementById("bannerSlider");
  const dots = document.querySelectorAll(".dot");

  if (!slider) return; // กัน error ถ้าหน้านี้ไม่มี banner

  let index = 0;
  const total = slider.children.length;

  function updateSlider() {
    slider.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach(d => d.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
  }

  setInterval(() => {
    index = (index + 1) % total;
    updateSlider();
  }, 3000);

  // =========================
  // SWIPE (มือถือ)
  // =========================
  let startX = 0;

  slider.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    let diff = startX - endX;

    if (diff > 50) {
      index = (index + 1) % total;
    } else if (diff < -50) {
      index = (index - 1 + total) % total;
    }

    updateSlider();
  });

  // =========================
  // CLICK DOT
  // =========================
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      index = i;
      updateSlider();
    });
  });

});