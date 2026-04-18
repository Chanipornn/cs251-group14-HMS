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

async function loadMedicalCertificates() {
  const list = await apiFetch('/medical-certificates', {}, () => mockDB.medicalCertificates);
  const selectedId = Number(params.get('id')) || list[0]?.id;
  renderMedicalCertificateList(list, selectedId);
  renderMedicalCertificatePreview(list.find(item => item.id === selectedId) || list[0]);
}

function renderMedicalCertificateList(list, selectedId) {
  const wrap = qs('#recordList');
  if (!wrap) return;
  wrap.innerHTML = list.slice(0, 3).map(item => `
    <article class="record-card ${item.id === selectedId ? 'active' : ''}">
      <div>
        <h3>วันที่ ${formatThaiDate(item.date)}</h3>
        <p>รหัสประจำตัวผู้ป่วย : ${item.patientId}</p>
        <p>รหัสใบรับรองแพทย์ : ${item.id}</p>
        <p>วัตถุประสงค์ : ${item.purpose}</p>
      </div>
      <button class="card-arrow" data-go="medical_certificate_history.html?id=${item.id}">
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    </article>
  `).join('');
  qsa('[data-go]').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.go)));
}

function renderMedicalCertificatePreview(item) {
  const preview = qs('#previewPanel');
  if (!preview || !item) return;
  preview.innerHTML = `
    <div class="paper-center">
      <h3>ใบรับรองแพทย์</h3>
      <p class="mt-8">วันที่ ${formatThaiDate(item.date)}</p>
    </div>
    <div class="paper-section mt-24">
      <p>ข้าพเจ้า ${item.doctorName} รหัสประจำตัวแพทย์ ${item.doctorId}</p>
      <p>ได้ตรวจ นาย/นาง/นางสาว รหัสประจำตัวผู้ป่วย ${item.patientId}</p>
      <p>เมื่อวันที่ ${formatThaiDate(item.date)}</p>
      <p>อาการเบื้องต้น ${item.symptoms}</p>
      <p>ใบรับรองแพทย์นี้ออกให้เพื่อ ${item.purpose}</p>
    </div>
    <div class="paper-sign">
      <p>ลงชื่อ</p>
      <p>${item.doctorName}</p>
    </div>
    <a class="edit-link" href="edit_medical_certificate.html?id=${item.id}">แก้ไข <i class="fa-solid fa-pen-to-square"></i></a>
  `;
}

async function initMedicalCertificateForm(mode) {
  const form = qs('#medicalCertificateForm');
  if (!form) return;
  const id = Number(params.get('id'));
  let item = null;
  if (mode === 'edit' && id) {
    item = await apiFetch(`/medical-certificates/${id}`, {}, () => mockDB.medicalCertificates.find(x => x.id === id));
  }
  qs('#mcPatientId').value = item?.patientId || '6780987';
  qs('#mcDoctorId').value = item?.doctorId || '1112222333';
  qs('#mcDate').value = item?.date || '2026-03-30';
  qs('#mcSymptoms').value = item?.symptoms || '';
  qs('#mcPurpose').value = item?.purpose || '';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      patientId: qs('#mcPatientId').value,
      doctorId: qs('#mcDoctorId').value,
      date: qs('#mcDate').value,
      symptoms: qs('#mcSymptoms').value,
      purpose: qs('#mcPurpose').value
    };
    await apiFetch(mode === 'edit' ? `/medical-certificates/${id}` : '/medical-certificates', {
      method: mode === 'edit' ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    }, { success: true });
    navigate('medical_certificate_history.html');
  });
}

async function loadInvoices() {
  const list = await apiFetch('/invoices', {}, () => mockDB.invoices);
  const selectedId = Number(params.get('id')) || list[0]?.id;
  renderInvoiceList(list, selectedId);
  renderInvoicePreview(list.find(item => item.id === selectedId) || list[0]);
}

function renderInvoiceList(list, selectedId) {
  const wrap = qs('#recordList');
  if (!wrap) return;
  wrap.innerHTML = list.slice(0, 3).map(item => `
    <article class="record-card ${item.id === selectedId ? 'active' : ''}">
      <div>
        <h3>วันที่ ${formatThaiDate(item.date)}</h3>
        <p>รหัสประจำตัวผู้ป่วย : ${item.patientId}</p>
        <p>รายการ : ตรวจทั่วไป</p>
        <p>${statusLabel(item.status)}</p>
      </div>
      <button class="card-arrow" data-go="invoice_history.html?id=${item.id}">
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    </article>
  `).join('');
  qsa('[data-go]').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.go)));
}

function renderInvoicePreview(item) {
  const preview = qs('#previewPanel');
  if (!preview || !item) return;
  const subtotal = item.items.reduce((sum, it) => sum + Number(it.amount), 0);
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
        ${item.items.map(line => `<tr><td>${line.name}</td><td class="text-right">${line.amount} บาท</td></tr>`).join('')}
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
      <td>${item.order}</td>
      <td>${item.name}</td>
      <td>${item.amount}</td>
    </tr>
  `).join('');
}

async function initInvoiceCreate() {
  const form = qs('#invoiceForm');
  if (!form) return;
  const invoiceId = params.get('invoiceId') || '124';
  const existing = mockDB.invoices.find(x => String(x.id) === String(invoiceId)) || mockDB.invoices[0];
  let items = JSON.parse(sessionStorage.getItem('invoiceDraftItems') || 'null') || existing.items;
  renderInvoiceTable(items);

  qs('#addItemLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.setItem('invoiceDraftItems', JSON.stringify(items));
    navigate(`add_invoice_item.html?invoiceId=${invoiceId}`);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      patientId: qs('#invoicePatientId').value,
      treatmentId: qs('#invoiceTreatmentId').value,
      items
    };
    await apiFetch('/invoices', { method: 'POST', body: JSON.stringify(payload) }, { success: true });
    sessionStorage.removeItem('invoiceDraftItems');
    navigate('invoice_history.html');
  });
}

async function initInvoiceAddItem() {
  const form = qs('#addInvoiceItemForm');
  if (!form) return;
  const invoiceId = params.get('invoiceId') || '124';
  const base = mockDB.invoices.find(x => String(x.id) === String(invoiceId)) || mockDB.invoices[0];
  const items = JSON.parse(sessionStorage.getItem('invoiceDraftItems') || 'null') || base.items;
  renderInvoiceTable([...items, { order: items.length + 1, name: 'เพิ่มรายการ', amount: '-' }]);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newItem = {
      order: items.length + 1,
      name: qs('#newItemName').value || 'รายการใหม่',
      amount: Number(qs('#newItemAmount').value || 0)
    };
    const nextItems = [...items, newItem];
    sessionStorage.setItem('invoiceDraftItems', JSON.stringify(nextItems));
    navigate(`create_invoice.html?invoiceId=${invoiceId}`);
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
