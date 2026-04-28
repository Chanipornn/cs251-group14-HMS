package com.example.demo.dto;

public class StaffDTO {

    private Integer staffId;
    private String name;
    private String surname;
    private String position;
    private String telephone;

    public StaffDTO() {}

    public StaffDTO(Integer staffId, String name, String surname, String position, String telephone) {
        this.staffId = staffId;
        this.name = name;
        this.surname = surname;
        this.position = position;
        this.telephone = telephone;
    }

    public Integer getStaffId() { return staffId; }
    public void setStaffId(Integer staffId) { this.staffId = staffId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
}