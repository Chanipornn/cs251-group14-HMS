package com.example.demo.repository;

import com.example.demo.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Integer> {
	
    List<MedicalRecord> findByPatient_PatientId(Integer patientId);
    

    @Query("SELECT m FROM MedicalRecord m JOIN FETCH m.patient WHERE m.doctor.doctorId = :doctorId")
    List<MedicalRecord> findRecordsWithPatientByDoctorId(@Param("doctorId") Integer doctorId);
    
    List<MedicalRecord> findByPatient_PatientIdOrderByVisitDateDesc(Integer patientId);
    List<MedicalRecord> findByVisitDateBetween(LocalDate from, LocalDate to);
    List<MedicalRecord> findByDoctor_DoctorIdAndVisitDateBetween(Integer doctorId, LocalDate from, LocalDate to);
}