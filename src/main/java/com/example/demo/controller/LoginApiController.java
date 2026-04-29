package com.example.demo.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.UserEntity;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.PatientRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

/*
 	POST   /api/auth/patient/login
	GET    /api/auth/patient/me
	POST   /api/auth/patient/logout
 */

@RestController
@RequestMapping("/api/auth/patient")
public class LoginApiController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<Map> login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {

        String email = credentials.get("Email");
        String password = credentials.get("Password");

        try {
            Optional<UserEntity> userOptional = userRepository.findByEmail(email);

            if (userOptional.isPresent()) {
                UserEntity user = userOptional.get();

                boolean isMatch = false;
                String dbPassword = user.getPassword();

                // bcrypt
                if (dbPassword.startsWith("$2a$")) {
                    isMatch = org.springframework.security.crypto.bcrypt.BCrypt
                            .checkpw(password, dbPassword);
                }
                // plain
                else {
                    isMatch = dbPassword.equals(password);
                }

                if (isMatch) {
                    HttpSession session = request.getSession();
                    session.setAttribute("loggedInUser", user.getEmail());
                    session.setAttribute("userRole", user.getRole());

                    Integer patientId = patientRepository
                            .findByUser_UserId(user.getUserId())
                            .map(p -> p.getPatientId())
                            .orElse(null);

                    return ResponseEntity.ok(
                            Map.of(
                                    "status", true,
                                    "message", "Login successful",
                                    "name", user.getUsername(),
                                    "email", user.getEmail(),
                                    "role", user.getRole(),
                                    "patientId", patientId
                            )
                    );
                }
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", false, "message", "อีเมลหรือรหัสผ่านไม่ถูกต้อง"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", false, "message", "เกิดข้อผิดพลาดในระบบเซิร์ฟเวอร์"));
        }
    }

    // ================= CURRENT USER =================
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        String loggedInEmail = (String) session.getAttribute("loggedInUser");

        if (loggedInEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", false, "message", "กรุณาล็อคอินก่อน"));
        }

        Optional<UserEntity> userOptional = userRepository.findByEmail(loggedInEmail);

        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();

            return ResponseEntity.ok(
                    Map.of(
                            "status", true,
                            "email", user.getEmail(),
                            "name", user.getUsername(),
                            "role", user.getRole()
                    )
            );
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // ================= LOGOUT =================
    @PostMapping("/logout")   
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logout success"));
    }
}