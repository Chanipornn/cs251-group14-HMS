package com.example.demo.repository;

import com.example.demo.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {
    List<Prescription> findByMedicalRecord_RecordId(Integer recordId);
    List<Prescription> findByDoctor_DoctorId(Integer doctorId);
    List<Prescription> findByMedicineNameContainingIgnoreCase(String medicineName);
}