package com.example.demo.service;

import com.example.demo.dto.MedicalRecordDTO;
import com.example.demo.model.MedicalRecord;
import com.example.demo.model.Patient;
import com.example.demo.model.Doctor;
import com.example.demo.repository.MedicalRecordRepository;
import com.example.demo.repository.PatientRepository;
import com.example.demo.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    // แก้แดงข้อ 3: ดึงราย Record ด้วย ID
    public MedicalRecordDTO getRecordById(Integer id) {
        return medicalRecordRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    // แก้แดงข้อ 5: ดึงประวัติที่หมอเป็นคนบันทึก
    public List<MedicalRecordDTO> getRecordsByDoctorId(Integer doctorId) {
        return medicalRecordRepository.findByDoctor_DoctorId(doctorId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // สำหรับ Get All และ Patient Filter
    public List<MedicalRecordDTO> getAllRecords() {
        return medicalRecordRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MedicalRecordDTO> getRecordsByPatientId(Integer patientId) {
        return medicalRecordRepository.findByPatient_PatientId(patientId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // สำหรับค้นหาตามช่วงวันที่
    public List<MedicalRecordDTO> getRecordsByDateRange(java.time.LocalDate from, java.time.LocalDate to) {
        return medicalRecordRepository.findByVisitDateBetween(from, to).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // บันทึกข้อมูล
    public MedicalRecordDTO saveRecord(MedicalRecordDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        MedicalRecord entity = MedicalRecord.builder()
                .visitDate(dto.getVisitDate())
                .symptoms(dto.getSymptoms())
                .diagnosis(dto.getDiagnosis())
                .treatmentDetail(dto.getTreatmentDetail())
                .treatmentResult(dto.getTreatmentResult())
                .note(dto.getNote())
                .patient(patient)
                .doctor(doctor)
                .build();

        return convertToDTO(medicalRecordRepository.save(entity));
    }

    // Helper: แปลง Entity เป็น DTO
    private MedicalRecordDTO convertToDTO(MedicalRecord entity) {
        return new MedicalRecordDTO(
                entity.getRecordId(),
                entity.getVisitDate(),
                entity.getSymptoms(),
                entity.getDiagnosis(),
                entity.getTreatmentDetail(),
                entity.getTreatmentResult(),
                entity.getNote(),
                entity.getPatient().getPatientId(),
                entity.getDoctor().getDoctorId()
        );
    }
}