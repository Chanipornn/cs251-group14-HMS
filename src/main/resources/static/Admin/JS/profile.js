// =========================
// CONFIG
// =========================
const API_BASE = "http://localhost:8080/api";

// =========================
// STATE
// =========================
let currentUser   = null;
let currentField  = null;
let isLoading     = false;  // ป้องกัน loop

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", async () => {

    const userId = localStorage.getItem("userId");
    if (!userId) {
        window.location.href = "../../login.html";
        return;
    }

    await loadUserProfile(userId);

    const imageInput = document.getElementById("imageUpload");
    if (imageInput) {
        imageInput.addEventListener("change", handleImageUpload);
    }
});

// =========================
// LOAD PROFILE FROM BACKEND
// =========================
async function loadUserProfile(userId) {
    if (isLoading) return;  // ป้องกัน loop
    isLoading = true;
    showLoading(true);

    try {
        // ดึง UserEntity
        const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            throw new Error(`โหลดข้อมูลผู้ใช้ไม่สำเร็จ (${res.status})`);
        }

        const user = await res.json();

        // ดึงชื่อจาก Doctor หรือ Patient แยก
        const role = user.role;
        let name = "-", surname = "-";

        if (role === "Doctor") {
            try {
                const docRes = await fetch(`${API_BASE}/doctors/me/${userId}`, {
                    headers: getAuthHeaders(),
                });
                if (docRes.ok) {
                    const doc = await docRes.json();
                    name    = doc.name    || "-";
                    surname = doc.surname || "-";
                }
            } catch (_) {}

        } else if (role === "Patient") {
            try {
                const patRes = await fetch(`${API_BASE}/patients/user/${userId}`, {
                    headers: getAuthHeaders(),
                });
                if (patRes.ok) {
                    const pat = await patRes.json();
                    name    = pat.name    || "-";
                    surname = pat.surname || "-";
                }
            } catch (_) {}
        }

        // รวม state
        currentUser = { ...user, name, surname };
        renderProfile(currentUser);

    } catch (err) {
        showToast("❌ " + err.message, "error");
        console.error("loadUserProfile error:", err);
    } finally {
        showLoading(false);
        isLoading = false;
    }
}

// =========================
// RENDER
// =========================
function renderProfile(user) {
    setText("username",  user.username);
    setText("email",     user.email);
    setText("firstName", user.name);
    setText("lastName",  user.surname);
    setText("phone",     user.telephone);

    // รูป
    const img = document.getElementById("profileImage");
    if (img && user.profileImageUrl) {
        img.src = user.profileImageUrl;
        img.onerror = () => { img.onerror = null; };  // ป้องกัน onerror loop
    }

    // Header
    const headerName   = document.getElementById("headerName");
    const headerAvatar = document.getElementById("headerAvatar");

    if (headerName) headerName.innerText = user.username || "Admin";
    if (headerAvatar && user.profileImageUrl) {
        headerAvatar.style.backgroundImage    = `url('${user.profileImageUrl}')`;
        headerAvatar.style.backgroundSize     = "cover";
        headerAvatar.style.backgroundPosition = "center";
    }
}

// =========================
// IMAGE UPLOAD
// =========================
async function handleImageUpload() {
    const file = this.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        showToast("กรุณาเลือกไฟล์รูปภาพ", "error");
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast("รูปภาพต้องมีขนาดไม่เกิน 5 MB", "error");
        return;
    }

    const userId = localStorage.getItem("userId");

    // Preview ทันที
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById("profileImage");
        if (img) img.src = e.target.result;
    };
    reader.readAsDataURL(file);

    showLoading(true);
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_BASE}/users/${userId}/profile-image`, {
            method: "POST",
            headers: getAuthHeaders(false),
            body: formData,
        });

        if (!res.ok) throw new Error(`อัปโหลดรูปไม่สำเร็จ (${res.status})`);

        const data = await res.json();

        if (data.profileImageUrl) {
            currentUser.profileImageUrl = data.profileImageUrl;
            const headerAvatar = document.getElementById("headerAvatar");
            if (headerAvatar) {
                headerAvatar.style.backgroundImage = `url('${data.profileImageUrl}')`;
            }
        }

        showToast("✅ อัปโหลดรูปสำเร็จ", "success");

    } catch (err) {
        showToast("❌ " + err.message, "error");
        // rollback
        const img = document.getElementById("profileImage");
        if (img) img.src = currentUser?.profileImageUrl || "";
    } finally {
        showLoading(false);
        this.value = "";
    }
}

// =========================
// EDIT MODAL
// =========================
window.editField = function(field, label = "แก้ไขข้อมูล") {
    currentField = field;

    const fieldMap = {
        firstName: "name",
        lastName:  "surname",
        phone:     "telephone",
    };
    const key   = fieldMap[field] || field;
    const value = currentUser?.[key] || "";

    document.getElementById("modalTitle").innerText = `แก้ไข${label}`;

    const input = document.getElementById("editInput");
    input.value = value;
    input.type  = field === "phone" ? "tel" : "text";

    document.getElementById("editModal").classList.add("show");
    setTimeout(() => input.focus(), 100);
};

window.closeModal = function() {
    document.getElementById("editModal").classList.remove("show");
    currentField = null;
};

window.saveEdit = async function() {
    if (!currentField) return;

    const input = document.getElementById("editInput");
    const value = input.value.trim();

    if (!value) {
        showToast("กรุณากรอกข้อมูล", "error");
        return;
    }

    if (currentField === "phone" && !/^[0-9]{9,10}$/.test(value)) {
        showToast("เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 9-10 หลัก)", "error");
        return;
    }

    const dtoMap = {
        firstName: "name",
        lastName:  "surname",
        phone:     "telephone",
    };
    const dtoKey = dtoMap[currentField] || currentField;

    const userId = localStorage.getItem("userId");
    setSaveLoading(true);

    try {
        const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ [dtoKey]: value }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `บันทึกไม่สำเร็จ (${res.status})`);
        }

        const updated = await res.json();
        currentUser = { ...currentUser, ...updated };

        // อัปเดต UI
        const uiMap = { name: "firstName", surname: "lastName", telephone: "phone" };
        const uiId  = uiMap[dtoKey] || currentField;
        setText(uiId, value);

        // อัปเดต local name/surname
        if (dtoKey === "name")    currentUser.name    = value;
        if (dtoKey === "surname") currentUser.surname = value;

        showToast("✅ บันทึกสำเร็จ", "success");
        closeModal();

    } catch (err) {
        showToast("❌ " + err.message, "error");
    } finally {
        setSaveLoading(false);
    }
};

// =========================
// HELPERS
// =========================
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value || "-";
}

function showLoading(show) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.style.display = show ? "flex" : "none";
}

function setSaveLoading(loading) {
    const btn     = document.getElementById("saveBtn");
    const text    = document.getElementById("saveBtnText");
    const spinner = document.getElementById("saveBtnSpinner");

    if (!btn) return;
    btn.disabled = loading;
    text?.classList.toggle("hidden", loading);
    spinner?.classList.toggle("hidden", !loading);
}

function showToast(message, type = "info") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.className   = `toast ${type}`;

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.className = "toast hidden";
    }, 3000);
}

function getAuthHeaders(includeContentType = true) {
    const token   = localStorage.getItem("token");
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (includeContentType) headers["Content-Type"] = "application/json";
    return headers;
}

// =========================
// SIDEBAR / LOGOUT / NAV
// =========================
function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("hide");
}

function logout() {
    localStorage.clear();
    window.location.href = "../../login.html";
}

function goProfile() {
    window.location.href = "profile.html";
}