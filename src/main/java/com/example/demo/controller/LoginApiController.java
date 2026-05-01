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
import com.example.demo.model.Patient;

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
    
 // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> req) {

        UserEntity user = new UserEntity();
        user.setUsername((String) req.get("username"));
        user.setEmail((String) req.get("email"));
        user.setPassword((String) req.get("password"));
        user.setRole(UserEntity.UserRole.Patient);

        userRepository.save(user);

        Patient patient = new Patient();
        patient.setUser(user);

        patient.setName((String) req.get("name"));
        patient.setSurname((String) req.get("surname"));

        if (req.get("gender") != null) {
            patient.setGender(((String) req.get("gender")).charAt(0));
        }

        if (req.get("dateOfBirth") != null) {
            patient.setDateOfBirth(
                java.time.LocalDate.parse((String) req.get("dateOfBirth"))
            );
        }

        patient.setTelephone((String) req.get("telephone"));
        patient.setAddress((String) req.get("address"));
        patient.setBloodType((String) req.get("bloodType"));
        patient.setThaiNationalId((String) req.get("thaiNationalId"));
        patient.setChronicIllness((String) req.get("chronicIllness"));
        patient.setRightToHealthcare((String) req.get("rightToHealthcare"));
        patient.setDrugAllergy((String) req.get("drugAllergy"));

        if (req.get("weight") != null) {
            patient.setWeight(Float.valueOf(req.get("weight").toString()));
        }

        if (req.get("height") != null) {
            patient.setHeight(Float.valueOf(req.get("height").toString()));
        }

        patientRepository.save(patient);

        return ResponseEntity.ok(Map.of(
            "status", true,
            "patientId", patient.getPatientId()
        ));
        
        
    }
    
  
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
                            .orElseThrow(() -> new RuntimeException("Patient not found"));

                    return ResponseEntity.ok(
                            Map.of(
                                    "status", true,
                                    "message", "Login successful",
                                    "username", user.getUsername(),
                                    "email", user.getEmail(),
                                    "role", user.getRole(),
                                    "patientId", patientId != null ? patientId : 0
                                    //"patientId", patientId
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