// ================= DATA =================
const doctors = [
    { id: 1, name: "นพ.สมชาย ศรีสุข", dept: "หู คอ จมูก", img: "../../img/doctor_img1.png", favorite: false },
    { id: 2, name: "พญ.นนทพัทธ์ ใจดี", dept: "หู คอ จมูก", img: "../../img/doctor_img2.png", favorite: false },
    { id: 3, name: "พญ.ชลธิชา คำดี", dept: "หู คอ จมูก", img: "../../img/doctor_img4.png", favorite: false },
    { id: 4, name: "นพ.วราภรณ์ ศิริชัย", dept: "ศัลยกรรม", img: "../../img/doctor_img3.png", favorite: false },
    { id: 5, name: "นพ.อัครพล ศรีนวล", dept: "อายุรกรรม", img: "../../img/doctor_img5.png", favorite: false },
    { id: 6, name: "นพ.พงศกร แก้วดี", dept: "อายุรกรรม", img: "../../img/doctor_img7.png", favorite: false },
    { id: 7, name: "พญ.มินตรา จันทร์ทรา", dept: "กุมารเวชกรรม", img: "../../img/doctor_img6.png", favorite: false },
    { id: 8, name: "นพ.สมปอง สองสิบ", dept: "จักษุ", img: "../../img/doctor_img8.png", favorite: false }
];

const doctorGrid = document.getElementById("doctorGrid");
let selectedDept = "all";

// ================= RENDER =================
function renderDoctors(list) {
    doctorGrid.innerHTML = list.map(doc => `
        <div class="doctor-card" onclick="goToBooking(${doc.id})">
            
            <div class="heart-icon ${doc.favorite ? 'active' : ''}" 
                 onclick="event.stopPropagation(); toggleFavorite(${doc.id})">
                ❤
            </div>

            <div class="doc-img-container">
                <img src="${doc.img}">
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
    if (!doc) return;

    localStorage.setItem("selectedDoctor", JSON.stringify(doc));
    window.location.href = "Booking.html";
}

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
document.querySelector(".filter-icon").addEventListener("click", openPopup);
document.getElementById("searchInput").addEventListener("input", applyFilter);

// ================= POPUP =================
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
applyFilter();