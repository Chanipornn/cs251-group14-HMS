package com.example.demo.controller;

import com.example.demo.model.Appointment;
import com.example.demo.service.AppointmentService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import com.example.demo.dto.AppointmentDTO;
import com.example.demo.dto.AppointmentRequestDTO;
import com.example.demo.mapper.AppointmentMapper;

@RestController
@RequestMapping("/api/appointments") 
@RequiredArgsConstructor
public class AppointmentController {
	private final AppointmentService service;

	@PostMapping
	public AppointmentDTO create(@RequestBody AppointmentRequestDTO req) {
	    return service.create(req);
	}

	@GetMapping("/{id}")
	public AppointmentDTO getById(@PathVariable Integer id) {
		return AppointmentMapper.toDTO(service.getById(id));
	}

	@PutMapping("/{id}/cancel")
	public AppointmentDTO cancel(@PathVariable Integer id) {
		return service.cancel(id);
	}

	
	@PutMapping("/{id}/reschedule")
	public AppointmentDTO reschedule(@PathVariable Integer id, @RequestBody AppointmentDTO dto) {
		return service.reschedule(id, dto);
	}

	@GetMapping("/patient/{id}")
	public List<AppointmentDTO> getByPatient(@PathVariable Integer id) {
		return service.getByPatient(id);
	}

	@GetMapping("/doctor/{doctorId}")
	public List<AppointmentDTO> getByDoctor(@PathVariable Integer doctorId) {
		return service.getAppointmentsByDoctor(doctorId);
	}
}