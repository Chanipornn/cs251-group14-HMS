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

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class LoginApiController {

	@Autowired
	private UserRepository userRepository;

	@PostMapping("/login")
	public ResponseEntity<Map> login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
		String email = credentials.get("Email");
		String password = credentials.get("Password");

		try {

			Optional<UserEntity> userOptional = userRepository.findByEmail(email);

			if (userOptional.isPresent()) {
				UserEntity user = userOptional.get();

				if (user.getPassword().equals(password)) {

					HttpSession session = request.getSession();
					session.setAttribute("loggedInUser", user.getEmail());
					session.setAttribute("userRole", user.getRole());

					return ResponseEntity.status(HttpStatus.OK).body(Map.of("status", true, "message",
							"Login successful", "name", user.getUsername(), "role", user.getRole()));
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
