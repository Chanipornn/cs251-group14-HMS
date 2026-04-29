package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Doctor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DoctorID")
    private Integer doctorId;

    @Column(name = "Name", nullable = false, length = 50)
    private String name;

    @Column(name = "Surname", nullable = false, length = 50)
    private String surname;

    @Column(name = "Specialization", length = 100)
    private String specialization;

    @Column(name = "Telephone", length = 10)
    private String telephone;

    @Column(name = "Email", length = 100)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DepartmentID")
    private Department department;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false, unique = true)
    private UserEntity user;

    @JsonIgnore
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Appointment> appointments;

    @JsonIgnore
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MedicalRecord> medicalRecords;

    @JsonIgnore
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Prescription> prescriptions;

    @JsonIgnore
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MedicalCertificate> certificates;
}