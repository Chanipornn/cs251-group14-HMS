package com.example.demo.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "Patient")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PatientID")
    private Integer patientId;

    @Column(name = "Name", nullable = false, length = 64)
    private String name;

    @Column(name = "Surname", nullable = false, length = 64)
    private String surname;

    @Column(name = "Gender", length = 1)
    private Character gender;

    @Column(name = "DateOfBirth")
    private LocalDate dateOfBirth;

    @Column(name = "Telephone", length = 10)
    private String telephone;

    @Column(name = "Address", length = 255)
    private String address;

    @Column(name = "BloodType", length = 3)
    private String bloodType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StaffID")
    private Staff staff;

    @Column(name = "ThaiNationalID", unique = true, length = 13)
    private String thaiNationalId;

    @Column(name = "ChronicIllness", length = 255)
    private String chronicIllness;

    @Column(name = "RightToHealthcare", length = 50)
    private String rightToHealthcare;

    @Column(name = "DrugAllergy", length = 255)
    private String drugAllergy;

    @Column(name = "Weight")
    private Float weight;

    @Column(name = "Height")
    private Float height;

    // User relation
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false, unique = true)
    private UserEntity user;

    @JsonFormat(
    	    pattern = "dd-MM-yyyy (HH:mm)",
    	    timezone = "Asia/Bangkok",
    	    locale = "en"
    	)
    //@Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @JsonFormat(
    	    pattern = "dd-MM-yyyy (HH:mm)",
    	    timezone = "Asia/Bangkok",
    	    locale = "en"
    	)
    //@Column(name = "updated_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    
    // ความสัมพันธ์กับตารางอื่น
    //กัน loop
    @JsonIgnore 
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Appointment> appointments;

    @JsonIgnore
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MedicalRecord> medicalRecords;

    @JsonIgnore
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MedicalCertificate> certificates;

    @JsonIgnore
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Invoice> invoices;
}