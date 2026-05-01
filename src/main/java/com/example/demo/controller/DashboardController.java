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
    
    /*-----------------------------medical_history------------------------------------*/
    @GetMapping("/medical_history")
    public String medicalhistoryDashboard( ){
        return "forward:/DoctorandStaff/html/medical_history.html"; 
    }
    @GetMapping("/medical_history/add")
    public String medicalhistoryAdd(){
        return "forward:/DoctorandStaff/html/create_medical_history.html"; 
    }
    /*--------------------------------------------------------------------------------*/
    
    
    
    /*--------------------------------appointment-------------------------------------*/
    @GetMapping("/appointment")
    public String appointmentDashboard() {
        return "forward:/DoctorandStaff/html/appointment.html"; 
    }
    @GetMapping("/appointment/add")
    public String appointmentAdd() {
        return "forward:/DoctorandStaff/html/add-appointment.html"; 
    }
    @GetMapping("/edit-appointment")
    public String editAppointmentPage() {
        return "forward:/DoctorandStaff/html/edit-appointment.html"; 
    }
    /*--------------------------------------------------------------------------------*/

    /*--------------------------------medical_certificate-------------------------------------*/
    @GetMapping("/medical_certificate")
    public String medical_certificateDashboard() {
        return "forward:/DoctorandStaff/html/medical_certificate_history.html"; 
    }
    @GetMapping("/medical_certificate/add")
    public String medical_certificateAdd() {
        return "forward:/DoctorandStaff/html/create_medical_certificate.html"; 
    }
    /*--------------------------------------------------------------------------------*/
    
    
    @GetMapping("/invoice")
    public String invoiceDashboard() {
        return "forward:/DoctorandStaff/html/invoice_history.html"; 
    }
}