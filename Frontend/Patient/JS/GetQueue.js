const doctors = [
    { name: "นพ.สมชาย ศรีสุข", dept: "แผนก หู คอ จมูก", img: "../../img/doctor_img1.png" },
    { name: "พญ.นนทพัทธ์ ใจดี", dept: "แผนก หู คอ จมูก", img: "../../img/doctor_img2.png" },
    { name: "พญ.ชลธิชา คำดี", dept: "แผนก หู คอ จมูก", img: "../../img/doctor_img4.png" },
    { name: "นพ.วราภรณ์ ศิริชัย", dept: "แผนก ศัลยกรรม", img: "../../img/doctor_img3.png" },
    { name: "นพ.อัครพล ศรีนวล", dept: "แผนก อายุรกรรม", img: "../../img/doctor_img5.png" },
    { name: "นพ.พงศกร แก้วดี", dept: "แผนก อายุรกรรม", img: "../../img/doctor_img7.png" },
    { name: "พญ.มินตรา จันทร์ทรา", dept: "แผนก กุมารเวชกรรม", img: "../../img/doctor_img6.png" },
    { name: "นพ.สมปอง สองสิบ", dept: "แผนก จักษุ", img: "../../img/doctor_img8.png" }
];

const doctorGrid = document.getElementById("doctorGrid");

function renderDoctors(list) {
    doctorGrid.innerHTML = list.map((doc, index) => `
        <div class="doctor-card">
            <div class="heart-icon ${doc.favorite ? 'active' : ''}" 
                 onclick="toggleFavorite(${index})">❤</div>

            <div class="doc-img-container">
                <img src="${doc.img}" class="doc-avatar">
            </div>

            <div class="doc-info">
                <h3>${doc.name}</h3>
                <p>${doc.dept}</p>
            </div>
        </div>
    `).join('');
}


function toggleFavorite(index) {
    doctors[index].favorite = !doctors[index].favorite;
    renderDoctors(doctors);
}


let isFilterOn = false;

document.querySelector(".filter-icon").onclick = () => {
    isFilterOn = !isFilterOn;

    if (isFilterOn) {
        const favDoctors = doctors.filter(doc => doc.favorite);
        renderDoctors(favDoctors);
    } else {
        renderDoctors(doctors);
    }
};


renderDoctors(doctors);


function applyFilter() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();

    let filtered = doctors;

    // 1. filter หัวใจ
    if (isFilterOn) {
        filtered = filtered.filter(doc => doc.favorite);
    }

    // 2. search ชื่อ
    if (keyword) {
        filtered = filtered.filter(doc =>
            doc.name.toLowerCase().includes(keyword)
        );
    }

    renderDoctors(filtered);
}

document.querySelector(".filter-icon").onclick = () => {
    isFilterOn = !isFilterOn;
    applyFilter();
};

document.getElementById("searchInput").addEventListener("input", () => {
    applyFilter();
});

applyFilter();

