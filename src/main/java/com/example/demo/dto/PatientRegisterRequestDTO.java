package com.example.demo.dto;

import lombok.Data;

@Data
public class PatientRegisterRequestDTO {
	 	private String username;
	    private String password;
	    private String email;
	    private String telephone;

	    private String name;
	    private String surname;
	    private Character gender;
	    private String dateOfBirth;
	    private String thaiNationalId;

}
