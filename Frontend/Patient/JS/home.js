// =========================
// LOAD USER DATA
// =========================
document.addEventListener("DOMContentLoaded", () => {

 // ===== LOAD USER =====
 const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    window.location.href = "../../login.html";
    return;
  }

  console.log("USER:", user);

 // ===== LOAD PROFILE FROM BACKEND =====
 if (user && user.patientId) {
    fetch(`http://localhost:8080/api/patients/${user.patientId}`)
      .then(res => res.json())
      .then(data => {
        console.log("PATIENT:", data);

        const fullNameEl = document.getElementById("fullname");

        if (fullNameEl) {
          fullNameEl.innerText = data.name + " " + data.surname;
        }
      })
      .catch(err => console.error("Fetch error:", err));
  }

  // ===== USERNAME (มุมขวา) =====
  const usernameEl = document.querySelector(".user-name");
  if (usernameEl) {
    usernameEl.innerText = user.name || "Guest";
  }

 
// ===== PROFILE IMAGE =====
const profileImg = document.getElementById("profileImage");
const savedImage = user?.profileImage

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

}

);