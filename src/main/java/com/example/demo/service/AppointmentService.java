package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import com.example.demo.dto.AppointmentDTO;
import com.example.demo.dto.AppointmentRequestDTO;
import com.example.demo.mapper.AppointmentMapper;

@Service
@RequiredArgsConstructor
public class AppointmentService {
	private final AppointmentRepository appointmentRepository;
	private final PatientRepository patientRepository;
	private final DoctorRepository doctorRepository;

    // CREATE (เวอร์ชันอัปเกรดแล้ว)
    public AppointmentDTO create(AppointmentRequestDTO req) {

        Patient patient = patientRepository
                .findById(req.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository
                .findById(req.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        LocalDate date = LocalDate.parse(req.getDate());
        LocalTime time = LocalTime.parse(req.getTime());

        // ✅ กันเวลาซ้ำ
        boolean exists = appointmentRepository
                .existsByDoctor_DoctorIdAndAppointmentDateAndAppointmentTime(
                        doctor.getDoctorId(), date, time);

        if (exists) {
            throw new RuntimeException("เวลานี้ถูกจองแล้ว");
        }

        // ✅ generate queue (รันตามคิวจริง ไม่สุ่มแล้ว)
        Integer maxQueue = appointmentRepository
                .findMaxQueue(doctor.getDoctorId(), date);

        // ดักกรณีที่เป็นคิวแรกของวัน (maxQueue อาจจะเป็น null)
        int newQueue = (maxQueue != null ? maxQueue : 0) + 1;

        Appointment appt = new Appointment();
        appt.setPatient(patient);
        appt.setDoctor(doctor);
        appt.setAppointmentDate(date);
        appt.setAppointmentTime(time);
        appt.setQueueNumber(newQueue);

        appt.setReason(req.getReason());
        appt.setPreparation(req.getPreparation());
        appt.setStatus(Appointment.AppointmentStatus.WAITING);

        appointmentRepository.save(appt);

        return AppointmentMapper.toDTO(appt);
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

	public List<AppointmentDTO> getByPatient(Integer patientId) {
		return appointmentRepository.findByPatient_PatientId(patientId).stream().map(AppointmentMapper::toDTO).toList();
	}

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
            
			dto.setStatus(a.getStatus() != null ? a.getStatus().name() : null); 
            
			if (a.getPatient() != null) {
				dto.setPatientId(a.getPatient().getPatientId());
				dto.setPatientName(a.getPatient().getName() + " " + a.getPatient().getSurname());
				dto.setWeight(a.getPatient().getWeight());
				dto.setHeight(a.getPatient().getHeight());

				if (a.getPatient().getDateOfBirth() != null) {
					int age = java.time.LocalDate.now().getYear() - a.getPatient().getDateOfBirth().getYear();
					dto.setAge(age);
				}
			}
			return dto;
		}).collect(Collectors.toList());
	}
}