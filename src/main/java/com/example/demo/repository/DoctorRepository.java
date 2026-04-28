package com.example.demo.repository;

import com.example.demo.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    Optional<Doctor> findByUser_UserId(Integer userId);
    List<Doctor> findByDepartment_DepartmentId(Integer departmentId);
    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);
    List<Doctor> findByNameContainingIgnoreCaseOrSurnameContainingIgnoreCase(String name, String surname);
}