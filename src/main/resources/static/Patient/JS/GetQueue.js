// ================= DATA =================
let doctorsData = []; // เปลี่ยนชื่อตัวแปรให้ชัดเจนขึ้น

// 1. โหลดข้อมูลหมอเมื่อเปิดหน้า
window.onload = async function() {
    try {
        const response = await fetch('/api/doctors');
        if (response.ok) {
            doctorsData = await response.json();
            console.log("Doctors loaded:", doctorsData);
            renderDoctors(doctorsData);
        } else {
            console.error("ไม่สามารถโหลดข้อมูลแพทย์ได้");
        }
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลแพทย์:", error);
    }
};

// ================= RENDER =================
// 2. วาดการ์ดหมอ
function renderDoctors(doctors) {
    const grid = document.getElementById('doctorGrid');
    grid.innerHTML = ''; 

    if (doctors.length === 0) {
        grid.innerHTML = '<p style="text-align:center; padding:20px;">ไม่พบข้อมูลแพทย์</p>';
        return;
    }

    doctors.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'doctor-card';
        
        // เตรียมข้อมูลส่งไปที่ LocalStorage (ระวังเรื่องเครื่องหมายคำพูด)
        const docName = `นพ. ${doc.name} ${doc.surname}`;
        const docDept = doc.specialization || 'ทั่วไป';
        const docImg = "../../img/doctor_img1.png"; // ใช้รูป default ไปก่อน หรือดึงจาก db ถ้ามี

        // 🌟 เปลี่ยนจากการยัด URL ตรงๆ เป็นการเรียกฟังก์ชัน selectDoctor()
        card.innerHTML = `
            <div class="heart-icon" onclick="event.stopPropagation(); toggleHeart(this)">❤️</div>
            <div class="doc-img-container" onclick="selectDoctor('${doc.doctorId}', '${docName}', '${docDept}', '${docImg}')">
                <img src="${docImg}" class="doc-avatar">
            </div>
            <div class="doc-info" onclick="selectDoctor('${doc.doctorId}', '${docName}', '${docDept}', '${docImg}')">
                <h3>${docName}</h3>
                <p>แผนก ${docDept}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ================= GO BOOKING =================
// 3. ฟังก์ชันที่จะทำงานตอนกดการ์ดหมอ
function selectDoctor(docId, docName, docDept, docImg) {
    // สร้าง Object ข้อมูลหมอที่เลือก
    const doctorObj = {
        doctorId: docId, 
        name: docName,
        dept: docDept,
        img: docImg
    };
    
    // บันทึกลง LocalStorage
    localStorage.setItem("selectedDoctor", JSON.stringify(doctorObj));
    
    // ย้ายไปหน้า Booking.html
    window.location.href = "Booking.html";
}

// ================= FAVORITE (ตัวอย่าง) =================
function toggleHeart(element) {
    // สลับคลาสหรือเปลี่ยนอิโมจิ (ตัวอย่างแบบง่ายๆ)
    if (element.innerText === '❤️') {
        element.innerText = '🤍';
    } else {
        element.innerText = '❤️';
    }
}

// ================= FILTER & SEARCH (ยังเก็บไว้) =================
// (ถ้าจะใช้ค่อยเขียน logic เพิ่มเติม)