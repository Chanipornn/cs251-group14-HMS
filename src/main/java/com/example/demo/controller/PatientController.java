package com.example.demo.controller;

import com.example.demo.model.Patient;
import com.example.demo.service.PatientService;
import com.example.demo.dto.PatientDTO;
import com.example.demo.dto.PatientRegisterRequestDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin
public class PatientController {
	
	@Autowired
    private PatientService service;

    // GET ALL
    @GetMapping
    public List<PatientDTO> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public PatientDTO getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // CREATE
    @PostMapping
    public Patient create(@RequestBody Patient p) {
        return service.create(p);
    }

 // UPDATE
    @PutMapping("/{id}")
    public Patient update(@PathVariable Integer id, @RequestBody Patient p) {
        return service.update(id, p);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    // SEARCH
    @GetMapping("/search")
    public List<PatientDTO> search(@RequestParam String keyword) {
        return service.search(keyword);
    }

    // FILTER BY STAFF
    @GetMapping("/staff/{id}")
    public List<PatientDTO> getByStaff(@PathVariable Integer id) {
        return service.getByStaff(id);
    }
    
    @PostMapping("/register")
    public Patient register(@RequestBody PatientRegisterRequestDTO req) {
        return service.register(req);
    }
}
