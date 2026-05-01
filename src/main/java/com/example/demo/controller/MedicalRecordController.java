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

    @GetMapping
    public ResponseEntity<List<MedicalRecordDTO>> getAllMedicalRecords(
            @RequestParam(required = false) Integer patientId) {
        
        List<MedicalRecordDTO> records;
        if (patientId != null) {
            records = medicalRecordService.getRecordsByPatientId(patientId);
        } else {
            records = medicalRecordService.getAllRecords();
        }
        return ResponseEntity.ok(records);
    }

    @PostMapping
    public ResponseEntity<MedicalRecordDTO> createMedicalRecord(@RequestBody MedicalRecordDTO medicalRecordDTO) {
        MedicalRecordDTO savedRecord = medicalRecordService.saveRecord(medicalRecordDTO);
        return new ResponseEntity<>(savedRecord, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecordDTO> getMedicalRecordById(@PathVariable Integer id) {
        MedicalRecordDTO record = medicalRecordService.getRecordById(id); 
        return record != null ? ResponseEntity.ok(record) : ResponseEntity.notFound().build();
    }

    @GetMapping("/search/date")
    public ResponseEntity<List<MedicalRecordDTO>> getRecordsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        
        List<MedicalRecordDTO> records = medicalRecordService.getRecordsByDateRange(from, to);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<MedicalRecordDTO>> getRecordsByDoctor(@PathVariable Integer doctorId) {
        List<MedicalRecordDTO> records = medicalRecordService.getRecordsByDoctorId(doctorId);
        return ResponseEntity.ok(records);
    }
}