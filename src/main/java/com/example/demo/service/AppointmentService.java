package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import com.example.demo.dto.AppointmentDTO;
import com.example.demo.mapper.AppointmentMapper;

@Service
@RequiredArgsConstructor
public class AppointmentService {
	private final AppointmentRepository appointmentRepository;
	private final PatientRepository patientRepository;
	private final DoctorRepository doctorRepository;

	// CREATE
	public AppointmentDTO create(Appointment a) {

		if (a.getPatient() == null || a.getPatient().getPatientId() == null) {
			throw new RuntimeException("Patient is required");
		}

		if (a.getDoctor() == null || a.getDoctor().getDoctorId() == null) {
			throw new RuntimeException("Doctor is required");
		}

		Patient patient = patientRepository.findById(a.getPatient().getPatientId())
				.orElseThrow(() -> new RuntimeException("Patient not found"));

		Doctor doctor = doctorRepository.findById(a.getDoctor().getDoctorId())
				.orElseThrow(() -> new RuntimeException("Doctor not found"));

		a.setPatient(patient);
		a.setDoctor(doctor);
		// a.setStatus(Appointment.AppointmentStatus.COMPLETED);
		a.setStatus(Appointment.AppointmentStatus.WAITING);
		a.setQueueNumber(generateQueue());

		Appointment saved = appointmentRepository.save(a);

		return AppointmentMapper.toDTO(saved);
	}

	// generate queue
	private Integer generateQueue() {
		return (int) (ThreadLocalRandom.current().nextDouble() * 100);
	}

	// Cancel
	public AppointmentDTO cancel(Integer id) {
		Appointment a = getById(id);
		a.setStatus(Appointment.AppointmentStatus.CANCELLED);
		return AppointmentMapper.toDTO(appointmentRepository.save(a));
	}

	// reschedule
	public AppointmentDTO reschedule(Integer id, AppointmentDTO dto) {
		Appointment a = appointmentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Appointment not found"));

		if (dto.getAppointmentDate() != null) {
			a.setAppointmentDate(dto.getAppointmentDate());
		}

		if (dto.getReason() != null) {
			a.setReason(dto.getReason());
		}

		if (dto.getPreparation() != null) {
			a.setPreparation(dto.getPreparation());
		}

		a.setStatus(Appointment.AppointmentStatus.POSTPONED);

		return AppointmentMapper.toDTO(appointmentRepository.save(a));
	}

	// getByPatient
	public List<AppointmentDTO> getByPatient(Integer patientId) {
		return appointmentRepository.findByPatient_PatientId(patientId).stream().map(AppointmentMapper::toDTO).toList();
	}

	// get by id
	public Appointment getById(Integer id) {
		return appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found"));
	}

	public List<AppointmentDTO> getAppointmentsByDoctor(Integer doctorId) {
		return appointmentRepository.findAppointmentsWithPatientByDoctorId(doctorId).stream().map(a -> {
			AppointmentDTO dto = new AppointmentDTO();
			dto.setAppointmentId(a.getAppointmentId());
			dto.setAppointmentDate(a.getAppointmentDate());
			dto.setAppointmentTime(a.getAppointmentTime());
			dto.setQueueNumber(a.getQueueNumber());
			dto.setStatus(a.getStatus());
			// Map ข้อมูลคนไข้
			if (a.getPatient() != null) {
				dto.setPatientId(a.getPatient().getPatientId());
				dto.setPatientName(a.getPatient().getName() + " " + a.getPatient().getSurname());
				dto.setWeight(a.getPatient().getWeight());
				dto.setHeight(a.getPatient().getHeight());

				// คำนวณอายุ (แบบง่ายๆ)
				if (a.getPatient().getDateOfBirth() != null) {
					int age = java.time.LocalDate.now().getYear() - a.getPatient().getDateOfBirth().getYear();
					dto.setAge(age);
				}
			}
			return dto;
		}).collect(Collectors.toList());
	}
}
