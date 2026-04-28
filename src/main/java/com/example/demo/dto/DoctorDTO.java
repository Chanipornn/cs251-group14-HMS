package com.example.demo.dto;

public class DoctorDTO {

    private Integer doctorId;
    private String name;
    private String surname;
    private String specialization;
    private String telephone;
    private String email;
    private Integer departmentId;

    public DoctorDTO() {}

    public DoctorDTO(Integer doctorId, String name, String surname, String specialization,
                     String telephone, String email, Integer departmentId) {
        this.doctorId = doctorId;
        this.name = name;
        this.surname = surname;
        this.specialization = specialization;
        this.telephone = telephone;
        this.email = email;
        this.departmentId = departmentId;
    }

    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getDepartmentId() { return departmentId; }
    public void setDepartmentId(Integer departmentId) { this.departmentId = departmentId; }
}