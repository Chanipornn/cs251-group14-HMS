package com.example.demo.dto;

import java.time.LocalDate;

/**
 * DTO ที่ Admin ใช้สร้าง / อัปเดตบัญชี Doctor หรือ Patient
 * รวม field ของทั้ง User, Doctor และ Patient ไว้ในที่เดียว
 */
public class AdminUserDTO {

    // ===== User fields =====
    private String username;
    private String password;
    private String role;          // "Doctor" | "Patient"
    private String email;
    private String telephone;
    private String status;        // "Active" | "Inactive"

    // ===== Doctor fields =====
    private String name;
    private String surname;
    private String specialization;
    private Integer departmentId;

    // ===== Patient fields =====
    private Character gender;
    private LocalDate dateOfBirth;
    private String address;
    private String bloodType;
    private String thaiNationalId;
    private String chronicIllness;
    private String rightToHealthcare;
    private String drugAllergy;
    private Float weight;
    private Float height;

    public AdminUserDTO() {}

    // ===== Getters & Setters =====

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public Integer getDepartmentId() { return departmentId; }
    public void setDepartmentId(Integer departmentId) { this.departmentId = departmentId; }

    public Character getGender() { return gender; }
    public void setGender(Character gender) { this.gender = gender; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }

    public String getThaiNationalId() { return thaiNationalId; }
    public void setThaiNationalId(String thaiNationalId) { this.thaiNationalId = thaiNationalId; }

    public String getChronicIllness() { return chronicIllness; }
    public void setChronicIllness(String chronicIllness) { this.chronicIllness = chronicIllness; }

    public String getRightToHealthcare() { return rightToHealthcare; }
    public void setRightToHealthcare(String rightToHealthcare) { this.rightToHealthcare = rightToHealthcare; }

    public String getDrugAllergy() { return drugAllergy; }
    public void setDrugAllergy(String drugAllergy) { this.drugAllergy = drugAllergy; }

    public Float getWeight() { return weight; }
    public void setWeight(Float weight) { this.weight = weight; }

    public Float getHeight() { return height; }
    public void setHeight(Float height) { this.height = height; }
}