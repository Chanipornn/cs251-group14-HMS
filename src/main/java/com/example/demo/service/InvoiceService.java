package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;

import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

	@Autowired
	private InvoiceRepository invoiceRepository;

	private final InvoiceRepository invoiceRepo;
	private final InvoiceItemRepository itemRepo;
	private final PatientRepository patientRepo;
	private final MedicalRecordRepository recordRepo;

	// Create
	@Transactional
	public InvoiceDTO createInvoice(InvoiceDTO dto) {
		Patient patient = patientRepo.findById(dto.getPatientId())
				.orElseThrow(() -> new RuntimeException("Patient not found"));
		MedicalRecord record = recordRepo.findById(dto.getRecordId())
				.orElseThrow(() -> new RuntimeException("Medical Record not found"));

		Invoice invoice = Invoice.builder().invoiceDate(LocalDate.now()).totalAmount(BigDecimal.ZERO) // เริ่มต้นที่ 0
				.status(Invoice.PaymentStatus.UNPAID).patient(patient).medicalRecord(record).build();

		return convertToDTO(invoiceRepo.save(invoice));
	}

	// Add Invoice Item
	@Transactional
	public InvoiceItemDTO addItem(InvoiceItemDTO itemDto) {
		Invoice invoice = invoiceRepo.findById(itemDto.getInvoiceId())
				.orElseThrow(() -> new RuntimeException("Invoice not found"));

		InvoiceItem item = InvoiceItem.builder().description(itemDto.getDescription()).amount(itemDto.getAmount())
				.invoice(invoice).build();

		InvoiceItem savedItem = itemRepo.save(item);

		// Update Invoice
		BigDecimal newTotal = invoice.getTotalAmount().add(itemDto.getAmount());
		invoice.setTotalAmount(newTotal);
		invoiceRepo.save(invoice);

		return new InvoiceItemDTO(savedItem.getItemId(), savedItem.getDescription(), savedItem.getAmount(),
				invoice.getInvoiceId());
	}

	// GET by ID
	public List<InvoiceDTO> getHistoryByPatient(Integer patientId) {
		return invoiceRepo.findByPatient_PatientId(patientId).stream().map(this::convertToDTO)
				.collect(Collectors.toList());
	}

	// Get Item by Item ID
	public List<InvoiceItemDTO> getInvoiceItems(Integer invoiceId) {
		return itemRepo.findByInvoice_InvoiceId(invoiceId).stream()
				.map(item -> new InvoiceItemDTO(item.getItemId(), item.getDescription(), item.getAmount(), invoiceId))
				.collect(Collectors.toList());
	}

	// ✅ GET by DoctorID (ใหม่)
	public List<InvoiceDTO> getByDoctor(Integer doctorId) {
		return invoiceRepo.findByMedicalRecord_Doctor_DoctorId(doctorId).stream().map(this::convertToDTO)
				.collect(Collectors.toList());
	}

	private InvoiceDTO convertToDTO(Invoice entity) {
		InvoiceDTO dto = new InvoiceDTO(entity.getInvoiceId(), entity.getInvoiceDate(), entity.getTotalAmount(),
				entity.getStatus().name(), entity.getPaymentMethod(), entity.getPaidDate(),
				entity.getPatient().getPatientId(), entity.getMedicalRecord().getRecordId(), null, null, null, null);

		dto.setPatientName(entity.getPatient().getName() + " " + entity.getPatient().getSurname());
		dto.setDoctorName(entity.getMedicalRecord().getDoctor().getName() + " "
				+ entity.getMedicalRecord().getDoctor().getSurname());
		dto.setDiagnosis(entity.getMedicalRecord().getDiagnosis());

		if (entity.getMedicalRecord().getDoctor().getDepartment() != null) {
			dto.setDepartment(entity.getMedicalRecord().getDoctor().getDepartment().getDepName());
		}

		return dto;
	}

	public List<InvoiceDTO> getAllInvoices() {
		// ดึงข้อมูลทั้งหมดจาก Database (สมมติว่าคุณมี invoiceRepository)
		// ตรงนี้คุณต้องนำข้อมูลมาแปลงเป็น InvoiceDTO ตามรูปแบบที่คุณทำในโปรเจกต์ครับ
		return invoiceRepository.findAll().stream().map(invoice -> {
			InvoiceDTO dto = new InvoiceDTO();
			// ... map ข้อมูล ...
			return dto;
		}).collect(Collectors.toList());
	}
}