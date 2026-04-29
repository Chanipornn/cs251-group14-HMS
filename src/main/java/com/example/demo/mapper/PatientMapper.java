package com.example.demo.mapper;

import com.example.demo.dto.PatientDTO;
import com.example.demo.model.Patient;

public class PatientMapper {
	public static PatientDTO toDTO(Patient p) {
	    PatientDTO dto = new PatientDTO(
	            p.getPatientId(),
	            p.getName(),
	            p.getSurname(),
	            p.getGender(),
	            p.getDateOfBirth(),
	            p.getTelephone(),
	            p.getAddress(),
	            p.getBloodType(),
	            p.getThaiNationalId(),
	            p.getChronicIllness(),
	            p.getRightToHealthcare(),
	            p.getDrugAllergy(),
	            p.getWeight(),
	            p.getHeight()
	    );

	    
	    dto.setFullName(p.getName() + " " + p.getSurname());

	    return dto;
	}

}
