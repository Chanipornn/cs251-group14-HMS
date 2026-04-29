package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    @GetMapping("/doctorandstaff/history")
    public String doctorDashboard() {
    
        return "forward:/DoctorandStaff/html/history.html"; 
    }

}