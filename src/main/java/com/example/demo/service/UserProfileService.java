package com.example.demo.service;

import com.example.demo.model.UserEntity;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;

    /**
     * Path บน server ที่จะเก็บรูป เช่น /uploads/profiles/
     * กำหนดใน application.properties:
     *   app.upload.dir=uploads/profiles
     */
    @Value("${app.upload.dir:uploads/profiles}")
    private String uploadDir;

    /**
     * Base URL สำหรับคืนกลับไปให้ frontend
     * กำหนดใน application.properties:
     *   app.base-url=http://localhost:8080
     */
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    // ─────────────────────────────────────────────
    //  SAVE PROFILE IMAGE
    //  บันทึกไฟล์ลง disk → อัปเดต UserEntity.profileImageUrl
    //  คืน URL ที่ใช้เปิดรูปได้
    // ─────────────────────────────────────────────
    public String saveProfileImage(Integer userId, MultipartFile file) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        try {
            // สร้าง directory ถ้ายังไม่มี
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // ลบรูปเก่าออก (ถ้ามี)
            deleteOldImage(user.getProfileImageUrl());

            // สร้างชื่อไฟล์ใหม่ด้วย UUID เพื่อไม่ให้ซ้ำ
            String originalName = file.getOriginalFilename();
            String extension    = getExtension(originalName);
            String newFileName  = "profile_" + userId + "_" + UUID.randomUUID() + extension;

            // บันทึกไฟล์
            Path targetPath = uploadPath.resolve(newFileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // URL สำหรับเข้าถึงรูป
            String imageUrl = baseUrl + "/" + uploadDir + "/" + newFileName;

            // อัปเดต DB
            user.setProfileImageUrl(imageUrl);
            userRepository.save(user);

            return imageUrl;

        } catch (IOException e) {
            throw new RuntimeException("บันทึกรูปภาพไม่สำเร็จ: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────────
    //  PRIVATE HELPERS
    // ─────────────────────────────────────────────
    private void deleteOldImage(String oldUrl) {
        if (oldUrl == null || oldUrl.isBlank()) return;
        try {
            // แยกชื่อไฟล์จาก URL
            String fileName = oldUrl.substring(oldUrl.lastIndexOf("/") + 1);
            Path oldPath    = Paths.get(uploadDir, fileName);
            Files.deleteIfExists(oldPath);
        } catch (IOException ignored) {
            // ไม่สำคัญถ้าลบไม่ได้
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return ".jpg";
        return filename.substring(filename.lastIndexOf(".")).toLowerCase();
    }
}