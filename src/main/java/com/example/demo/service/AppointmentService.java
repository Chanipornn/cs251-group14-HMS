package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import com.example.demo.dto.AppointmentDTO;
import com.example.demo.dto.AppointmentRequestDTO;
import com.example.demo.mapper.AppointmentMapper;

import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class AppointmentService {
	private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    // CREATE
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

        // ✅ generate queue
        Integer maxQueue = appointmentRepository
                .findMaxQueue(doctor.getDoctorId(), date);

        int newQueue = maxQueue + 1;

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
    
    
    
    
    /*
    public AppointmentDTO create(AppointmentRequestDTO req) {
    	Patient patient = patientRepository
                .findById(req.getPatientId())
                .orElseThrow();

        Doctor doctor = doctorRepository
                .findById(req.getDoctorId())
                .orElseThrow();

        LocalDate date = LocalDate.parse(req.getDate());
        LocalTime time = LocalTime.parse(req.getTime());

        // 🔥 generate queue
        Integer maxQueue = appointmentRepository
                .findMaxQueue(doctor.getDoctorId(), date);

        int newQueue = maxQueue + 1;

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

        return mapToDTO(appt);
/*
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
        //a.setStatus(Appointment.AppointmentStatus.COMPLETED);
        a.setStatus(Appointment.AppointmentStatus.WAITING);
        a.setQueueNumber(generateQueue());

        Appointment saved = appointmentRepository.save(a);

        return AppointmentMapper.toDTO(saved);  
        
    	
    }

   */

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
        return appointmentRepository.findByPatient_PatientId(patientId)
                .stream()
                .map(AppointmentMapper::toDTO)
                .toList();
    }

 // get by id
    public Appointment getById(Integer id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }
    
}
