package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthController {

    @GetMapping("/")
    public String mainPage() {
        return "redirect:/login.html";
    }

    @GetMapping("/doctorandstaff")
    public String doctorLoginPage() {
        return "redirect:/DoctorandStaff/html/login.html";
    }
}