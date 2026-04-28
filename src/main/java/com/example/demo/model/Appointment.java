package com.example.demo.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Appointment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AppointmentID")
    private Integer appointmentId;

    @Column(name = "AppointmentDate", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "AppointmentTime", nullable = false)
    private LocalTime appointmentTime;

    @Column(name = "QueueNumber")
    private Integer queueNumber;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "Status", columnDefinition = "INT DEFAULT 1")
    private AppointmentStatus status = AppointmentStatus.COMPLETED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DoctorID", nullable = false)
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PatientID", nullable = false)
    private Patient patient;

    public enum AppointmentStatus {
        CANCELLED,  // 0 = ยกเลิก
        COMPLETED,  // 1 = นัดสำเร็จ
        POSTPONED,  // 2 = เลื่อนนัด
        WAITING     // 3 = รอเข้าพบ
    }
}