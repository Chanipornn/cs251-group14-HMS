package com.example.demo.mapper;

import com.example.demo.dto.AppointmentDTO;
import com.example.demo.model.Appointment;

public class AppointmentMapper {
	public static AppointmentDTO toDTO(Appointment a) {

		AppointmentDTO dto = new AppointmentDTO();

		dto.setAppointmentId(a.getAppointmentId());
		dto.setAppointmentDate(a.getAppointmentDate());
		dto.setAppointmentTime(a.getAppointmentTime());
		dto.setQueueNumber(a.getQueueNumber());
		dto.setStatus(a.getStatus() != null ? a.getStatus().name() : null);

		if (a.getDoctor() != null) {
			dto.setDoctorId(a.getDoctor().getDoctorId());
			dto.setDoctorName(a.getDoctor().getName() + " " + a.getDoctor().getSurname());

			if (a.getDoctor().getDepartment() != null) {
				dto.setDepartment(a.getDoctor().getDepartment().getDepName());
			}
		}

		if (a.getPatient() != null) {
			dto.setPatientId(a.getPatient().getPatientId());
		}

		dto.setReason(a.getReason());
		dto.setPreparation(a.getPreparation());

		return dto;
	}
}