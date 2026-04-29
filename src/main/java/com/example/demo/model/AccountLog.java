package com.example.demo.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "AccountLog")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LogID")
    private Integer logId;

    @Column(name = "Action", nullable = false, length = 30)
    private String action;           // CREATE | UPDATE | DELETE | TOGGLE_STATUS

    @Column(name = "TargetUserID")
    private Integer targetUserId;

    @Column(name = "TargetRole", length = 20)
    private String targetRole;       // Doctor | Patient | Staff | Admin

    @Column(name = "Detail", length = 255)
    private String detail;

    @Column(name = "CreatedAt", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}