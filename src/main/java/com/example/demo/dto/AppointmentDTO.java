package com.example.demo.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public class AppointmentDTO {

    private Integer appointmentId;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate appointmentDate;
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime appointmentTime;
    private Integer queueNumber;
    private String status;
    private Integer doctorId;
    private Integer patientId;
    
    private String department;
    private String doctorName;
    private String reason;
    private String preparation;

    public AppointmentDTO() {}

    public AppointmentDTO(Integer appointmentId, LocalDate appointmentDate, LocalTime appointmentTime,
                          Integer queueNumber, String status, Integer doctorId, Integer patientId) {
        this.appointmentId = appointmentId;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.queueNumber = queueNumber;
        this.status = status;
        this.doctorId = doctorId;
        this.patientId = patientId;
    }

    public Integer getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Integer appointmentId) { this.appointmentId = appointmentId; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
    public LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }
    public Integer getQueueNumber() { return queueNumber; }
    public void setQueueNumber(Integer queueNumber) { this.queueNumber = queueNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }
    public Integer getPatientId() { return patientId; }
    public void setPatientId(Integer patientId) { this.patientId = patientId; }
    
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getPreparation() { return preparation; }
    public void setPreparation(String preparation) { this.preparation = preparation; }
    
    public String getDepartment() { 
        return department; 
    }

    public void setDepartment(String department) { 
        this.department = department; 
    }
    
    
}