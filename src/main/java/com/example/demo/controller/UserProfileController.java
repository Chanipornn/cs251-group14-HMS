package com.example.demo.controller;

import com.example.demo.dto.AdminUserDTO;
import com.example.demo.model.UserEntity;
import com.example.demo.service.AdminService;
import com.example.demo.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * UserProfileController
 * Base path: /api/users
 *
 * Endpoints:
 *   PUT  /api/users/{id}/profile        - อัปเดต name/surname/telephone
 *   POST /api/users/{id}/profile-image  - อัปโหลดรูปโปรไฟล์
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final AdminService       adminService;
    private final UserProfileService userProfileService;

    // ─────────────────────────────────────────────
    //  UPDATE PROFILE  (name / surname / telephone)
    //  ใช้ AdminService.updateUser ที่มีอยู่แล้ว
    // ─────────────────────────────────────────────
    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable Integer id,
            @RequestBody AdminUserDTO dto) {
        try {
            UserEntity updated = adminService.updateUser(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────
    //  UPLOAD PROFILE IMAGE
    //  รับ multipart/form-data field ชื่อ "file"
    //  คืน { profileImageUrl: "..." }
    // ─────────────────────────────────────────────
    @PostMapping("/{id}/profile-image")
    public ResponseEntity<?> uploadProfileImage(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "ไม่พบไฟล์รูปภาพ"));
            }

            // ตรวจ MIME type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "ไฟล์ต้องเป็นรูปภาพเท่านั้น"));
            }

            // ตรวจขนาดไม่เกิน 5 MB
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "รูปภาพต้องมีขนาดไม่เกิน 5 MB"));
            }

            String imageUrl = userProfileService.saveProfileImage(id, file);

            return ResponseEntity.ok(Map.of("profileImageUrl", imageUrl));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "อัปโหลดรูปไม่สำเร็จ"));
        }
    }
}