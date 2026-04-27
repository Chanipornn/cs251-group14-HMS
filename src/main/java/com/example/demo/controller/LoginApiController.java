package com.example.demo.controller;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class LoginApiController {

	

	@PostMapping("/login")
    public ResponseEntity<Map> login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        String email = credentials.get("Email");
        String password = credentials.get("Password");
        
        System.out.print(email);
        
        
        try {
        	return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                    "status", true,
                    "name",email,
                    "password",password,
                    "role","ADMIN"
            ));
        } catch(Exception e) {
        	System.out.print(e);
        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", false, "message", "Invalid username or password"));
        }
		
        
    }
}
