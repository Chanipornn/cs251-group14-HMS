package com.example.demo.controller;

import com.example.demo.dto.InvoiceDTO;
import com.example.demo.dto.InvoiceItemDTO;
import com.example.demo.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InvoiceController {

    private final InvoiceService invoiceService;

    //Create
    @PostMapping
    public ResponseEntity<InvoiceDTO> createInvoice(@RequestBody InvoiceDTO dto) {
        return new ResponseEntity<>(invoiceService.createInvoice(dto), HttpStatus.CREATED);
    }

    //Add Items
    @PostMapping("/items")
    public ResponseEntity<InvoiceItemDTO> addInvoiceItem(@RequestBody InvoiceItemDTO itemDto) {
        return new ResponseEntity<>(invoiceService.addItem(itemDto), HttpStatus.CREATED);
    }

    //GET by ID
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<InvoiceDTO>> getPatientInvoices(@PathVariable Integer patientId) {
        return ResponseEntity.ok(invoiceService.getHistoryByPatient(patientId));
    }

    @GetMapping("/{invoiceId}/items")
    public List<InvoiceItemDTO> getInvoiceItems(@PathVariable Integer invoiceId) {
        return invoiceService.getInvoiceItems(invoiceId);
    }
    @GetMapping
    public ResponseEntity<List<InvoiceDTO>> getAllInvoices() {
        // อย่าลืมไปสร้าง getAllInvoices() ใน InvoiceService ด้วยนะครับ
        return ResponseEntity.ok(invoiceService.getAllInvoices()); 
    }
    @GetMapping("/doctor/{doctorId}")
    public List<InvoiceDTO> getByDoctor(@PathVariable Integer doctorId) {
        return invoiceService.getByDoctor(doctorId);
    }
 

    
}