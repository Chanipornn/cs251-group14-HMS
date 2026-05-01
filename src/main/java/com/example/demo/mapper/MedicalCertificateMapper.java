package com.example.demo.mapper;

import com.example.demo.dto.MedicalCertificateDTO;
import com.example.demo.model.MedicalCertificate;

public class MedicalCertificateMapper {
	// ตัวอย่างการตั้งค่าใน Mapper
    public static MedicalCertificateDTO toDTO(MedicalCertificate c) {
        MedicalCertificateDTO dto = new MedicalCertificateDTO(
            c.getCertificateId(), c.getIssueDate(), c.getDescription(),
            c.getPatient().getPatientId(), c.getDoctor().getDoctorId(), null, null
        );
        dto.setPatientName(c.getPatient().getName() + " " + c.getPatient().getSurname());
        dto.setDoctorName(c.getDoctor().getName() + " " + c.getDoctor().getSurname());
        
        return dto;
    }
	

}
