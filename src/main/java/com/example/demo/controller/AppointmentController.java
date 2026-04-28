package com.example.demo.controller;

import com.example.demo.model.Appointment;
import com.example.demo.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import com.example.demo.dto.AppointmentDTO;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {
	private final AppointmentService service;

    // Create
	@PostMapping
	public AppointmentDTO create(@RequestBody Appointment a) {
	    return service.create(a);
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
	        @RequestParam String date) {

	    return service.reschedule(id, LocalDate.parse(date));
	}

    // search patient
	@GetMapping("/patient/{id}")
	public List<AppointmentDTO> getByPatient(@PathVariable Integer id) {
	    return service.getByPatient(id);
	}

}
