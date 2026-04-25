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
function handleSearch() {
    const idInput = document.getElementById('citizenId').value.trim();
    const resultArea = document.getElementById('resultArea');
    
    // ตรวจสอบความถูกต้องของเลขบัตร (เบื้องต้น)
    if (idInput.length !== 13 || isNaN(idInput)) {
        alert("กรุณากรอกหมายเลขบัตรประชาชนให้ครบ 13 หลัก (เฉพาะตัวเลข)");
        return;
    }

    // แสดงสถานะ Loading (ถ้าต้องการ)
    resultArea.style.display = 'none';

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
}

// 3. (Optional) ดักฟังการกดปุ่ม Enter
document.getElementById('citizenId').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});