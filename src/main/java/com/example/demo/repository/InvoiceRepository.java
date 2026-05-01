package com.example.demo.repository;

import com.example.demo.model.Invoice;
import com.example.demo.model.Invoice.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    List<Invoice> findByPatient_PatientId(Integer patientId);
    List<Invoice> findByStatus(PaymentStatus status);
    Optional<Invoice> findByMedicalRecord_RecordId(Integer recordId);
    List<Invoice> findByPatient_PatientIdAndStatus(Integer patientId, PaymentStatus status);
    List<Invoice> findByMedicalRecord_Doctor_DoctorId(Integer doctorId);

}