package com.example.demo.dto;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

public class PatientDTO {

    private Integer patientId;
    private String name;
    private String surname;
    private Character gender;
    
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate dateOfBirth;
    
    private String telephone;
    private String address;
    private String bloodType;
    private String thaiNationalId;
    private String chronicIllness;
    private String rightToHealthcare;
    private String drugAllergy;
    private Float weight;
    private Float height;

    public PatientDTO() {}

    public PatientDTO(Integer patientId, String name, String surname, Character gender, LocalDate dateOfBirth,
                      String telephone, String address, String bloodType, String thaiNationalId,
                      String chronicIllness, String rightToHealthcare, String drugAllergy,
                      Float weight, Float height) {
        this.patientId = patientId;
        this.name = name;
        this.surname = surname;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.telephone = telephone;
        this.address = address;
        this.bloodType = bloodType;
        this.thaiNationalId = thaiNationalId;
        this.chronicIllness = chronicIllness;
        this.rightToHealthcare = rightToHealthcare;
        this.drugAllergy = drugAllergy;
        this.weight = weight;
        this.height = height;
    }

    public Integer getPatientId() { return patientId; }
    public void setPatientId(Integer patientId) { this.patientId = patientId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }
    public Character getGender() { return gender; }
    public void setGender(Character gender) { this.gender = gender; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
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