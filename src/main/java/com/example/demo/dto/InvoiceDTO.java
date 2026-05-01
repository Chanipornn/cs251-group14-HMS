package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class InvoiceDTO {

    private Integer invoiceId;
    private LocalDate invoiceDate;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
    private LocalDate paidDate;
    private Integer patientId;
    private Integer recordId;
    //
    private String patientName;
    private String doctorName;
    private String department;
    private String diagnosis;

    public InvoiceDTO() {}

	public InvoiceDTO(Integer invoiceId, LocalDate invoiceDate, BigDecimal totalAmount, String status,
                      String paymentMethod, LocalDate paidDate, Integer patientId, Integer recordId, String patientName,String doctorName,String department,String diagnosis) {
        this.invoiceId = invoiceId;
        this.invoiceDate = invoiceDate;
        this.totalAmount = totalAmount;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.paidDate = paidDate;
        this.patientId = patientId;
        this.recordId = recordId;
        
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.department = department;
        this.diagnosis = diagnosis;
    }

    public Integer getInvoiceId() { return invoiceId; }
    public void setInvoiceId(Integer invoiceId) { this.invoiceId = invoiceId; }
    public LocalDate getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate; }
    public Integer getPatientId() { return patientId; }
    public void setPatientId(Integer patientId) { this.patientId = patientId; }
    public Integer getRecordId() { return recordId; }
    public void setRecordId(Integer recordId) { this.recordId = recordId; }
    public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}

	public String getDoctorName() {
		return doctorName;
	}

	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getDiagnosis() {
		return diagnosis;
	}

	public void setDiagnosis(String diagnosis) {
		this.diagnosis = diagnosis;
	}
}