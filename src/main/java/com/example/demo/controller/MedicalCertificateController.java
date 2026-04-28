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
public class MedicalCertificateController {
	
		private final MedicalCertificateService service;

	    // CREATE
	    @PostMapping
	    public MedicalCertificateDTO create(@RequestBody MedicalCertificate c) {
	        return service.create(c);
	    }

	    // GET by patient
	    @GetMapping("/patient/{id}")
	    public List<MedicalCertificateDTO> getByPatient(@PathVariable Integer id) {
	        return service.getByPatient(id);
	    }

}
