package com.example.demo.repository;

import com.example.demo.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {
	
    Optional<Patient> findByThaiNationalId(String thaiNationalId);
    Optional<Patient> findByUser_UserId(Integer userId);
    
    List<Patient> findByStaff_StaffId(Integer staffId);
    List<Patient> findByNameContainingIgnoreCaseOrSurnameContainingIgnoreCase(String name, String surname);
    
    boolean existsByThaiNationalId(String thaiNationalId);
}