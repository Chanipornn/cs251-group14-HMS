package com.example.demo.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.UserEntity;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.PatientRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class LoginApiController {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PatientRepository patientRepository;

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
				
				//check output
				System.out.println("INPUT EMAIL: " + email);
				System.out.println("INPUT PASSWORD: " + password);
				System.out.println("DB PASSWORD: " + dbPassword);
				
					
				// ถ้าเป็น bcrypt
				if (dbPassword.startsWith("$2a$")) {
				    isMatch = org.springframework.security.crypto.bcrypt.BCrypt
				                .checkpw(password, dbPassword);
				}
				// ถ้าเป็น plain
				else {
				    isMatch = dbPassword.equals(password);
				}
				
				//check output
				System.out.println("IS MATCH: " + isMatch);

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

				/*
				if (user.getPassword().equals(password)) {

					HttpSession session = request.getSession();
					session.setAttribute("loggedInUser", user.getEmail());
					session.setAttribute("userRole", user.getRole());

					return ResponseEntity.status(HttpStatus.OK).body(Map.of("status", true, "message",
							"Login successful", "name", user.getUsername(), "role", user.getRole()));
				}
				*/
			}

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("status", false, "message", "อีเมลหรือรหัสผ่านไม่ถูกต้อง"));

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("status", false, "message", "เกิดข้อผิดพลาดในระบบเซิร์ฟเวอร์"));
		}
	}
	
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
					Map.of("status", true, "email", user.getEmail(), "name", user.getUsername(), "role", user.getRole()
					));
		}

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}


	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpSession session) {
		session.invalidate();
		return ResponseEntity.ok(Map.of("status", true, "message", "ออกจากระบบสำเร็จ"));
	}
}
