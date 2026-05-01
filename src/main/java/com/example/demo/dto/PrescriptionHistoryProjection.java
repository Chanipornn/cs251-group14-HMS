package com.example.demo.dto;

import java.time.LocalDate;

// สร้าง Interface รับค่าจาก Custom SQL โดยเฉพาะ
public interface PrescriptionHistoryProjection {
    Integer getPrescriptionId();
    String getMedicineName();
    String getDosage();
    String getDuration();
    String getInstruction();
    
    // ข้อมูลบิล (Invoice)
    Integer getInvoiceId();
    Double getTotalAmount();
    String getInvoiceStatus();
    
    // ข้อมูลคนไข้และการรักษา
    Integer getPatientId();
    String getPatientName();
    String getPatientSurname();
    LocalDate getVisitDate();
}