package com.example.demo.service;

import com.example.demo.dto.DoctorDTO;
import com.example.demo.model.Doctor;
import com.example.demo.model.Department;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepo;
    private final DepartmentRepository departmentRepo;

    //GET All Doctor
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    //GET by ID
    public DoctorDTO getDoctorById(Integer id) {
        return doctorRepo.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + id));
    }

    //GET Doctor by User ID
    public DoctorDTO getDoctorByUserId(Integer userId) {
        return doctorRepo.findByUser_UserId(userId)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Doctor not found for User ID: " + userId));
    }

    //UPDATE
    @Transactional
    public DoctorDTO updateDoctor(Integer id, DoctorDTO dto) {
        Doctor doctor = doctorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        doctor.setName(dto.getName());
        doctor.setSurname(dto.getSurname());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setTelephone(dto.getTelephone());
        doctor.setEmail(dto.getEmail());
        
        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepo.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            doctor.setDepartment(dept);
        }

        return convertToDTO(doctorRepo.save(doctor));
    }

    private DoctorDTO convertToDTO(Doctor doctor) {
        return new DoctorDTO(
                doctor.getDoctorId(),
                doctor.getName(),
                doctor.getSurname(),
                doctor.getSpecialization(),
                doctor.getTelephone(),
                doctor.getEmail(),
                doctor.getDepartment() != null ? doctor.getDepartment().getDepartmentId() : null
        );
    }
}