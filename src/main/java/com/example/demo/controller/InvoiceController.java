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

    //GET Item by Item ID
    @GetMapping("/{id}/items")
    public ResponseEntity<List<InvoiceItemDTO>> getItemsByInvoice(@PathVariable Integer id) {
        return ResponseEntity.ok(invoiceService.getInvoiceItems(id));
    }
}