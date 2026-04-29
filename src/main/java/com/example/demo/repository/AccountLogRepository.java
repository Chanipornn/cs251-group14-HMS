package com.example.demo.repository;

import com.example.demo.model.AccountLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountLogRepository extends JpaRepository<AccountLog, Integer> {
    List<AccountLog> findAllByOrderByCreatedAtDesc();
    List<AccountLog> findByTargetUserId(Integer userId);
    List<AccountLog> findByTargetRole(String role);
}