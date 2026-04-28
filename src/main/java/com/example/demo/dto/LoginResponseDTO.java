package com.example.demo.dto;

public class LoginResponseDTO {

    private boolean status;
    private String name;
    private String role;
    private String message;

    public LoginResponseDTO() {}

    public LoginResponseDTO(boolean status, String name, String role, String message) {
        this.status = status;
        this.name = name;
        this.role = role;
        this.message = message;
    }

    public boolean isStatus() { return status; }
    public void setStatus(boolean status) { this.status = status; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}