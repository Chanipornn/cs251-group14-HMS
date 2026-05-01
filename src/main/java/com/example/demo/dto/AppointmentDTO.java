package com.example.demo.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.example.demo.model.Appointment.AppointmentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

public class AppointmentDTO {

    private Integer appointmentId;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate appointmentDate;
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime appointmentTime;
    private Integer queueNumber;
    private Object status;
    private Integer doctorId;
    private Integer patientId;
    
    private String department;
    private String doctorName;
    private String reason;
    private String preparation;
 
    private String patientName;
    private Integer age;
    private Float weight;
    private Float height;


    

	public AppointmentDTO(Integer integer, LocalDate localDate, LocalTime localTime, Integer integer2, String string, Integer integer3, Integer integer4, Object object, Object object2, Object object3, Object object4) {}

    public AppointmentDTO(Integer appointmentId, LocalDate appointmentDate, LocalTime appointmentTime,
                          Integer queueNumber, AppointmentStatus status, Integer doctorId, Integer patientId,String patientName,Integer age,Float weight,Float height) {
        this.appointmentId = appointmentId;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.queueNumber = queueNumber;
        this.status = status;
        this.doctorId = doctorId;
        this.patientId = patientId;
        this.patientName = patientName;
        this.age = age;
        this.weight = weight;
        this.height = height;
    }

    public AppointmentDTO() {
		// TODO Auto-generated constructor stub
	}

	public Integer getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Integer appointmentId) { this.appointmentId = appointmentId; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
    public LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }
    public Integer getQueueNumber() { return queueNumber; }
    public void setQueueNumber(Integer queueNumber) { this.queueNumber = queueNumber; }
    public Object getStatus() { return status; }
    public void setStatus(Object object) { this.status = object; }
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

    public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public Float getWeight() {
		return weight;
	}

	public void setWeight(Float weight) {
		this.weight = weight;
	}

	public Float getHeight() {
		return height;
	}

	public void setHeight(Float height) {
		this.height = height;
	}
    
    public String getDepartment() { 
        return department; 
    }

    public void setDepartment(String department) { 
        this.department = department; 
    }

	

}