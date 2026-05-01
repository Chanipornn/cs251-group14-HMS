package com.example.demo.mapper;

import com.example.demo.dto.AppointmentDTO;
import com.example.demo.model.Appointment;


public class AppointmentMapper {
	public static AppointmentDTO toDTO(Appointment a) {

	    AppointmentDTO dto = new AppointmentDTO(
	            a.getAppointmentId(),
	            a.getAppointmentDate(),
	            a.getAppointmentTime(),
	            a.getQueueNumber(),
	            a.getStatus().name(),
	            a.getDoctor().getDoctorId(),
	            a.getPatient().getPatientId(), 
	            null, 
	            null, 
	            null, 
	            null
	    );

	    /*
	    dto.setDoctorName(
	    	    a.getDoctor().getName() + " " + a.getDoctor().getSurname()
	    	);
	    	*/
	    dto.setDoctorName(
	            a.getDoctor() != null
	                ? a.getDoctor().getName() + " " + a.getDoctor().getSurname()
	                : "-"
	        );
	    
	    dto.setDepartment(
	    	    a.getDoctor() != null && a.getDoctor().getDepartment() != null
	    	        ? a.getDoctor().getDepartment().getDepName()
	    	        : "-"
	    	);
	    dto.setReason(a.getReason());
	    dto.setPreparation(a.getPreparation());

	    return dto;
	}
}
