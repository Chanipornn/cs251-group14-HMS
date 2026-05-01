package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "Invoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InvoiceID")
    private Integer invoiceId;

    @Column(name = "InvoiceDate", nullable = false)
    private LocalDate invoiceDate;

    @Column(name = "TotalAmount", precision = 10, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Convert(converter = PaymentStatusConverter.class)  
    @Column(name = "Status", length = 10)
    private PaymentStatus status = PaymentStatus.UNPAID;

    @Column(name = "PaymentMethod", length = 20)
    private String paymentMethod;

    @Column(name = "PaidDate")
    private LocalDate paidDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PatientID", nullable = false)
    private Patient patient;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RecordID", nullable = false, unique = true)
    private MedicalRecord medicalRecord;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<InvoiceItem> items;

    public enum PaymentStatus {
        PAID, UNPAID
    }
}