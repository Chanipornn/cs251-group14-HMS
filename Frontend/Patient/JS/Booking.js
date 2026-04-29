// ==========================
// 🎯 Dropdown
// ==========================
function toggleDropdown() {
    const list = document.getElementById('drop-list');
    const icon = document.getElementById('drop-icon');

    if (list.style.display === "none" || list.style.display === "") {
        list.style.display = "flex";
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        list.style.display = "none";
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

// ==========================
// 🎯 Modal
// ==========================
function showModal() {
    document.getElementById("successModal").style.display = "flex";
}

function closeModal() {
    // 🔥 redirect ไปหน้าคิว
    window.location.href = "./Appointments.html"; 
}

// ==========================
// 🎯 วันที่ (เลื่อนเดือน)
// ==========================
let currentDate = new Date();

function renderDates() {
    const container = document.querySelector(".date-scroll");
    container.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
        "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
    ];

    document.querySelector(".section-title span").innerText =
        `${monthNames[month]} ${year}`;

    for (let i = 1; i <= 7; i++) {
        const date = new Date(year, month, i);

        const div = document.createElement("div");
        div.className = "date-item";
        div.innerHTML = `
            ${date.getDate()}
            <span>${date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
        `;

        div.addEventListener("click", () => {
            document.querySelectorAll(".date-item").forEach(d => d.classList.remove("active"));
            div.classList.add("active");
        });

        container.appendChild(div);
    }

    container.firstChild.classList.add("active");
}

// ==========================
// 🎯 INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {

    // โหลดข้อมูลหมอ
    const data = JSON.parse(localStorage.getItem("selectedDoctor"));
    if (data) {
        document.getElementById("doctorName").textContent = data.name;
        document.getElementById("doctorDept").textContent = data.dept;
        document.getElementById("doctorImg").src = data.img;
    }

    // เลือกเวลา
    document.querySelectorAll(".time-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    
// กดจอง
document.querySelector(".btn-submit").addEventListener("click", async () => {

    const doctorData = JSON.parse(localStorage.getItem("selectedDoctor"));
    const selectedDateEl = document.querySelector(".date-item.active");
    const selectedTimeEl = document.querySelector(".time-btn.active");
    const selectedReasonEl = document.querySelector("input[name='reason']:checked");
    const otherReason = document.querySelector(".input-line")?.value || "";

    // 1. เปลี่ยนจาก alert เป็นการเช็คเงื่อนไขเงียบๆ หรือเปลี่ยนสีช่องที่ยังไม่เลือก (ถ้าต้องการ)
    /*if (!doctorData || !selectedDateEl || !selectedTimeEl) {
        // แทนที่จะ alert("กรุณาเลือกข้อมูลให้ครบ"); 
        // อาจจะทำ Effect สั่นที่ปุ่ม หรือแสดง Text เล็กๆ สีแดงแทน
        return; 
    }
    */

   if (!doctorData) {
    console.log("❌ ไม่มี doctor");
    return;
    }

    if (!selectedDateEl) {
    console.log("❌ ไม่ได้เลือกวัน");
    return;
    }

    if (!selectedTimeEl) {
    console.log("❌ ไม่ได้เลือกเวลา");
    return;
    }

    const dayNum = selectedDateEl.childNodes[0].textContent.trim();
    const monthYear = document.querySelector(".section-title span").innerText;
    const fullDate = `${dayNum} ${monthYear}`;

    //const patientId = localStorage.getItem("patientId");
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user || !user.patientId) {
        console.error("❌ ไม่มี patientId");
    return;
    }

    const patientId = user.patientId;

    const bookingData = {
        appointmentDate: formatToISO(fullDate),
        appointmentTime: selectedTimeEl.innerText.replace(" น.", ""),
        reason: selectedReasonEl ? selectedReasonEl.parentElement.innerText.trim() : "",
        preparation: "กรุณามาก่อน 15 นาที",
        doctor: { doctorId: doctorData.id },
        patient: { patientId: Number(patientId) }
    };
    console.log("BOOKING DATA:", bookingData);
    /*
    const bookingData = {
        type: "upcoming",
        doctor: doctorData.name,
        dept: doctorData.dept,
        date: fullDate,
        time: selectedTimeEl.innerText,
        reason: selectedReasonEl ? selectedReasonEl.parentElement.innerText.trim() : otherReason,
        prepare: "กรุณาเตรียมบัตรประชาชนและมาถึงก่อนเวลานัด 15 นาที",
        status: "pending"
    };
    */

     try {
        await fetch("http://localhost:8080/api/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData)
        });

        showModal();

    } catch (err) {
         console.error("❌ ERROR:", err);
        alert("จองไม่สำเร็จ");
    }
    /*
    try {
        await fetch("/api/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData)
        });

        // บันทึกลง LocalStorage
        const localList = JSON.parse(localStorage.getItem("appointments")) || [];
        localList.push(bookingData);
        localStorage.setItem("appointments", JSON.stringify(localList));

        // 2. 🔥 แทนที่จะ redirect ทันที ให้เรียกใช้ฟังก์ชันโชว์ Modal ที่คุณเขียนไว้
        showModal(); 

    } catch (err) {
        console.error("Backend Error:", err);
        
        // แม้แบคเอนด์จะ Error (ในเคสทดสอบ) เราก็บันทึก Local และโชว์ Modal ได้เลย
        const localList = JSON.parse(localStorage.getItem("appointments")) || [];
        localList.push(bookingData);
        localStorage.setItem("appointments", JSON.stringify(localList));
        
        showModal(); 
    }
        */
});

// ฟังก์ชันโชว์ Modal (ตรวจสอบว่าในไฟล์มีฟังก์ชันนี้แล้ว)
function showModal() {
    document.getElementById("successModal").style.display = "flex";
}

// ฟังก์ชันปิด Modal และ Redirect (เมื่อกดยืนยันใน Modal)
function closeModal() {
    window.location.href = "./Appointments.html"; 
}

    // ลูกศรเดือน
    document.querySelector(".fa-chevron-left").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderDates();
    });

    document.querySelector(".fa-chevron-right").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderDates();
    });

    renderDates();
});

// ปิด modal เมื่อคลิกพื้นหลัง
window.onclick = function (event) {
    const modal = document.getElementById("successModal");
    if (event.target === modal) {
        closeModal();
    }
};

function goHome() {
    window.location.href = "./Home.html"; // ❗ เปลี่ยน path ให้ตรงโปรเจคคุณ
}


function formatToISO(fullDate) {
    // "1 เมษายน 2026"
    const parts = fullDate.split(" ");
    const day = parts[0].padStart(2, "0");

    const months = {
        "มกราคม": "01",
        "กุมภาพันธ์": "02",
        "มีนาคม": "03",
        "เมษายน": "04",
        "พฤษภาคม": "05",
        "มิถุนายน": "06",
        "กรกฎาคม": "07",
        "สิงหาคม": "08",
        "กันยายน": "09",
        "ตุลาคม": "10",
        "พฤศจิกายน": "11",
        "ธันวาคม": "12"
    };

    const month = months[parts[1]];
    const year = parts[2];

    return `${year}-${month}-${day}`;
}