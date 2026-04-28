package com.example.demo.service;

import com.example.demo.model.UserEntity;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
	
	 private final UserRepository userRepository;

	    // CREATE
	    public UserEntity create(UserEntity user) {

	        if (userRepository.existsByUsername(user.getUsername())) {
	            throw new RuntimeException("Username already exists");
	        }

	        if (userRepository.existsByEmail(user.getEmail())) {
	            throw new RuntimeException("Email already exists");
	        }

	        return userRepository.save(user);
	    }

	    // READ ALL
	    public List<UserEntity> getAll() {
	        return userRepository.findAll();
	    }

	    // READ BY ID
	    public UserEntity getById(Integer id) {
	        return userRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("User not found"));
	    }

}
