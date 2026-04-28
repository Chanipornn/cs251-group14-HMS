package com.example.demo.dto;

public class PrescriptionDTO {

    private Integer prescriptionId;
    private String medicineName;
    private String dosage;
    private String duration;
    private String instruction;
    private Integer recordId;
    private Integer doctorId;

    public PrescriptionDTO() {}

    public PrescriptionDTO(Integer prescriptionId, String medicineName, String dosage, String duration,
                            String instruction, Integer recordId, Integer doctorId) {
        this.prescriptionId = prescriptionId;
        this.medicineName = medicineName;
        this.dosage = dosage;
        this.duration = duration;
        this.instruction = instruction;
        this.recordId = recordId;
        this.doctorId = doctorId;
    }

    public Integer getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Integer prescriptionId) { this.prescriptionId = prescriptionId; }
    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getInstruction() { return instruction; }
    public void setInstruction(String instruction) { this.instruction = instruction; }
    public Integer getRecordId() { return recordId; }
    public void setRecordId(Integer recordId) { this.recordId = recordId; }
    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }
}