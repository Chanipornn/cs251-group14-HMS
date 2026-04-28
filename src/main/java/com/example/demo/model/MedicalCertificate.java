package com.example.demo.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "MedicalCertificate")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CertificateID")
    private Integer certificateId;

    @Column(name = "IssueDate", nullable = false)
    private LocalDate issueDate;

    @Column(name = "Description", length = 255)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PatientID", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DoctorID", nullable = false)
    private Doctor doctor;
}