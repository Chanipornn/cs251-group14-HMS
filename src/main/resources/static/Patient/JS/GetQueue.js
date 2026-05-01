// ================= DATA =================
//const 
window.onload = async function() {
    try {
        const response = await fetch('/api/doctor/');
    
        const data = await response.json();
        console.log(data)

    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
    }
};

// ================= RENDER =================
function renderDoctors(list) {
    doctorGrid.innerHTML = list.map(doc => `
        <div class="doctor-card" onclick="goToBooking(${doc.id})">
            
            <div class="heart-icon ${doc.favorite ? 'active' : ''}" 
                 onclick="event.stopPropagation(); toggleFavorite(${doc.id})">
                ❤
            </div>

            <div class="doc-img-container">
                <img src="${doc.img}" class="doc-avatar">
            </div>

            <div class="doc-info">
                <h3>${doc.name}</h3>
                <p>แผนก ${doc.dept}</p>
            </div>

        </div>
    `).join('');
}

// ================= GO BOOKING =================
function goToBooking(id) {
    const doc = doctors.find(d => d.id === id);

    localStorage.setItem("selectedDoctor", JSON.stringify(doc));

    window.location.href = "Booking.html";
}
/*
function goToBooking(id) {
    const doc = doctors.find(d => d.id === id);
    if (!doc) return;

    localStorage.setItem("selectedDoctor", JSON.stringify({
        doctorId: doc.id,   // ✅ ใช้ doc
        name: doc.name,
        dept: doc.dept,
        img: doc.img
    }));

    window.location.href = "Booking.html";
}
*/
// ================= FAVORITE =================
function toggleFavorite(id) {
    const doc = doctors.find(d => d.id === id);
    if (doc) doc.favorite = !doc.favorite;
    applyFilter();
}

// ================= FILTER =================
function applyFilter() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();

    let filtered = [...doctors];

    if (selectedDept !== "all") {
        filtered = filtered.filter(doc => doc.dept === selectedDept);
    }

    if (keyword) {
        filtered = filtered.filter(doc =>
            doc.name.toLowerCase().includes(keyword)
        );
    }

    renderDoctors(filtered);
}

// ================= EVENTS =================
/*
document.querySelector(".filter-icon").addEventListener("click", openPopup);
document.getElementById("searchInput").addEventListener("input", applyFilter);
*/

// ================= POPUP =================
/*
const popupHTML = `
<div class="filter-popup" id="filterPopup">
    <div class="popup-content">
        <h3>เลือกแผนก</h3>

        <div class="filter-options">
            <button onclick="selectDept('all')">ทั้งหมด</button>
            <button onclick="selectDept('หู คอ จมูก')">หู คอ จมูก</button>
            <button onclick="selectDept('ศัลยกรรม')">ศัลยกรรม</button>
            <button onclick="selectDept('อายุรกรรม')">อายุรกรรม</button>
            <button onclick="selectDept('กุมารเวชกรรม')">กุมารเวชกรรม</button>
            <button onclick="selectDept('จักษุ')">จักษุ</button>
        </div>

        <button class="close-btn" onclick="closePopup()">ปิด</button>
    </div>
</div>
`;

document.body.insertAdjacentHTML("beforeend", popupHTML);
*/

function openPopup() {
    document.getElementById("filterPopup").classList.add("active");
}

function closePopup() {
    document.getElementById("filterPopup").classList.remove("active");
}

function selectDept(dept) {
    selectedDept = dept;
    closePopup();
    applyFilter();
}

// ================= INIT =================
//applyFilter();
document.addEventListener("DOMContentLoaded", () => {
    renderDoctors(doctors);

    document.querySelector(".filter-icon").addEventListener("click", openPopup);
    document.getElementById("searchInput").addEventListener("input", applyFilter);
});