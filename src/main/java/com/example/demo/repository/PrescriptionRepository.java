package com.example.demo.repository;

import com.example.demo.dto.PrescriptionDTO;
import com.example.demo.dto.PrescriptionHistoryProjection;
import com.example.demo.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {
    List<Prescription> findByMedicalRecord_RecordId(Integer recordId);
    List<Prescription> findByDoctor_DoctorId(Integer doctorId);
    List<Prescription> findByMedicineNameContainingIgnoreCase(String medicineName);
    
    @Query(value = "SELECT " +
            "pr.PrescriptionID as prescriptionId, pr.MedicineName as medicineName, " +
            "pr.Dosage as dosage, pr.Duration as duration, pr.Instruction as instruction, " +
            "inv.InvoiceID as invoiceId, inv.TotalAmount as totalAmount, inv.Status as invoiceStatus, " +
            "pat.PatientID as patientId, pat.Name as patientName, pat.Surname as patientSurname, " +
            "mr.VisitDate as visitDate " +
            "FROM Prescription pr " +
            "JOIN MedicalRecord mr ON pr.RecordID = mr.RecordID " +
            "LEFT JOIN Invoice inv ON mr.RecordID = inv.RecordID " + // ใช้ LEFT JOIN เผื่อเคสที่ยังไม่ได้ออกบิล
            "JOIN Patient pat ON mr.PatientID = pat.PatientID " +
            "WHERE pr.DoctorID = :doctorId", 
            nativeQuery = true)
    List<PrescriptionHistoryProjection> findHistoryByDoctorId(@Param("doctorId") Integer doctorId);
}