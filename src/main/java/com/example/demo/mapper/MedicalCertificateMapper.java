package com.example.demo.mapper;

import com.example.demo.dto.MedicalCertificateDTO;
import com.example.demo.model.MedicalCertificate;

public class MedicalCertificateMapper {
	public static MedicalCertificateDTO toDTO(MedicalCertificate c) {
        return new MedicalCertificateDTO(
                c.getCertificateId(),
                c.getIssueDate(),
                c.getDescription(),
                c.getPatient().getPatientId(),
                c.getDoctor().getDoctorId()
        );
    }

}
