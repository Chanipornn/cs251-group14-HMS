package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/doctorandstaff")
public class DashboardController {

    @GetMapping("/history")
    public String historyDashboard() {
        return "forward:/DoctorandStaff/html/history.html"; 
    }
    @GetMapping("/medical_history")
    public String medicalhistoryDashboard( ){
        return "forward:/DoctorandStaff/html/medical_history.html"; 
    }
    @GetMapping("/appointment")
    public String appointmentDashboard() {
        return "forward:/DoctorandStaff/html/appointment.html"; 
    }
    @GetMapping("/medical_certificate")
    public String medical_certificateDashboard() {
        return "forward:/DoctorandStaff/html/medical_certificate_history.html"; 
    }
    @GetMapping("/invoice")
    public String invoiceDashboard() {
        return "forward:/DoctorandStaff/html/invoice_history.html"; 
    }

}