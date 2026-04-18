document.addEventListener("DOMContentLoaded", function () {

  const roleInput = document.getElementById("role");
  const roleButtons = document.querySelectorAll(".role-btn");

  const patientForm = document.getElementById("patientForm");
  const accountForm = document.getElementById("accountForm");
  const subtitle = document.getElementById("formSubtitle");

  // =========================
  // SWITCH ROLE
  // =========================
  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      roleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const role = btn.dataset.role;
      roleInput.value = role;

      if (role === "patient") {
        patientForm.style.display = "block";
        accountForm.style.display = "none";
        subtitle.innerText = "สำหรับ Patient";
      } else {
        patientForm.style.display = "none";
        accountForm.style.display = "block";
        subtitle.innerText = "สำหรับ Admin / Doctor / Staff";
      }
    });
  });

  // =========================
  // SUBMIT
  // =========================
  document.getElementById("createForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const role = roleInput.value;

    const user = {
      name: document.getElementById("name")?.value || "",
      email: document.getElementById("email")?.value || "",
      role: role,
      status: "active"
    };

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    alert("สร้างสำเร็จ 🎉");

    window.location.href = "User_Dashboard.html";
  });

});

function goBack() {
  window.location.href = "User_Dashboard.html";
}

function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("hide");
}

function logout() {
  localStorage.clear();
  window.location.href = "../../login.html";
}