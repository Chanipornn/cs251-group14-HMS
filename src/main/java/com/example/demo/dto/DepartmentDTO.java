package com.example.demo.dto;

public class DepartmentDTO {

    private Integer departmentId;
    private String depName;

    public DepartmentDTO() {}

    public DepartmentDTO(Integer departmentId, String depName) {
        this.departmentId = departmentId;
        this.depName = depName;
    }

    public Integer getDepartmentId() { return departmentId; }
    public void setDepartmentId(Integer departmentId) { this.departmentId = departmentId; }

    public String getDepName() { return depName; }
    public void setDepName(String depName) { this.depName = depName; }
}