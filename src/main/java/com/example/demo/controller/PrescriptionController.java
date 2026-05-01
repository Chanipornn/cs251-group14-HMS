package com.example.demo.controller;

import com.example.demo.dto.PrescriptionDTO;
import com.example.demo.dto.PrescriptionHistoryProjection;
import com.example.demo.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @GetMapping("/record/{recordId}")
    public ResponseEntity<List<PrescriptionDTO>> getByRecord(@PathVariable Integer recordId) {
        List<PrescriptionDTO> list = prescriptionService.getByRecordId(recordId);
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<PrescriptionDTO> createPrescription(@RequestBody PrescriptionDTO dto) {
        return new ResponseEntity<>(prescriptionService.savePrescription(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrescriptionDTO> updatePrescription(
            @PathVariable Integer id, 
            @RequestBody PrescriptionDTO dto) {
        return ResponseEntity.ok(prescriptionService.updatePrescription(id, dto));
    }
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<PrescriptionHistoryProjection>> getPrescriptionHistoryForDoctor(@PathVariable Integer doctorId) {
        List<PrescriptionHistoryProjection> history = prescriptionService.getPrescriptionHistoryByDoctorId(doctorId);
        return ResponseEntity.ok(history);
    }
}