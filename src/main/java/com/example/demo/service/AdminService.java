package com.example.demo.service;

import com.example.demo.dto.AdminUserDTO;
import com.example.demo.model.*;
import com.example.demo.model.UserEntity.UserRole;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository     userRepository;
    private final DoctorRepository   doctorRepository;
    private final PatientRepository  patientRepository;
    private final DepartmentRepository departmentRepository;
    private final AccountLogRepository accountLogRepository;

    // ─────────────────────────────────────────────
    //  LIST ALL USERS  (User + ชื่อจาก Doctor/Patient)
    // ─────────────────────────────────────────────
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    // ─────────────────────────────────────────────
    //  GET USER BY ID
    // ─────────────────────────────────────────────
    public UserEntity getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
    }

    // ─────────────────────────────────────────────
    //  CREATE DOCTOR ACCOUNT
    //  สร้าง User (role=Doctor) → Doctor row
    // ─────────────────────────────────────────────
    @Transactional
    public Map<String, Object> createDoctorAccount(AdminUserDTO dto) {

        validateNewUser(dto);

        // 1. สร้าง User
        UserEntity user = UserEntity.builder()
                .username(dto.getUsername())
                .password(dto.getPassword())   // TODO: encode BCrypt ก่อน production
                .role(UserRole.Doctor)
                .email(dto.getEmail())
                .telephone(dto.getTelephone())
                .status("active")
                .build();
        user = userRepository.save(user);

        // 2. สร้าง Doctor
        Department dept = null;
        if (dto.getDepartmentId() != null) {
            dept = departmentRepository.findById(dto.getDepartmentId()).orElse(null);
        }

        Doctor doctor = Doctor.builder()
                .name(dto.getName())
                .surname(dto.getSurname())
                .specialization(dto.getSpecialization())
                .telephone(dto.getTelephone())
                .email(dto.getEmail())
                .department(dept)
                .user(user)
                .build();
        doctor = doctorRepository.save(doctor);

        // 3. บันทึก AccountLog
        accountLogRepository.save(AccountLog.builder()
                .action("CREATE")
                .targetUserId(user.getUserId())
                .targetRole("Doctor")
                .detail("Created doctor account: " + dto.getUsername())
                .build());

        Map<String, Object> result = new HashMap<>();
        result.put("userId",   user.getUserId());
        result.put("doctorId", doctor.getDoctorId());
        result.put("username", user.getUsername());
        result.put("role",     "Doctor");
        return result;
    }

    // ─────────────────────────────────────────────
    //  CREATE PATIENT ACCOUNT
    //  สร้าง User (role=Patient) → Patient row
    // ─────────────────────────────────────────────
    @Transactional
    public Map<String, Object> createPatientAccount(AdminUserDTO dto) {

        validateNewUser(dto);

        if (dto.getThaiNationalId() != null &&
                patientRepository.existsByThaiNationalId(dto.getThaiNationalId())) {
            throw new RuntimeException("Thai National ID already exists");
        }

        // 1. สร้าง User
        UserEntity user = UserEntity.builder()
                .username(dto.getUsername())
                .password(dto.getPassword())
                .role(UserRole.Patient)
                .email(dto.getEmail())
                .telephone(dto.getTelephone())
                .status("Active")
                .build();
        user = userRepository.save(user);

        // 2. สร้าง Patient
        Patient patient = Patient.builder()
                .name(dto.getName())
                .surname(dto.getSurname())
                .gender(dto.getGender())
                .dateOfBirth(dto.getDateOfBirth())
                .telephone(dto.getTelephone())
                .address(dto.getAddress())
                .bloodType(dto.getBloodType())
                .thaiNationalId(dto.getThaiNationalId())
                .chronicIllness(dto.getChronicIllness())
                .rightToHealthcare(dto.getRightToHealthcare())
                .drugAllergy(dto.getDrugAllergy())
                .weight(dto.getWeight())
                .height(dto.getHeight())
                .user(user)
                .build();
        patient = patientRepository.save(patient);

        // 3. บันทึก AccountLog
        accountLogRepository.save(AccountLog.builder()
                .action("CREATE")
                .targetUserId(user.getUserId())
                .targetRole("Patient")
                .detail("Created patient account: " + dto.getUsername())
                .build());

        Map<String, Object> result = new HashMap<>();
        result.put("userId",    user.getUserId());
        result.put("patientId", patient.getPatientId());
        result.put("username",  user.getUsername());
        result.put("role",      "Patient");
        return result;
    }

    // ─────────────────────────────────────────────
    //  UPDATE USER  (username / email / telephone / status)
    // ─────────────────────────────────────────────
    @Transactional
    public UserEntity updateUser(Integer userId, AdminUserDTO dto) {

        UserEntity user = getUserById(userId);

        // เช็ค duplicate เฉพาะถ้าเปลี่ยน
        if (dto.getUsername() != null && !dto.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(dto.getUsername())) {
                throw new RuntimeException("Username already exists");
            }
            user.setUsername(dto.getUsername());
        }
        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(dto.getEmail());
        }
        if (dto.getTelephone() != null) user.setTelephone(dto.getTelephone());
        if (dto.getStatus()    != null) user.setStatus(dto.getStatus());
        if (dto.getPassword()  != null && !dto.getPassword().isBlank()) {
            user.setPassword(dto.getPassword());  // TODO: BCrypt
        }

        UserEntity saved = userRepository.save(user);

        accountLogRepository.save(AccountLog.builder()
                .action("UPDATE")
                .targetUserId(userId)
                .targetRole(user.getRole().name())
                .detail("Updated user: " + user.getUsername())
                .build());

        return saved;
    }

    // ─────────────────────────────────────────────
    //  TOGGLE STATUS  (Active ↔ Inactive)
    // ─────────────────────────────────────────────
    @Transactional
    public UserEntity toggleStatus(Integer userId) {

        UserEntity user = getUserById(userId);
        String newStatus = "active".equalsIgnoreCase(user.getStatus())
                ? "inactive"
                : "active";
        user.setStatus(newStatus);
        UserEntity saved = userRepository.save(user);

        accountLogRepository.save(AccountLog.builder()
                .action("TOGGLE_STATUS")
                .targetUserId(userId)
                .targetRole(user.getRole().name())
                .detail("Status changed to " + newStatus + " for user: " + user.getUsername())
                .build());

        return saved;
    }

    // ─────────────────────────────────────────────
    //  DELETE USER  (ลบ User + Doctor/Patient ที่ผูกอยู่)
    // ─────────────────────────────────────────────
    @Transactional
    public void deleteUser(Integer userId) {

        UserEntity user = getUserById(userId);
        String roleStr  = user.getRole().name();

        // ลบ profile ที่ผูกอยู่ก่อน
        if (user.getRole() == UserRole.Doctor) {
            doctorRepository.findByUser_UserId(userId)
                    .ifPresent(doctorRepository::delete);
        } else if (user.getRole() == UserRole.Patient) {
            patientRepository.findByUser_UserId(userId)
                    .ifPresent(patientRepository::delete);
        }

        accountLogRepository.save(AccountLog.builder()
                .action("DELETE")
                .targetUserId(userId)
                .targetRole(roleStr)
                .detail("Deleted user: " + user.getUsername())
                .build());

        userRepository.deleteById(userId);
    }

    // ─────────────────────────────────────────────
    //  GET ACCOUNT LOGS
    // ─────────────────────────────────────────────
    public List<AccountLog> getAllLogs() {
        return accountLogRepository.findAllByOrderByCreatedAtDesc();
    }

    // ─────────────────────────────────────────────
    //  PRIVATE HELPERS
    // ─────────────────────────────────────────────
    private void validateNewUser(AdminUserDTO dto) {
        if (dto.getUsername() == null || dto.getUsername().isBlank())
            throw new RuntimeException("Username is required");
        if (dto.getPassword() == null || dto.getPassword().isBlank())
            throw new RuntimeException("Password is required");
        if (dto.getEmail() == null || dto.getEmail().isBlank())
            throw new RuntimeException("Email is required");

        if (userRepository.existsByUsername(dto.getUsername()))
            throw new RuntimeException("Username already exists");
        if (userRepository.existsByEmail(dto.getEmail()))
            throw new RuntimeException("Email already exists");
    }
}