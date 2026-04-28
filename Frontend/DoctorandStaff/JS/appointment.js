// appointment.js
// ใช้ร่วมกันสำหรับ appointment.html, add-appointment.html, edit-appointment.html, cancel-appointment.html

const STORAGE_KEY = 'appointments_data';

const defaultAppointments = [
  { id: 'apt-1', queue: 1, date: '2026-03-25', time: '09:00', patientId: '6780987', doctorId: '1112222333', caseDoctorId: '1112222333', name: 'น.ส. โยมิว แก้วหวาน', age: 25, weight: 55, height: 165 },
  { id: 'apt-2', queue: 2, date: '2026-03-25', time: '09:30', patientId: '6780988', doctorId: '1112222333', caseDoctorId: '1112222333', name: 'นาย นวัต ตะสังโดน', age: 21, weight: 60, height: 160 },
  { id: 'apt-3', queue: 3, date: '2026-03-25', time: '10:00', patientId: '6780989', doctorId: '1112222333', caseDoctorId: '1112222333', name: 'น.ส. บากินตา อิบาบู', age: 44, weight: 70, height: 155 }
];

let sortAsc = true;
let currentAppointmentId = new URLSearchParams(window.location.search).get('id');
let _successModalCallback = null;

function ensureSuccessModal() {
  let modal = document.getElementById('successModal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'successModal';
  modal.className = 'success-modal-overlay';
  modal.innerHTML = `
    <div class="success-modal-content">
      <div id="successModalIcon" class="success-modal-icon success">✓</div>
      <h2 id="successModalTitle">สำเร็จ!</h2>
      <p id="successModalMessage">บันทึกข้อมูลเรียบร้อยแล้ว</p>
      <button class="success-btn-confirm" type="button" onclick="closeModal()">ตกลง</button>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

function showModal(message, isSuccess = true, onClose = null) {
  const modal = ensureSuccessModal();
  const modalMessage = document.getElementById('successModalMessage');
  const modalIcon = document.getElementById('successModalIcon');
  const modalTitle = document.getElementById('successModalTitle');

  modalMessage.textContent = message;

  if (isSuccess) {
    modalIcon.className = 'success-modal-icon success';
    modalIcon.textContent = '✓';
    modalTitle.textContent = 'สำเร็จ!';
  } else {
    modalIcon.className = 'success-modal-icon warning';
    modalIcon.textContent = '!';
    modalTitle.textContent = 'แจ้งเตือน';
  }

  _successModalCallback = onClose;
  modal.classList.add('show');
}

function closeModal() {
  const modal = document.getElementById('successModal');
  if (modal) modal.classList.remove('show');

  if (typeof _successModalCallback === 'function') {
    const callback = _successModalCallback;
    _successModalCallback = null;
    callback();
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
  if (sidebar) sidebar.classList.toggle('collapsed');
}

function logout() {
  if (confirm('ต้องการออกจากระบบ?')) window.location.href = 'login.html';
}

function safeParseAppointments(saved) {
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getAppointments() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAppointments));
    return [...defaultAppointments];
  }

  const parsed = safeParseAppointments(saved);
  if (!parsed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAppointments));
    return [...defaultAppointments];
  }

  return parsed;
}

function saveAppointments(appointments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

function formatThaiDate(dateText) {
  if (!dateText) return '-';
  const [year, month, day] = String(dateText).split('-');
  if (!year || !month || !day) return dateText;
  return `${day}/${month}/${Number(year) + 543}`;
}

function padQueue(num) {
  return String(num || 0).padStart(2, '0');
}

function getCurrentAppointment(appointments = getAppointments()) {
  let appointment = appointments.find(item => item.id === currentAppointmentId);

  if (!appointment && appointments.length > 0) {
    appointment = appointments[0];
    currentAppointmentId = appointment.id;
  }

  return appointment;
}

function renderAppointments() {
  const list = document.getElementById('cardList');
  const searchInput = document.getElementById('searchInput');
  if (!list) return;

  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
  let appointments = getAppointments();

  appointments = [...appointments].sort((a, b) => {
    return sortAsc
      ? Number(a.queue || 0) - Number(b.queue || 0)
      : Number(b.queue || 0) - Number(a.queue || 0);
  });

  if (keyword) {
    appointments = appointments.filter(item =>
      String(item.patientId || '').toLowerCase().includes(keyword) ||
      String(item.doctorId || '').toLowerCase().includes(keyword) ||
      String(item.caseDoctorId || '').toLowerCase().includes(keyword)
    );
  }

  list.innerHTML = '';

  if (appointments.length === 0) {
    list.innerHTML = '<p style="padding:20px; color:#777;">ไม่พบรายการนัดหมาย</p>';
    return;
  }

  appointments.forEach(item => {
    const card = document.createElement('div');
    card.className = 'appoint-card';
    card.dataset.queue = item.queue;
    card.innerHTML = `
      <div class="card-body">
        <p class="card-date">วันที่ : ${formatThaiDate(item.date)}</p>
        <p>ชื่อ : ${item.name || 'ผู้ป่วยรหัส ' + (item.patientId || '-')}</p>
        <p>อายุ : ${item.age || '-'} ปี</p>
        <p>น้ำหนัก : ${item.weight || '-'} กก.</p>
        <p>ส่วนสูง : ${item.height || '-'} ซม.</p>
        <p>เวลา : ${item.time || '-'}</p>
        <p>PatientID : ${item.patientId || '-'}</p>
        <p>DoctorID : ${item.doctorId || '-'}</p>
      </div>
      <div class="card-meta">
        <span class="queue-label">หมายเลขคิว : ${padQueue(item.queue)}</span>
        <button class="edit-btn" type="button" onclick="goEdit('${item.id}')"><i class="fa-regular fa-pen-to-square"></i></button>
      </div>
    `;
    list.appendChild(card);
  });
}

function goEdit(id) {
  window.location.href = `edit-appointment.html?id=${encodeURIComponent(id)}`;
}

function toggleSort() {
  sortAsc = !sortAsc;

  const icon = document.getElementById('sortIcon');
  if (icon) {
    icon.style.transform = sortAsc ? 'rotate(0deg)' : 'rotate(180deg)';
    icon.style.transition = 'transform 0.3s';
  }

  renderAppointments();
}

function readAppointmentForm() {
  const patientId = document.getElementById('patientId')?.value.trim();
  const doctorId = document.getElementById('doctorId')?.value.trim();
  const date = document.getElementById('appointmentDate')?.value;
  const time = document.getElementById('appointmentTime')?.value;
  const caseDoctorId = document.getElementById('caseDoctorId')?.value.trim();

  if (!patientId || !doctorId || !date || !time || !caseDoctorId) {
    showModal('กรุณากรอกข้อมูลให้ครบ', false);
    return null;
  }

  return { patientId, doctorId, date, time, caseDoctorId };
}

function handleAddAppointmentSubmit(event) {
  if (event) event.preventDefault();

  const data = readAppointmentForm();
  if (!data) return;

  const appointments = getAppointments();
  const nextQueue = appointments.length
    ? Math.max(...appointments.map(item => Number(item.queue) || 0)) + 1
    : 1;

  const newAppointment = {
    id: 'apt-' + Date.now(),
    queue: nextQueue,
    ...data,
    name: 'ผู้ป่วยรหัส ' + data.patientId,
    age: '-',
    weight: '-',
    height: '-'
  };

  saveAppointments([...appointments, newAppointment]);

  showModal('เพิ่มการนัดหมายสำเร็จ!', true, () => {
    window.location.href = 'appointment.html';
  });
}

function setupAddAppointmentPage() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  form.addEventListener('submit', handleAddAppointmentSubmit);
}

function goToCancelAppointment() {
  window.location.href = currentAppointmentId
    ? 'cancel-appointment.html?id=' + encodeURIComponent(currentAppointmentId)
    : 'cancel-appointment.html';
}

function handleCancelNoticeKey(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    goToCancelAppointment();
  }
}

function loadAppointmentToForm() {
  const patientIdInput = document.getElementById('patientId');
  const doctorIdInput = document.getElementById('doctorId');
  const dateInput = document.getElementById('appointmentDate');
  const timeInput = document.getElementById('appointmentTime');
  const caseDoctorIdInput = document.getElementById('caseDoctorId');

  if (!patientIdInput || !doctorIdInput || !dateInput || !timeInput || !caseDoctorIdInput) return;

  const appointment = getCurrentAppointment();

  if (!appointment) {
    showModal('ไม่พบข้อมูลการนัดหมาย', false, () => {
      window.location.href = 'appointment.html';
    });
    return;
  }

  patientIdInput.value = appointment.patientId || '';
  doctorIdInput.value = appointment.doctorId || '';
  dateInput.value = appointment.date || '';
  timeInput.value = appointment.time || '';
  caseDoctorIdInput.value = appointment.caseDoctorId || '';
}

function handleEditAppointmentSubmit(event) {
  if (event) event.preventDefault();

  const data = readAppointmentForm();
  if (!data) return;

  const appointments = getAppointments();
  let index = appointments.findIndex(item => item.id === currentAppointmentId);

  if (index === -1 && appointments.length > 0) {
    index = 0;
    currentAppointmentId = appointments[0].id;
  }

  if (index === -1) {
    showModal('ไม่พบข้อมูลการนัดหมาย', false, () => {
      window.location.href = 'appointment.html';
    });
    return;
  }

  const oldItem = appointments[index];

  appointments[index] = {
    ...oldItem,
    ...data,
    name: oldItem.name && !String(oldItem.name).startsWith('ผู้ป่วยรหัส')
      ? oldItem.name
      : 'ผู้ป่วยรหัส ' + data.patientId
  };

  saveAppointments(appointments);

  showModal('แก้ไขการนัดหมายสำเร็จ!', true, () => {
    window.location.href = 'appointment.html';
  });
}

function setupEditAppointmentPage() {
  const form = document.getElementById('editAppointmentForm');
  if (!form) return;

  loadAppointmentToForm();
  form.addEventListener('submit', handleEditAppointmentSubmit);
}

function goBackToEdit() {
  window.location.href = currentAppointmentId
    ? 'edit-appointment.html?id=' + encodeURIComponent(currentAppointmentId)
    : 'edit-appointment.html';
}

function deleteAppointment() {
  let appointments = getAppointments();

  if (!currentAppointmentId && appointments.length > 0) {
    currentAppointmentId = appointments[0].id;
  }

  const beforeDelete = appointments.length;
  appointments = appointments.filter(item => item.id !== currentAppointmentId);

  if (appointments.length === beforeDelete) {
    showModal('ไม่พบรายการที่ต้องการลบ', false, () => {
      window.location.href = 'appointment.html';
    });
    return;
  }

  saveAppointments(appointments);

  showModal('ยกเลิกการนัดหมายสำเร็จ!', true, () => {
    window.location.href = 'appointment.html';
  });
}

function setupCancelAppointmentPage() {
  const isCancelPage = document.querySelector('.modal-overlay') && !document.getElementById('editAppointmentForm');
  if (!isCancelPage) return;

  loadAppointmentToForm();
}

document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', renderAppointments);
  }

  renderAppointments();
  setupAddAppointmentPage();
  setupEditAppointmentPage();
  setupCancelAppointmentPage();
});
