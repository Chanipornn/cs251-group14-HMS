package com.example.demo.controller;

import com.example.demo.model.UserEntity;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
	 private final UserService userService;

	    // CREATE
	    @PostMapping
	    public UserEntity create(@RequestBody UserEntity user) {
	        return userService.create(user);
	    }

	    // GET ALL
	    @GetMapping
	    public List<UserEntity> getAll() {
	        return userService.getAll();
	    }

	    // GET BY ID
	    @GetMapping("/{id}")
	    public UserEntity getById(@PathVariable Integer id) {
	        return userService.getById(id);
	    }

}
