package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "MedicalRecord")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RecordID")
    private Integer recordId;

    @Column(name = "VisitDate", nullable = false)
    private LocalDate visitDate;

    @Column(name = "Symptoms", length = 255)
    private String symptoms;

    @Column(name = "Diagnosis", length = 255)
    private String diagnosis;

    @Column(name = "TreatmentDetail", length = 255)
    private String treatmentDetail;

    @Column(name = "TreatmentResult", length = 100)
    private String treatmentResult;

    @Column(name = "Note", length = 255)
    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PatientID", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DoctorID", nullable = false)
    private Doctor doctor;

    @OneToMany(mappedBy = "medicalRecord", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Prescription> prescriptions;

    @OneToOne(mappedBy = "medicalRecord", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Invoice invoice;
}