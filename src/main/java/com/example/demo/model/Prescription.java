package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "Prescription")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PrescriptionID")
    private Integer prescriptionId;

    @Column(name = "MedicineName", nullable = false, length = 100)
    private String medicineName;

    @Column(name = "Dosage", length = 50)
    private String dosage;

    @Column(name = "Duration", length = 50)
    private String duration;

    @Column(name = "Instruction", length = 255)
    private String instruction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RecordID", nullable = false)
    private MedicalRecord medicalRecord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DoctorID", nullable = false)
    private Doctor doctor;
}