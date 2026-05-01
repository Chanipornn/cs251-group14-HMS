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
    // 🔥 redirect ไปหน้าคิวของคุณ
    window.location.href = "./CheckQueue.html";
}

// ปิด modal เมื่อคลิกพื้นหลัง
window.onclick = function (event) {
    const modal = document.getElementById("successModal");
    if (event.target === modal) {
        closeModal();
    }
};

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
// 🎯 Helper Functions สำหรับแปลงวันที่และเวลา
// ==========================
function formatTime(timeStr) {
    let [h, m] = timeStr.replace(" น.", "").split(":");
    h = h.padStart(2, "0");
    return `${h}:${m}:00`; // 🌟 เติม :00 ให้ Spring Boot อ่านง่าย
}

function formatToISO(fullDate) {
    const parts = fullDate.split(" ");
    const day = parts[0].padStart(2, "0");
    const months = {
        "มกราคม": "01", "กุมภาพันธ์": "02", "มีนาคม": "03", "เมษายน": "04",
        "พฤษภาคม": "05", "มิถุนายน": "06", "กรกฎาคม": "07", "สิงหาคม": "08",
        "กันยายน": "09", "ตุลาคม": "10", "พฤศจิกายน": "11", "ธันวาคม": "12"
    };
    const month = months[parts[1]];
    const year = parts[2];
    return `${year}-${month}-${day}`;
}

// ==========================
// 🎯 INIT เมื่อหน้าโหลด
// ==========================
document.addEventListener("DOMContentLoaded", () => {

    // 1. โหลดข้อมูลหมอจาก LocalStorage
    const data = JSON.parse(localStorage.getItem("selectedDoctor"));
    if (data) {
        // เช็คเผื่อชื่อ key ตอนคุณเก็บมาไม่ตรงกัน
        document.getElementById("doctorName").textContent = data.name || data.doctorName;
        document.getElementById("doctorDept").textContent = data.dept || data.departmentName;
        if(data.img) document.getElementById("doctorImg").src = data.img;
    }

    // 2. เลือกเวลา
    document.querySelectorAll(".time-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    // 3. จัดการตอนกดจอง
    document.querySelector(".btn-submit").addEventListener("click", async () => {

        const doctorData = JSON.parse(localStorage.getItem("selectedDoctor"));
        const selectedDateEl = document.querySelector(".date-item.active");
        const selectedTimeEl = document.querySelector(".time-btn.active");
        const selectedReasonEl = document.querySelector("input[name='reason']:checked");
        const otherReason = document.querySelector(".input-line")?.value || "";

        // เช็คการกรอกข้อมูล
        if (!doctorData) { alert("ไม่พบข้อมูลแพทย์"); return; }
        if (!selectedDateEl) { alert("กรุณาเลือกวันที่"); return; }
        if (!selectedTimeEl) { alert("กรุณาเลือกเวลา"); return; }

        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user || !user.patientId) {
            alert("กรุณาล็อคอินเข้าสู่ระบบก่อนจองคิว");
            return;
        }

<<<<<<< HEAD
        const dayNum = selectedDateEl.childNodes[0].textContent.trim();
        const monthYear = document.querySelector(".section-title span").innerText;
        const fullDate = `${dayNum} ${monthYear}`;
=======
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


    const reason = selectedReasonEl
  ? selectedReasonEl.value
  : otherReason;

  const bookingData = {
    patientId: Number(patientId),
    doctorId: doctorData.id,
    date: formatToISO(fullDate),
    time: formatTime(selectedTimeEl.innerText),
    reason: reason,
    preparation: "กรุณามาก่อน 15 นาที"
};

    console.log("BOOKING DATA:", bookingData);
    console.log("DOCTOR:", doctorData);
    console.log("USER:", user);

   	await fetch(`http://localhost:8080/api/appointments/patients/${user.patientId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData)

})
/*
await fetch("http://localhost:8080/api/appointments", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(bookingData)
})
*/
.then(async res => {
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "จองคิวไม่สำเร็จ");
    }

    return data;
})

.then(data => {
    console.log("SUCCESS:", data);
     showModal();
    //alert(`จองคิวสำเร็จ! คิวที่ ${data.queueNumber}`);
})

.catch(err => {
    console.error(err);
    alert(err.message);
});

 if (!data || data.length === 0) {
    container.innerHTML = "ไม่มีคิว";
    return;
}

/*
    const bookingData = {
        appointmentDate: formatToISO(fullDate),
        appointmentTime: selectedTimeEl.innerText.replace(" น.", ""),
        reason: reason,
        preparation: "กรุณามาก่อน 15 นาที",
        doctor: { doctorId: doctorData.doctorId },
        patient: { patientId: Number(patientId) }
    };
   */
   
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
/*
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
        */
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
>>>>>>> b5b6441b82e53da81bdff7c11126a12a8b8bb2ab
        
        const reason = selectedReasonEl ? selectedReasonEl.value : otherReason;

        // 🌟 จัด Payload ให้ตรงกับ AppointmentRequestDTO แบบเป๊ะๆ
        const bookingData = {
            patientId: Number(user.patientId),
            doctorId: Number(doctorData.id || doctorData.doctorId), // ดักไว้ให้ เผื่อตอนคุณ Set Item ใช้ชื่อต่างกัน
            date: formatToISO(fullDate),
            time: formatTime(selectedTimeEl.innerText),
            reason: reason || "ไม่มีเหตุผลระบุ",
            preparation: "กรุณามาก่อน 15 นาที"
        };

        console.log("กำลังส่งข้อมูล:", bookingData);

        try {
            // 🌟 แก้ URL ให้ถูกต้อง ไม่ต้องมี ID ต่อท้าย และส่งเป็น POST
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData)
            });

            if (res.ok) {
                // จองสำเร็จ โชว์ Modal 
                showModal();
            } else {
                const err = await res.text();
                alert("ไม่สามารถจองคิวได้: " + err);
            }

        } catch (err) {
            console.error("เกิดข้อผิดพลาด:", err);
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        }
    });

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