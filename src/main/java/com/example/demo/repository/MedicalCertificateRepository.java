package com.example.demo.repository;

import com.example.demo.model.MedicalCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicalCertificateRepository extends JpaRepository<MedicalCertificate, Integer> {
    List<MedicalCertificate> findByPatient_PatientId(Integer patientId);
    List<MedicalCertificate> findByDoctor_DoctorId(Integer doctorId);
    List<MedicalCertificate> findByIssueDateBetween(LocalDate from, LocalDate to);
}