package com.example.demo.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PaymentStatusConverter 
    implements AttributeConverter<Invoice.PaymentStatus, String> {

    @Override
    public String convertToDatabaseColumn(Invoice.PaymentStatus status) {
        if (status == null) return null;
        // PAID → "Paid", UNPAID → "Unpaid"
        String name = status.name(); // "PAID"
        return name.charAt(0) + name.substring(1).toLowerCase(); // "Paid"
    }

    @Override
    public Invoice.PaymentStatus convertToEntityAttribute(String dbValue) {
        if (dbValue == null) return null;
        return Invoice.PaymentStatus.valueOf(dbValue.toUpperCase()); // "Paid" → PAID
    }
}