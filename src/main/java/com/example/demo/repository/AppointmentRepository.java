package com.example.demo.repository;

import com.example.demo.model.Appointment;
import com.example.demo.model.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
 
 // ดึงนัดหมายพร้อมข้อมูลคนไข้ โดยหาจาก DoctorID และเรียงตามวันที่/เวลา
    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient WHERE a.doctor.doctorId = :doctorId ORDER BY a.appointmentDate ASC, a.appointmentTime ASC")
    List<Appointment> findAppointmentsWithPatientByDoctorId(@Param("doctorId") Integer doctorId);
}