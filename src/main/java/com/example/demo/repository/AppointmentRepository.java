package com.example.demo.repository;

import com.example.demo.model.Appointment;
import com.example.demo.model.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByPatient_PatientId(Integer patientId);
    List<Appointment> findByDoctor_DoctorId(Integer doctorId);
    
    List<Appointment> findByAppointmentDate(LocalDate date);
    List<Appointment> findByDoctor_DoctorIdAndAppointmentDate(Integer doctorId, LocalDate date);
    
    List<Appointment> findByPatient_PatientIdAndStatus(Integer patientId, AppointmentStatus status);
    List<Appointment> findByStatus(AppointmentStatus status);
    
    List<Appointment> findByAppointmentDateBetween(LocalDate from, LocalDate to);
}