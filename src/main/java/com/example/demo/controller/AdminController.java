package com.example.demo.controller;

import com.example.demo.dto.AdminUserDTO;
import com.example.demo.model.AccountLog;
import com.example.demo.model.UserEntity;
import com.example.demo.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AdminController
 * Base path: /api/admin
 *
 * Endpoints:
 *   GET    /api/admin/users                  - ดึง User ทั้งหมด
 *   GET    /api/admin/users/{id}             - ดึง User ตาม ID
 *   POST   /api/admin/users/doctor           - สร้างบัญชี Doctor
 *   POST   /api/admin/users/patient          - สร้างบัญชี Patient
 *   PUT    /api/admin/users/{id}             - อัปเดตข้อมูล User
 *   PATCH  /api/admin/users/{id}/status      - Toggle Active/Inactive
 *   DELETE /api/admin/users/{id}             - ลบบัญชี
 *   GET    /api/admin/logs                   - ดู AccountLog ทั้งหมด
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ─────────────────────────────────────────────
    //  GET ALL USERS
    // ─────────────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // ─────────────────────────────────────────────
    //  GET USER BY ID
    // ─────────────────────────────────────────────
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(adminService.getUserById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────
    //  CREATE DOCTOR ACCOUNT
    //  Body: { username, password, email, telephone,
    //          name, surname, specialization, departmentId }
    // ─────────────────────────────────────────────
    @PostMapping("/users/doctor")
    public ResponseEntity<?> createDoctor(@RequestBody AdminUserDTO dto) {
        try {
            Map<String, Object> result = adminService.createDoctorAccount(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────
    //  CREATE PATIENT ACCOUNT
    //  Body: { username, password, email, telephone,
    //          name, surname, gender, dateOfBirth,
    //          address, bloodType, thaiNationalId,
    //          chronicIllness, rightToHealthcare,
    //          drugAllergy, weight, height }
    // ─────────────────────────────────────────────
    @PostMapping("/users/patient")
    public ResponseEntity<?> createPatient(@RequestBody AdminUserDTO dto) {
        try {
            Map<String, Object> result = adminService.createPatientAccount(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────
    //  UPDATE USER
    //  Body (partial): { username?, email?, telephone?,
    //                    status?, password? }
    // ─────────────────────────────────────────────
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id,
                                        @RequestBody AdminUserDTO dto) {
        try {
            UserEntity updated = adminService.updateUser(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────
    //  TOGGLE STATUS  Active ↔ Inactive
    // ─────────────────────────────────────────────
    @PatchMapping("/users/{id}/status")
    public ResponseEntity<?> toggleStatus(@PathVariable Integer id) {
        try {
            UserEntity updated = adminService.toggleStatus(id);
            return ResponseEntity.ok(Map.of(
                    "userId", updated.getUserId(),
                    "status", updated.getStatus()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────
    //  DELETE USER
    // ─────────────────────────────────────────────
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────
    //  GET ACCOUNT LOGS
    // ─────────────────────────────────────────────
    @GetMapping("/logs")
    public ResponseEntity<List<AccountLog>> getLogs() {
        return ResponseEntity.ok(adminService.getAllLogs());
    }
}