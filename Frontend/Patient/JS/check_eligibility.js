async function searchInDB(id) {
    const response = await fetch(`https://api-hms.com/check/${id}`);
    const data = await response.json();
    // นำ data มาโชว์
}

// 1. จำลอง Database
const insuranceDatabase = [
    {
        citizenId: "1234567890123",
        type: "สิทธิบัตรทอง",
        hospital: "โรงพยาบาลธรรมศาสตร์",
        status: "ใช้งานได้"
    },
    {
        citizenId: "1100112233445",
        type: "สิทธิประกันสังคม",
        hospital: "โรงพยาบาลจุฬาลงกรณ์",
        status: "ใช้งานได้"
    },
    {
        citizenId: "9999999999999",
        type: "สิทธิข้าราชการ",
        hospital: "โรงพยาบาลศิริราช",
        status: "หมดอายุ"
    }
];

// 2. ฟังก์ชันจัดการการค้นหา
async function checkEligibility() {
    const idInput = document.getElementById('citizenId').value.trim();
    const resultArea = document.getElementById('resultArea');
    
    // ตรวจสอบความถูกต้องของเลขบัตร (เบื้องต้น)
     if (!/^\d{13}$/.test(idInput)) {
        alert("กรุณากรอกเลขบัตรประชาชน 13 หลัก");
        return;
    }

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user || !user.patientId) {
        alert("ไม่พบผู้ใช้งาน");
        return;
    }

    // แสดงสถานะ Loading (ถ้าต้องการ)
    resultArea.style.display = 'none';

    try {
        // ยิง backend
        const res = await fetch(
            `http://localhost:8080/api/patients/${user.patientId}/thai-id`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ thaiNationalId: idInput })
            }
        );

        const data = await res.json();

        console.log("RESULT:", data);

        document.getElementById('resType').innerText =
            data.rightToHealthcare || "สิทธิบัตรทอง";

        document.getElementById('resHospital').innerText =
            "โรงพยาบาลของคุณ";

        document.getElementById('resStatus').innerText =
            data.rightToHealthcare ? "ใช้งานได้" : "ไม่พบสิทธิ";

        const statusElement = document.getElementById('resStatus');

        if (data.rightToHealthcare) {
            statusElement.style.color = "#27ae60";
        } else {
            statusElement.style.color = "#e74c3c";
        }

        resultArea.style.display = 'block';

    } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาด");
    }
    /*
    // ค้นหาข้อมูลใน Database จำลอง
    const result = insuranceDatabase.find(item => item.citizenId === idInput);

    setTimeout(() => {
        if (result) {
            // อัปเดตข้อมูลในหน้าจอ
            document.getElementById('resType').innerText = result.type;
            document.getElementById('resHospital').innerText = result.hospital;
            document.getElementById('resStatus').innerText = result.status;

            // ปรับสีสถานะตามเงื่อนไข
            const statusElement = document.getElementById('resStatus');
            if (result.status === "ใช้งานได้") {
                statusElement.style.color = "#27ae60";
            } else {
                statusElement.style.color = "#e74c3c";
            }

            resultArea.style.display = 'block';
        } else {
            alert("ไม่พบข้อมูลสิทธิสำหรับเลขบัตรประชาชนนี้");
        }
    }, 400); // หน่วงเวลาเล็กน้อยเพื่อให้ดูเหมือนมีการประมวลผล
    */
}


document.getElementById('citizenId').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
    checkEligibility();
    }
});

document.getElementById("searchBtn")
  .addEventListener("click", checkEligibility);


document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user?.patientId) return;

    const res = await fetch(`http://localhost:8080/api/patients/${user.patientId}`);
    const patient = await res.json();

    if (patient.thaiNationalId) {
        document.getElementById("citizenId").value = patient.thaiNationalId;
    }
});