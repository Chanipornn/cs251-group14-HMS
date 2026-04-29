package com.example.demo.controller;

import com.example.demo.dto.MedicalRecordDTO;
import com.example.demo.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = "*")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    // 1. หน้า Medical Record (รวมการดึงทั้งหมด หรือกรองตามคนไข้)
    @GetMapping
    public ResponseEntity<List<MedicalRecordDTO>> getAllMedicalRecords(
            @RequestParam(required = false) Integer patientId) {
        
        List<MedicalRecordDTO> records;
        if (patientId != null) {
            // ดึงประวัติเฉพาะคนไข้ (ใช้ findByPatient_PatientId จาก Repository)
            records = medicalRecordService.getRecordsByPatientId(patientId);
        } else {
            // ดึงทั้งหมด
            records = medicalRecordService.getAllRecords();
        }
        return ResponseEntity.ok(records);
    }

    // 2. เพิ่ม Medical Record
    @PostMapping
    public ResponseEntity<MedicalRecordDTO> createMedicalRecord(@RequestBody MedicalRecordDTO medicalRecordDTO) {
        MedicalRecordDTO savedRecord = medicalRecordService.saveRecord(medicalRecordDTO);
        return new ResponseEntity<>(savedRecord, HttpStatus.CREATED);
    }

    // 3. รายละเอียดประวัติ (ดึงราย Record ด้วย ID)
    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecordDTO> getMedicalRecordById(@PathVariable Integer id) {
        // ต้องดึงเป็นราย Record ID ไม่ใช่ List ของ Patient
        MedicalRecordDTO record = medicalRecordService.getRecordById(id); 
        return record != null ? ResponseEntity.ok(record) : ResponseEntity.notFound().build();
    }

    // 4. เพิ่มเติม: ค้นหาประวัติในช่วงวันที่ (ใช้ findByVisitDateBetween ใน Repository)
    @GetMapping("/search/date")
    public ResponseEntity<List<MedicalRecordDTO>> getRecordsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        
        List<MedicalRecordDTO> records = medicalRecordService.getRecordsByDateRange(from, to);
        return ResponseEntity.ok(records);
    }

 // 5. ดูประวัติที่หมอคนนี้เป็นคนบันทึก
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<MedicalRecordDTO>> getRecordsByDoctor(@PathVariable Integer doctorId) {
        // ต้องเรียก Method ที่ไปหาจาก DoctorId ใน Repository
        List<MedicalRecordDTO> records = medicalRecordService.getRecordsByDoctorId(doctorId);
        return ResponseEntity.ok(records);
    }
}