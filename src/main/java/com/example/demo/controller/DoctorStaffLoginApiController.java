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

import com.example.demo.model.Doctor;
import com.example.demo.model.Staff;
import com.example.demo.model.UserEntity;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.StaffRepository;
import com.example.demo.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class DoctorStaffLoginApiController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private DoctorRepository doctorRepository;

	@Autowired
	private StaffRepository staffRepository;

	@PostMapping("/doctorandstaff/login")
	public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials,
			HttpServletRequest request) {
		String email = credentials.get("Email");
		String password = credentials.get("Password");

		try {
			Optional<UserEntity> userOptional = userRepository.findByEmail(email);

			if (userOptional.isPresent()) {
				UserEntity user = userOptional.get();

				if (user.getPassword().equals(password)) {

					
					String roleName = user.getRole().name();
					Integer userId = user.getUserId();

					HttpSession session = request.getSession();
					session.setAttribute("loggedInUser", user.getEmail()); 
					session.setAttribute("userRole", roleName);

					if ("DOCTOR".equalsIgnoreCase(roleName)) {
						Optional<Doctor> doctorOptional = doctorRepository.findByUser_UserId(userId);

						if (doctorOptional.isPresent()) {
							Doctor doctor = doctorOptional.get();
							session.setAttribute("userName", doctor.getName()); 
							session.setAttribute("DoctorID", doctor.getDoctorId());
							return ResponseEntity.status(HttpStatus.OK)
									.body(Map.of("status", true, "message", "เข้าสู่ระบบสำเร็จ (หมอ)", "UserID", userId,
											"DoctorID", doctor.getDoctorId(), "name", doctor.getName(), "role",
											"Doctor"));
						}
					} else if ("STAFF".equalsIgnoreCase(roleName)) {
						Optional<Staff> staffOptional = staffRepository.findByUser_UserId(userId);

						if (staffOptional.isPresent()) {
							Staff staff = staffOptional.get();
							session.setAttribute("userName", staff.getName());

							return ResponseEntity.status(HttpStatus.OK)
									.body(Map.of("status", true, "message", "เข้าสู่ระบบสำเร็จ (เจ้าหน้าที่)", "UserID",
											userId, "name", staff.getName(), "role", "Staff"));
						}
					}
				}
			}

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("status", false, "message", "อีเมลหรือรหัสผ่านไม่ถูกต้อง"));

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("status", false, "message", "เกิดข้อผิดพลาดที่ระบบหลังบ้าน"));
		}
	}

	@GetMapping("/doctorandstaff/me")
	public ResponseEntity<?> getCurrentUser(HttpSession session) {
		String loggedInEmail = (String) session.getAttribute("loggedInUser");
		String userRole = (String) session.getAttribute("userRole");
		String userName = (String) session.getAttribute("userName");
		Integer doctorId = (Integer) session.getAttribute("DoctorID"); 

		if (loggedInEmail == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("status", false, "message", "ยังไม่ได้เข้าสู่ระบบ"));
		}
		
		System.out.print("TestDoctor"+doctorId);
		
		return ResponseEntity.ok(Map.of("status", true, "email", loggedInEmail, "name", userName, "role", userRole,
				"doctorId", doctorId != null ? doctorId : 0 
		));
	}

	@PostMapping("/doctorandstaff/logout")
	public ResponseEntity<?> logout(HttpSession session) {
		session.invalidate(); 
		return ResponseEntity.ok(Map.of("status", true, "message", "ออกจากระบบเรียบร้อยแล้ว"));
	}
}