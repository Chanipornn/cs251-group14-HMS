package com.example.demo.repository;

import com.example.demo.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {
    Optional<Staff> findByUser_UserId(Integer userId);
    List<Staff> findByPosition(String position);
    List<Staff> findByNameContainingIgnoreCaseOrSurnameContainingIgnoreCase(String name, String surname);
}