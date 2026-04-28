package com.example.demo.dto;

import java.time.LocalDate;

public class MedicalCertificateDTO {

    private Integer certificateId;
    private LocalDate issueDate;
    private String description;
    private Integer patientId;
    private Integer doctorId;

    public MedicalCertificateDTO() {}

    public MedicalCertificateDTO(Integer certificateId, LocalDate issueDate, String description,
                                  Integer patientId, Integer doctorId) {
        this.certificateId = certificateId;
        this.issueDate = issueDate;
        this.description = description;
        this.patientId = patientId;
        this.doctorId = doctorId;
    }

    public Integer getCertificateId() { return certificateId; }
    public void setCertificateId(Integer certificateId) { this.certificateId = certificateId; }
    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getPatientId() { return patientId; }
    public void setPatientId(Integer patientId) { this.patientId = patientId; }
    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }
}