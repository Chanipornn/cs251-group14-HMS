package com.example.demo.dto;

import java.time.LocalDate;

public class MedicalRecordDTO {

	private Integer recordId;
	private LocalDate visitDate;
	private String symptoms;
	private String diagnosis;
	private String treatmentDetail;
	private String treatmentResult;
	private String note;
	private Integer patientId;
	private String patientName;
	private Integer doctorId;

	public MedicalRecordDTO() {
	}

	public MedicalRecordDTO(Integer recordId, LocalDate visitDate, String symptoms, String diagnosis,
			String treatmentDetail, String treatmentResult, String note, Integer patientId,String patientFullName, Integer doctorId) {
		this.recordId = recordId;
		this.visitDate = visitDate;
		this.symptoms = symptoms;
		this.diagnosis = diagnosis;
		this.treatmentDetail = treatmentDetail;
		this.treatmentResult = treatmentResult;
		this.note = note;
		this.patientId = patientId;
		this.patientName = patientFullName;
		this.doctorId = doctorId;
	}

	public Integer getRecordId() {
		return recordId;
	}

	public void setRecordId(Integer recordId) {
		this.recordId = recordId;
	}

	public LocalDate getVisitDate() {
		return visitDate;
	}

	public void setVisitDate(LocalDate visitDate) {
		this.visitDate = visitDate;
	}

	public String getSymptoms() {
		return symptoms;
	}

	public void setSymptoms(String symptoms) {
		this.symptoms = symptoms;
	}

	public String getDiagnosis() {
		return diagnosis;
	}

	public void setDiagnosis(String diagnosis) {
		this.diagnosis = diagnosis;
	}

	public String getTreatmentDetail() {
		return treatmentDetail;
	}

	public void setTreatmentDetail(String treatmentDetail) {
		this.treatmentDetail = treatmentDetail;
	}

	public String getTreatmentResult() {
		return treatmentResult;
	}

	public void setTreatmentResult(String treatmentResult) {
		this.treatmentResult = treatmentResult;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public Integer getPatientId() {
		return patientId;
	}

	public void setPatientId(Integer patientId) {
		this.patientId = patientId;
	}

	public Integer getDoctorId() {
		return doctorId;
	}

	public void setDoctorId(Integer doctorId) {
		this.doctorId = doctorId;
	}

	public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
}