const MC_STORAGE_KEY = 'medical_certificates';
const MC_EDIT_ID_KEY = 'editing_medical_certificate_id';

const starterCertificates = [
  {
    id: 'MC001',
    patientId: 'P001',
    doctorId: 'D001',
    date: '2026-04-20',
    symptoms: 'มีไข้ ไอ และเจ็บคอ',
    purpose: 'ใช้ประกอบการลาป่วย'
  },
  {
    id: 'MC002',
    patientId: 'P002',
    doctorId: 'D001',
    date: '2026-04-22',
    symptoms: 'ปวดศีรษะและอ่อนเพลีย',
    purpose: 'ใช้ยืนยันการเข้ารับการรักษา'
  }
];

function getCertificates() {
  const saved = localStorage.getItem(MC_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(MC_STORAGE_KEY, JSON.stringify(starterCertificates));
    return [...starterCertificates];
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Cannot read medical certificates:', error);
    return [];
  }
}

function saveCertificates(certificates) {
  localStorage.setItem(MC_STORAGE_KEY, JSON.stringify(certificates));
}

function generateCertificateId(certificates) {
  const maxNumber = certificates.reduce((max, item) => {
    const number = Number(String(item.id || '').replace(/[^0-9]/g, ''));
    return Number.isFinite(number) && number > max ? number : max;
  }, 0);

  return `MC${String(maxNumber + 1).padStart(3, '0')}`;
}

function formatThaiDate(dateValue) {
  if (!dateValue) return '-';
  return new Date(dateValue).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getFormData() {
  return {
    patientId: document.getElementById('mcPatientId')?.value.trim() || '',
    doctorId: document.getElementById('mcDoctorId')?.value.trim() || '',
    date: document.getElementById('mcDate')?.value || '',
    symptoms: document.getElementById('mcSymptoms')?.value.trim() || '',
    purpose: document.getElementById('mcPurpose')?.value.trim() || ''
  };
}

function fillForm(certificate) {
  document.getElementById('mcPatientId').value = certificate.patientId || '';
  document.getElementById('mcDoctorId').value = certificate.doctorId || '';
  document.getElementById('mcDate').value = certificate.date || '';
  document.getElementById('mcSymptoms').value = certificate.symptoms || '';
  document.getElementById('mcPurpose').value = certificate.purpose || '';
}

function goToHistory() {
  window.location.href = 'medical_certificate_history.html';
}

function renderPreview(certificate) {
  const previewPanel = document.getElementById('previewPanel');
  if (!previewPanel || !certificate) return;

  previewPanel.innerHTML = `
    <div class="preview-card">
      <h2>รายละเอียดใบรับรองแพทย์</h2>
      <p><strong>รหัสใบรับรองแพทย์:</strong> ${escapeHtml(certificate.id)}</p>
      <p><strong>รหัสผู้ป่วย:</strong> ${escapeHtml(certificate.patientId)}</p>
      <p><strong>รหัสแพทย์:</strong> ${escapeHtml(certificate.doctorId)}</p>
      <p><strong>วันที่ออกใบรับรอง:</strong> ${formatThaiDate(certificate.date)}</p>
      <hr>
      <p><strong>อาการ:</strong></p>
      <p>${escapeHtml(certificate.symptoms)}</p>
      <p><strong>วัตถุประสงค์:</strong></p>
      <p>${escapeHtml(certificate.purpose)}</p>
    </div>
  `;
}

function renderHistory(filterText = '') {
  const recordList = document.getElementById('recordList');
  const previewPanel = document.getElementById('previewPanel');
  if (!recordList) return;

  const keyword = filterText.trim().toLowerCase();
  const certificates = getCertificates();
  const filteredCertificates = certificates.filter((item) => {
    return (
      item.id.toLowerCase().includes(keyword) ||
      item.patientId.toLowerCase().includes(keyword) ||
      item.doctorId.toLowerCase().includes(keyword)
    );
  });

  if (filteredCertificates.length === 0) {
    recordList.innerHTML = `<div class="empty-state">ยังไม่มีข้อมูลใบรับรองแพทย์</div>`;
    if (previewPanel) previewPanel.innerHTML = '';
    return;
  }

  recordList.innerHTML = filteredCertificates.map((item, index) => `
    <article class="record-card ${index === 0 ? 'active' : ''}" data-id="${escapeHtml(item.id)}">
      <div>
        <h3>${escapeHtml(item.id)}</h3>
        <p>ผู้ป่วย: ${escapeHtml(item.patientId)}</p>
        <p>แพทย์: ${escapeHtml(item.doctorId)}</p>
        <p>วันที่: ${formatThaiDate(item.date)}</p>
      </div>
      <button type="button" class="btn-edit-certificate" data-id="${escapeHtml(item.id)}">แก้ไข</button>
    </article>
  `).join('');

  renderPreview(filteredCertificates[0]);

  recordList.querySelectorAll('.record-card').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('.btn-edit-certificate')) return;
      const certificate = getCertificates().find((item) => item.id === card.dataset.id);
      recordList.querySelectorAll('.record-card').forEach((item) => item.classList.remove('active'));
      card.classList.add('active');
      renderPreview(certificate);
    });
  });

  recordList.querySelectorAll('.btn-edit-certificate').forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.setItem(MC_EDIT_ID_KEY, button.dataset.id);
      window.location.href = `edit_medical_certificate.html?id=${encodeURIComponent(button.dataset.id)}`;
    });
  });
}

function initCreatePage() {
  const form = document.getElementById('medicalCertificateForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const certificates = getCertificates();
    const newCertificate = {
      id: generateCertificateId(certificates),
      ...getFormData()
    };

    certificates.unshift(newCertificate);
    saveCertificates(certificates);
    goToHistory();
  });
}

function getEditingId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || localStorage.getItem(MC_EDIT_ID_KEY);
}

function initEditPage() {
  const form = document.getElementById('medicalCertificateForm');
  if (!form) return;

  const editingId = getEditingId();
  const certificates = getCertificates();
  const certificate = certificates.find((item) => item.id === editingId) || certificates[0];

  if (!certificate) {
    alert('ไม่พบข้อมูลใบรับรองแพทย์ที่ต้องการแก้ไข');
    goToHistory();
    return;
  }

  localStorage.setItem(MC_EDIT_ID_KEY, certificate.id);
  fillForm(certificate);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const updatedCertificates = getCertificates().map((item) => {
      if (item.id !== certificate.id) return item;
      return {
        ...item,
        ...getFormData()
      };
    });

    saveCertificates(updatedCertificates);
    localStorage.removeItem(MC_EDIT_ID_KEY);
    goToHistory();
  });
}

function initMedicalCertificatePage() {
  const page = document.body.dataset.page;

  if (page === 'medical-history') {
    renderHistory();
    const searchInput = document.getElementById('mcSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => renderHistory(searchInput.value));
    }
  }

  if (page === 'medical-create') initCreatePage();
  if (page === 'medical-edit') initEditPage();
}

document.addEventListener('DOMContentLoaded', initMedicalCertificatePage);
