const API_BASE = 'http://localhost:8080/api';

const mockDB = {
  medicalCertificates: [
    {
      id: 8001,
      patientId: '6780987',
      doctorId: '1112222333',
      date: '2026-03-20',
      symptoms: 'มีไข้ ไอ เจ็บคอ',
      purpose: 'ทำงาน',
      doctorName: 'นพ. วิรุต วินทรัพย์'
    },
    {
      id: 8000,
      patientId: '6780986',
      doctorId: '1112222333',
      date: '2026-03-24',
      symptoms: 'อ่อนเพลีย ปวดหัว',
      purpose: 'ลาป่วย',
      doctorName: 'นพ. วิรุต วินทรัพย์'
    },
    {
      id: 7999,
      patientId: '6780985',
      doctorId: '1112222333',
      date: '2026-03-24',
      symptoms: 'ตรวจสุขภาพประจำปี',
      purpose: 'ตรวจสุขภาพ',
      doctorName: 'นพ. วิรุต วินทรัพย์'
    }
  ],
  invoices: [
    {
      id: 124,
      patientId: '6780987',
      treatmentId: '1112222333',
      date: '2026-03-20',
      patientName: 'นาง ลลิ อิสกอท',
      doctorName: 'นพ.สมชาย ศรีสุข',
      status: 'paid',
      items: [
        { order: 1, name: 'ค่าตรวจแพทย์', amount: 300 },
        { order: 2, name: 'ค่ายา', amount: 150 },
        { order: 3, name: 'ค่าบริการโรงพยาบาล', amount: 50 }
      ],
      coverage: -300
    },
    {
      id: 125,
      patientId: '6780478',
      treatmentId: '1112222334',
      date: '2026-03-24',
      patientName: 'นาย เอก ดีมาก',
      doctorName: 'นพ.สมชาย ศรีสุข',
      status: 'pending',
      items: [
        { order: 1, name: 'ค่าตรวจแพทย์', amount: 300 },
        { order: 2, name: 'ค่ายา', amount: 220 }
      ],
      coverage: 0
    },
    {
      id: 126,
      patientId: '6770654',
      treatmentId: '1112222335',
      date: '2026-03-24',
      patientName: 'นาย บี ตัวอย่าง',
      doctorName: 'นพ.สมชาย ศรีสุข',
      status: 'paid',
      items: [
        { order: 1, name: 'ค่าตรวจแพทย์', amount: 300 },
        { order: 2, name: 'ค่าบริการโรงพยาบาล', amount: 50 }
      ],
      coverage: 0
    }
  ]
};

const page = document.body.dataset.page;
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];
const params = new URLSearchParams(window.location.search);


function showModal(message, isSuccess = true, onClose = null) {
  const modal = document.getElementById('successModal');
  const modalMessage = document.getElementById('modalMessage');
  const modalIcon = document.getElementById('modalIcon');
  const modalTitle = document.getElementById('modalTitle');

  if (!modal || !modalMessage || !modalIcon || !modalTitle) {
    if (onClose) onClose();
    return;
  }

  modalMessage.textContent = message;

  if (isSuccess) {
    modalIcon.className = 'modal-icon success';
    modalIcon.textContent = '✓';
    modalTitle.textContent = 'สำเร็จ!';
  } else {
    modalIcon.className = 'modal-icon warning';
    modalIcon.textContent = '!';
    modalTitle.textContent = 'แจ้งเตือน';
  }

  modal.classList.add('show');
  window._modalCallback = onClose;
}

function closeModal() {
  const modal = document.getElementById('successModal');
  if (modal) modal.classList.remove('show');

  if (window._modalCallback) {
    window._modalCallback();
    window._modalCallback = null;
  }
}

function formatThaiDate(isoDate) {
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear() + 543;
  return `${day}/${month}/${year}`;
}

function navigate(url) {
  window.location.href = url;
}

async function apiFetch(path, options = {}, fallback = null) {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    if (!response.ok) throw new Error('API error');
    return await response.json();
  } catch (error) {
    console.warn('Using fallback data for', path, error.message);
    return typeof fallback === 'function' ? fallback() : fallback;
  }
}

function statusLabel(status) {
  if (status === 'paid') return '<span class="status-dot status-success"></span>ชำระเงินเรียบร้อย';
  if (status === 'pending') return '<span class="status-dot status-danger"></span>ค้างชำระ';
  return '<span class="status-dot status-warning"></span>รอดำเนินการ';
}

const MC_STORAGE_KEY = 'medical_certificates';
const MC_EDIT_ID_KEY = 'editing_medical_certificate_id';

function getDefaultMedicalCertificates() {
  return mockDB.medicalCertificates.map((item) => ({ ...item }));
}

function getMedicalCertificates() {
  const saved = localStorage.getItem(MC_STORAGE_KEY);

  if (!saved) {
    const defaults = getDefaultMedicalCertificates();
    localStorage.setItem(MC_STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    console.warn('Cannot read medical certificates from localStorage:', error);
  }

  const defaults = getDefaultMedicalCertificates();
  localStorage.setItem(MC_STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
}

function saveMedicalCertificates(list) {
  localStorage.setItem(MC_STORAGE_KEY, JSON.stringify(list));
}

function generateMedicalCertificateId(list) {
  const maxId = list.reduce((max, item) => {
    const number = Number(String(item.id || '').replace(/[^0-9]/g, ''));
    return Number.isFinite(number) && number > max ? number : max;
  }, 8000);

  return maxId + 1;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getMedicalCertificateFormData() {
  return {
    patientId: qs('#mcPatientId')?.value.trim() || '',
    doctorId: qs('#mcDoctorId')?.value.trim() || '',
    date: qs('#mcDate')?.value || '',
    symptoms: qs('#mcSymptoms')?.value.trim() || '',
    purpose: qs('#mcPurpose')?.value.trim() || '',
    doctorName: 'นพ. วิรุต วินทรัพย์'
  };
}

function fillMedicalCertificateForm(item) {
  if (!item) return;
  qs('#mcPatientId').value = item.patientId || '';
  qs('#mcDoctorId').value = item.doctorId || '';
  qs('#mcDate').value = item.date || '';
  qs('#mcSymptoms').value = item.symptoms || '';
  qs('#mcPurpose').value = item.purpose || '';
}

function loadMedicalCertificates() {
  const list = getMedicalCertificates();
  const selectedId = String(params.get('id') || list[0]?.id || '');
  renderMedicalCertificateList(list, selectedId);
  renderMedicalCertificatePreview(list.find(item => String(item.id) === selectedId) || list[0]);

  qs('#mcSearchInput')?.addEventListener('input', (event) => {
    const keyword = event.target.value.trim().toLowerCase();
    const filtered = getMedicalCertificates().filter((item) => {
      return String(item.id).toLowerCase().includes(keyword)
        || String(item.patientId).toLowerCase().includes(keyword)
        || String(item.doctorId).toLowerCase().includes(keyword)
        || String(item.purpose).toLowerCase().includes(keyword);
    });

    const nextSelectedId = String(filtered[0]?.id || '');
    renderMedicalCertificateList(filtered, nextSelectedId);
    renderMedicalCertificatePreview(filtered[0]);
  });
}

function renderMedicalCertificateList(list, selectedId) {
  const wrap = qs('#recordList');
  if (!wrap) return;

  if (!list.length) {
    wrap.innerHTML = '<div class="empty-state">ยังไม่มีข้อมูลใบรับรองแพทย์</div>';
    const preview = qs('#previewPanel');
    if (preview) preview.innerHTML = '';
    return;
  }

  wrap.innerHTML = list.map(item => `
    <article class="record-card ${String(item.id) === String(selectedId) ? 'active' : ''}" data-id="${escapeHtml(item.id)}">
      <div>
        <h3>วันที่ ${formatThaiDate(item.date)}</h3>
        <p>รหัสประจำตัวผู้ป่วย : ${escapeHtml(item.patientId)}</p>
        <p>รหัสใบรับรองแพทย์ : ${escapeHtml(item.id)}</p>
        <p>วัตถุประสงค์ : ${escapeHtml(item.purpose)}</p>
      </div>
      <button class="card-arrow" type="button" data-edit-id="${escapeHtml(item.id)}">
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    </article>
  `).join('');

  qsa('.record-card').forEach(card => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('[data-edit-id]')) return;
      const id = card.dataset.id;
      const selected = getMedicalCertificates().find(item => String(item.id) === String(id));
      qsa('.record-card').forEach(item => item.classList.remove('active'));
      card.classList.add('active');
      renderMedicalCertificatePreview(selected);
    });
  });

  qsa('[data-edit-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.editId;
      localStorage.setItem(MC_EDIT_ID_KEY, id);
      navigate(`edit_medical_certificate.html?id=${encodeURIComponent(id)}`);
    });
  });
}

function renderMedicalCertificatePreview(item) {
  const preview = qs('#previewPanel');
  if (!preview) return;

  if (!item) {
    preview.innerHTML = '';
    return;
  }

  preview.innerHTML = `
    <div class="paper-center">
      <h3>ใบรับรองแพทย์</h3>
      <p class="mt-8">วันที่ ${formatThaiDate(item.date)}</p>
    </div>
    <div class="paper-section mt-24">
      <p>ข้าพเจ้า ${escapeHtml(item.doctorName || 'นพ. วิรุต วินทรัพย์')} รหัสประจำตัวแพทย์ ${escapeHtml(item.doctorId)}</p>
      <p>ได้ตรวจ นาย/นาง/นางสาว รหัสประจำตัวผู้ป่วย ${escapeHtml(item.patientId)}</p>
      <p>เมื่อวันที่ ${formatThaiDate(item.date)}</p>
      <p>อาการเบื้องต้น ${escapeHtml(item.symptoms)}</p>
      <p>ใบรับรองแพทย์นี้ออกให้เพื่อ ${escapeHtml(item.purpose)}</p>
    </div>
    <div class="paper-sign">
      <p>ลงชื่อ</p>
      <p>${escapeHtml(item.doctorName || 'นพ. วิรุต วินทรัพย์')}</p>
    </div>
    <a class="edit-link" href="edit_medical_certificate.html?id=${encodeURIComponent(item.id)}">แก้ไข <i class="fa-solid fa-pen-to-square"></i></a>
  `;
}

function initMedicalCertificateForm(mode) {
  const form = qs('#medicalCertificateForm');
  if (!form) return;

  const id = params.get('id') || localStorage.getItem(MC_EDIT_ID_KEY);
  const list = getMedicalCertificates();
  const item = mode === 'edit'
    ? list.find(x => String(x.id) === String(id))
    : null;

  if (mode === 'edit') {
    if (!item) {
      alert('ไม่พบข้อมูลใบรับรองแพทย์ที่ต้องการแก้ไข');
      navigate('medical_certificate_history.html');
      return;
    }

    localStorage.setItem(MC_EDIT_ID_KEY, item.id);
    fillMedicalCertificateForm(item);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const currentList = getMedicalCertificates();
    const payload = getMedicalCertificateFormData();

    if (mode === 'edit') {
      const updatedList = currentList.map(existing => {
        if (String(existing.id) !== String(item.id)) return existing;
        return { ...existing, ...payload };
      });
      saveMedicalCertificates(updatedList);
      localStorage.removeItem(MC_EDIT_ID_KEY);

      showModal('แก้ไขใบรับรองแพทย์สำเร็จ!', true, () => {
        window.location.href = `medical_certificate_history.html?id=${encodeURIComponent(item.id)}`;
      });
    } else {
      const newItem = {
        id: generateMedicalCertificateId(currentList),
        ...payload
      };
      saveMedicalCertificates([newItem, ...currentList]);

      showModal('สร้างใบรับรองแพทย์สำเร็จ!', true, () => {
        window.location.href = `medical_certificate_history.html?id=${encodeURIComponent(newItem.id)}`;
      });
    }
  });
}

const INVOICE_STORAGE_KEY = 'invoice_list';
const INVOICE_LEGACY_STORAGE_KEY = 'invoices';
const INVOICE_DRAFT_ITEMS_KEY = 'invoiceDraftItems';

function getDefaultInvoices() {
  return mockDB.invoices.map((invoice) => ({
    ...invoice,
    items: invoice.items.map((item) => ({ ...item }))
  }));
}

function normalizeInvoiceItem(item, index = 0) {
  return {
    order: Number(item.order || index + 1),
    name: item.name || item.item || item.description || 'รายการใหม่',
    amount: Number(item.amount ?? item.price ?? 0)
  };
}

function normalizeInvoice(invoice) {
  const items = Array.isArray(invoice.items) ? invoice.items.map(normalizeInvoiceItem) : [];
  const subtotal = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return {
    id: invoice.id,
    patientId: invoice.patientId || invoice.patient_id || '-',
    treatmentId: invoice.treatmentId || invoice.treatment_id || '-',
    date: invoice.date || getTodayISODate(),
    patientName: invoice.patientName || invoice.patient_name || 'ผู้ป่วยใหม่',
    doctorName: invoice.doctorName || invoice.doctor_name || 'นพ.วิรุต',
    status: invoice.status || 'pending',
    items,
    coverage: Number(invoice.coverage ?? 0),
    total: Number(invoice.total ?? subtotal)
  };
}

function getInvoices() {
  const saved = localStorage.getItem(INVOICE_STORAGE_KEY) || localStorage.getItem(INVOICE_LEGACY_STORAGE_KEY);

  if (!saved) {
    const defaults = getDefaultInvoices().map(normalizeInvoice);
    saveInvoices(defaults);
    return defaults;
  }

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      const normalized = parsed.map(normalizeInvoice);
      saveInvoices(normalized);
      return normalized;
    }
  } catch (error) {
    console.warn('Cannot read invoices from localStorage:', error);
  }

  const defaults = getDefaultInvoices().map(normalizeInvoice);
  saveInvoices(defaults);
  return defaults;
}

function saveInvoices(list) {
  const normalized = Array.isArray(list) ? list.map(normalizeInvoice) : [];
  localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(normalized));
  localStorage.setItem(INVOICE_LEGACY_STORAGE_KEY, JSON.stringify(normalized));
}

function generateInvoiceId(list) {
  const maxId = list.reduce((max, item) => {
    const number = Number(String(item.id || '').replace(/[^0-9]/g, ''));
    return Number.isFinite(number) && number > max ? number : max;
  }, 123);

  return maxId + 1;
}

function getTodayISODate() {
  return new Date().toISOString().slice(0, 10);
}

async function loadInvoices() {
  const list = getInvoices();
  const selectedId = String(params.get('id') || list[0]?.id || '');
  renderInvoiceList(list, selectedId);
  renderInvoicePreview(list.find(item => String(item.id) === selectedId) || list[0]);
}

function renderInvoiceList(list, selectedId) {
  const wrap = qs('#recordList');
  if (!wrap) return;

  if (!list.length) {
    wrap.innerHTML = '<div class="empty-state">ยังไม่มีข้อมูลใบแจ้งหนี้</div>';
    const preview = qs('#previewPanel');
    if (preview) preview.innerHTML = '';
    return;
  }

  wrap.innerHTML = list.map(item => `
    <article class="record-card ${String(item.id) === String(selectedId) ? 'active' : ''}" data-id="${escapeHtml(item.id)}">
      <div>
        <h3>วันที่ ${formatThaiDate(item.date)}</h3>
        <p>รหัสประจำตัวผู้ป่วย : ${escapeHtml(item.patientId)}</p>
        <p>รหัสใบแจ้งหนี้ : ${escapeHtml(item.id)}</p>
        <p>รายการ : ตรวจทั่วไป</p>
        <p>${statusLabel(item.status)}</p>
      </div>
      <button class="card-arrow" type="button" data-go="invoice_history.html?id=${encodeURIComponent(item.id)}">
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    </article>
  `).join('');

  qsa('.record-card').forEach(card => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('[data-go]')) return;
      const id = card.dataset.id;
      const selected = getInvoices().find(item => String(item.id) === String(id));
      qsa('.record-card').forEach(item => item.classList.remove('active'));
      card.classList.add('active');
      renderInvoicePreview(selected);
    });
  });

  qsa('[data-go]').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.go)));
}

function renderInvoicePreview(item) {
  const preview = qs('#previewPanel');
  if (!preview || !item) return;
  const subtotal = item.items.reduce((sum, it) => sum + Number(it.amount || 0), 0);
  const total = subtotal + Number(item.coverage);
  preview.innerHTML = `
    <div class="invoice-paper">
      <div class="paper-center">
        <h3>ใบแจ้งหนี้</h3>
        <p>${item.id}</p>
        <p class="mt-8">วันที่ ${formatThaiDate(item.date)}</p>
      </div>
      <table class="invoice-grid mt-24">
        <tr><td>แผนก / ห้อง</td><td>${item.patientName}</td><td class="text-right">รหัสผู้ป่วย ${item.patientId}</td></tr>
        <tr><td>แพทย์</td><td>${item.doctorName}</td><td class="text-right">นาย/นาง ตัวอย่าง</td></tr>
      </table>
      <table class="invoice-lines">
        ${item.items.map(line => `<tr><td>${escapeHtml(line.name)}</td><td class="text-right">${Number(line.amount || 0).toLocaleString()} บาท</td></tr>`).join('')}
      </table>
      <table class="invoice-total">
        <tr><td>รวมทั้งหมด</td><td class="text-right">${subtotal} บาท</td></tr>
        <tr><td>สิทธิการรักษา</td><td class="text-right">${item.coverage} บาท</td></tr>
        <tr><td><strong>ยอดเงินที่ต้องชำระ</strong></td><td class="text-right"><strong>${total} บาท</strong></td></tr>
      </table>
    </div>
  `;
}

function renderInvoiceTable(items) {
  const tbody = qs('#invoiceItemsBody');
  if (!tbody) return;
  tbody.innerHTML = items.map(item => `
    <tr>
      <td>${escapeHtml(item.order)}</td>
      <td>${escapeHtml(item.name)}</td>
      <td>${Number(item.amount || 0).toLocaleString()}</td>
    </tr>
  `).join('');
}

async function initInvoiceCreate() {
  const form = qs('#invoiceForm');
  if (!form) return;

  const invoiceId = params.get('invoiceId') || 'new';
  const savedInvoices = getInvoices();
  const existing = savedInvoices.find(x => String(x.id) === String(invoiceId));
  let items = JSON.parse(sessionStorage.getItem(INVOICE_DRAFT_ITEMS_KEY) || 'null')
    || existing?.items
    || [
      { order: 1, name: 'ค่าตรวจแพทย์', amount: 300 },
      { order: 2, name: 'ค่ายา', amount: 150 }
    ];

  renderInvoiceTable(items);

  qs('#addItemLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.setItem(INVOICE_DRAFT_ITEMS_KEY, JSON.stringify(items));
    navigate(`add_invoice_item.html?invoiceId=${encodeURIComponent(invoiceId)}`);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const currentList = getInvoices();
    const newId = generateInvoiceId(currentList);
    const newInvoice = {
      id: newId,
      patientId: qs('#invoicePatientId')?.value.trim() || '-',
      treatmentId: qs('#invoiceTreatmentId')?.value.trim() || '-',
      date: getTodayISODate(),
      patientName: 'ผู้ป่วยใหม่',
      doctorName: 'นพ.วิรุต',
      status: 'pending',
      items: items.map((item, index) => ({
        order: index + 1,
        name: item.name,
        amount: Number(item.amount || 0)
      })),
      coverage: 0
    };

    saveInvoices([newInvoice, ...currentList]);
    sessionStorage.removeItem(INVOICE_DRAFT_ITEMS_KEY);

    showModal('สร้างใบแจ้งหนี้สำเร็จ!', true, () => {
      window.location.href = `invoice_history.html?id=${encodeURIComponent(newId)}`;
    });
  });
}

async function initInvoiceAddItem() {
  const form = qs('#addInvoiceItemForm');
  if (!form) return;

  const invoiceId = params.get('invoiceId') || 'new';
  const savedInvoices = getInvoices();
  const base = savedInvoices.find(x => String(x.id) === String(invoiceId));
  const items = JSON.parse(sessionStorage.getItem(INVOICE_DRAFT_ITEMS_KEY) || 'null')
    || base?.items
    || [
      { order: 1, name: 'ค่าตรวจแพทย์', amount: 300 },
      { order: 2, name: 'ค่ายา', amount: 150 }
    ];

  renderInvoiceTable(items);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const newItem = {
      order: items.length + 1,
      name: qs('#newItemName')?.value.trim() || 'รายการใหม่',
      amount: Number(qs('#newItemAmount')?.value || 0)
    };

    const nextItems = [...items, newItem];
    sessionStorage.setItem(INVOICE_DRAFT_ITEMS_KEY, JSON.stringify(nextItems));
    navigate(`create_invoice.html?invoiceId=${encodeURIComponent(invoiceId)}`);
  });
}

function wireCommonActions() {
  qsa('[data-nav]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.nav)));
  qsa('[data-link]').forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    navigate(el.dataset.link);
  }));
}

window.addEventListener('DOMContentLoaded', () => {
  wireCommonActions();
  if (page === 'medical-history') loadMedicalCertificates();
  if (page === 'medical-create') initMedicalCertificateForm('create');
  if (page === 'medical-edit') initMedicalCertificateForm('edit');
  if (page === 'invoice-history') loadInvoices();
  if (page === 'invoice-create') initInvoiceCreate();
  if (page === 'invoice-add-item') initInvoiceAddItem();
});

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}