package com.example.demo.controller;

import com.example.demo.dto.DoctorDTO;
import com.example.demo.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;

    //GET All Doctor
    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    //GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Integer id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    //GET Doctor by NOW
    @GetMapping("/me/{userId}")
    public ResponseEntity<DoctorDTO> getMyProfile(@PathVariable Integer userId) {
        return ResponseEntity.ok(doctorService.getDoctorByUserId(userId));
    }

    //UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<DoctorDTO> updateProfile(@PathVariable Integer id, @RequestBody DoctorDTO dto) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, dto));
    }
}