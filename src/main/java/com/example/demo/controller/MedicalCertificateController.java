package com.example.demo.controller;

import com.example.demo.model.MedicalCertificate;
import com.example.demo.dto.MedicalCertificateDTO;
import com.example.demo.service.MedicalCertificateService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedicalCertificateController {
	
		private final MedicalCertificateService service;

	    // CREATE
	    @PostMapping
	    public MedicalCertificateDTO create(@RequestBody MedicalCertificate c) {
	        return service.create(c);
	    }
	    
	    // Get by ID
	    @GetMapping("/{id}")
	    public MedicalCertificateDTO getById(@PathVariable Integer id) {
	        return service.getById(id);
	    }
	    
	    // UPDATE
	    @PutMapping("/{id}")
	    public MedicalCertificateDTO update(@PathVariable Integer id, @RequestBody MedicalCertificateDTO dto) {
	        return service.update(id, dto);
	    }

	    // GET by patient
	    @GetMapping("/patient/{id}")
	    public List<MedicalCertificateDTO> getByPatient(@PathVariable Integer id) {
	        return service.getByPatient(id);
	    }
	    // GET by Doctor	    
	    @GetMapping("/doctor/{id}")
	    public List<MedicalCertificateDTO> getByDoctor(@PathVariable Integer id) {
	        return service.getByDoctor(id);
	    }

}
