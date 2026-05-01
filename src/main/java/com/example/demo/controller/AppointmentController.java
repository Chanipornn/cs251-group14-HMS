package com.example.demo.controller;

import com.example.demo.model.Appointment;
import com.example.demo.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import com.example.demo.dto.AppointmentDTO;
import com.example.demo.dto.AppointmentRequestDTO;

@RestController
@RequestMapping("/api/appointments/patients")
@RequiredArgsConstructor
public class AppointmentController {
	private final AppointmentService service;

	
    // Create
	@PostMapping("/{id}")
	public AppointmentDTO create(@RequestBody AppointmentRequestDTO req) {
	    return service.create(req);
	}

    // Cancel
	@PutMapping("/{id}/cancel")
	public AppointmentDTO cancel(@PathVariable Integer id) {
	    return service.cancel(id);
	}

    // reschedule
	@PutMapping("/{id}/reschedule")
	public AppointmentDTO reschedule(
	        @PathVariable Integer id,
	        @RequestBody AppointmentDTO dto) {

	    return service.reschedule(id, dto);
	}

	/*
    // search patient
	@GetMapping("/patient/{id}")
	public List<AppointmentDTO> getByPatient(@PathVariable Integer id) {
	    return service.getByPatient(id);
	}
	*/
	
	// search patient
	@GetMapping("/{id}")
	public List<AppointmentDTO> getByPatient(@PathVariable Integer id) {
	    return service.getByPatient(id);
	}
	

}
