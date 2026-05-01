package com.example.demo.controller;

import com.example.demo.model.Patient;
import com.example.demo.service.PatientService;
import com.example.demo.dto.PatientDTO;
import com.example.demo.dto.PatientRegisterRequestDTO;
import com.example.demo.repository.PatientRepository;
import org.springframework.http.ResponseEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin
public class PatientController {
	
	@Autowired
    private PatientService service;
	
	@Autowired
	private PatientRepository patientRepository;

    // GET ALL
    @GetMapping
    public List<PatientDTO> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public PatientDTO getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // CREATE
    @PostMapping
    public Patient create(@RequestBody Patient p) {
        return service.create(p);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Patient update(@PathVariable Integer id, @RequestBody Patient p) {
        return service.update(id, p);
    }
    
    @PutMapping("/{id}/thai-id")
    public ResponseEntity<?> updateThaiId(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {

        Optional<Patient> patientOpt = patientRepository.findById(id);

        if (patientOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Patient not found");
        }
        
        String thaiId = body.get("thaiNationalId");

        // เช็คซ้ำก่อน
        Optional<Patient> existing = patientRepository.findByThaiNationalId(thaiId);
        if (existing.isPresent() && !existing.get().getPatientId().equals(id)) {
            return ResponseEntity.badRequest().body("Thai ID already exists");
        }

        Patient patient = patientOpt.get();
        patient.setThaiNationalId(thaiId);

        // mock สิทธิ
        patient.setRightToHealthcare("Gold Card");
        patientRepository.save(patient);

        return ResponseEntity.ok(patient);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    // SEARCH
    @GetMapping("/search")
    public List<PatientDTO> search(@RequestParam String keyword) {
        return service.search(keyword);
    }

    // FILTER BY STAFF
    @GetMapping("/staff/{id}")
    public List<PatientDTO> getByStaff(@PathVariable Integer id) {
        return service.getByStaff(id);
    }
    
    @PostMapping("/register")
    public Patient register(@RequestBody PatientRegisterRequestDTO req) {
        return service.register(req);
    }
}
