package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.dto.*;
import com.example.demo.mapper.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalCertificateService {
	
	 	private final MedicalCertificateRepository repo;
	    private final PatientRepository patientRepo;
	    private final DoctorRepository doctorRepo;

	    // CREATE
	    public MedicalCertificateDTO create(MedicalCertificate c) {

	        Patient patient = patientRepo.findById(c.getPatient().getPatientId())
	                .orElseThrow(() -> new RuntimeException("Patient not found"));

	        Doctor doctor = doctorRepo.findById(c.getDoctor().getDoctorId())
	                .orElseThrow(() -> new RuntimeException("Doctor not found"));

	        c.setPatient(patient);
	        c.setDoctor(doctor);
	        c.setIssueDate(LocalDate.now());

	        return MedicalCertificateMapper.toDTO(repo.save(c));
	    }

	    // GET by patient
	    public List<MedicalCertificateDTO> getByPatient(Integer patientId) {
	        return repo.findByPatient_PatientId(patientId)
	                .stream()
	                .map(MedicalCertificateMapper::toDTO)
	                .toList();
	    }

}
