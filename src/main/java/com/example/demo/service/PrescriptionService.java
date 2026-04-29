package com.example.demo.service;

import com.example.demo.dto.PrescriptionDTO;
import com.example.demo.model.Prescription;
import com.example.demo.model.MedicalRecord;
import com.example.demo.model.Doctor;
import com.example.demo.repository.PrescriptionRepository;
import com.example.demo.repository.MedicalRecordRepository;
import com.example.demo.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public List<PrescriptionDTO> getByRecordId(Integer recordId) {
        return prescriptionRepository.findByMedicalRecord_RecordId(recordId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PrescriptionDTO savePrescription(PrescriptionDTO dto) {
        MedicalRecord record = medicalRecordRepository.findById(dto.getRecordId())
                .orElseThrow(() -> new RuntimeException("Medical Record not found"));
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Prescription entity = Prescription.builder()
                .medicineName(dto.getMedicineName())
                .dosage(dto.getDosage())
                .duration(dto.getDuration())
                .instruction(dto.getInstruction())
                .medicalRecord(record)
                .doctor(doctor)
                .build();

        return convertToDTO(prescriptionRepository.save(entity));
    }

    @Transactional
    public PrescriptionDTO updatePrescription(Integer id, PrescriptionDTO dto) {
        Prescription existing = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        
        existing.setMedicineName(dto.getMedicineName());
        existing.setDosage(dto.getDosage());
        existing.setDuration(dto.getDuration());
        existing.setInstruction(dto.getInstruction());
        
        return convertToDTO(prescriptionRepository.save(existing));
    }

    private PrescriptionDTO convertToDTO(Prescription entity) {
        return new PrescriptionDTO(
                entity.getPrescriptionId(),
                entity.getMedicineName(),
                entity.getDosage(),
                entity.getDuration(),
                entity.getInstruction(),
                entity.getMedicalRecord().getRecordId(),
                entity.getDoctor().getDoctorId()
        );
    }
}