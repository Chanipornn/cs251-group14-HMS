package com.example.demo.dto;

import lombok.Data;

@Data
public class AppointmentRequestDTO {
	private Integer patientId;
    private Integer doctorId;

    private String date; // "2025-05-01"
    private String time; // "09:00:00"

    private String reason;
    private String preparation;

}
