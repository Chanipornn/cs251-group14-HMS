CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- ==========================================
-- 1. สร้างโครงสร้างตาราง (SCHEMA)
-- ==========================================

DROP TABLE IF EXISTS `AccountLog`;
CREATE TABLE `AccountLog` (
  `LogID` int NOT NULL AUTO_INCREMENT,
  `Action` varchar(30) NOT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `Detail` varchar(255) DEFAULT NULL,
  `TargetRole` varchar(20) DEFAULT NULL,
  `TargetUserID` int DEFAULT NULL,
  PRIMARY KEY (`LogID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Admin`;
CREATE TABLE `Admin` (
  `AdminID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`AdminID`),
  UNIQUE KEY `UserID` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Appointment`;
CREATE TABLE `Appointment` (
  `AppointmentID` int NOT NULL AUTO_INCREMENT,
  `AppointmentDate` date NOT NULL,
  `AppointmentTime` time NOT NULL,
  `QueueNumber` int DEFAULT NULL,
  `Status` int DEFAULT '1' COMMENT '0=ยกเลิก, 1=นัดสำเร็จ, 2=เลื่อนนัด, 3=รอเข้าพบ',
  `DoctorID` int NOT NULL,
  `PatientID` int NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `preparation` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`AppointmentID`),
  KEY `DoctorID` (`DoctorID`),
  KEY `PatientID` (`PatientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Department`;
CREATE TABLE `Department` (
  `DepartmentID` int NOT NULL AUTO_INCREMENT,
  `DepName` varchar(100) NOT NULL,
  PRIMARY KEY (`DepartmentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Doctor`;
CREATE TABLE `Doctor` (
  `DoctorID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Surname` varchar(50) NOT NULL,
  `Specialization` varchar(100) DEFAULT NULL,
  `Telephone` varchar(10) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `DepartmentID` int DEFAULT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`DoctorID`),
  UNIQUE KEY `UserID` (`UserID`),
  KEY `DepartmentID` (`DepartmentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Invoice`;
CREATE TABLE `Invoice` (
  `InvoiceID` int NOT NULL AUTO_INCREMENT,
  `InvoiceDate` date NOT NULL,
  `TotalAmount` decimal(10,2) DEFAULT '0.00',
  `Status` varchar(10) DEFAULT 'Unpaid',
  `PaymentMethod` varchar(20) DEFAULT NULL,
  `PaidDate` date DEFAULT NULL,
  `PatientID` int NOT NULL,
  `RecordID` int NOT NULL,
  PRIMARY KEY (`InvoiceID`),
  UNIQUE KEY `RecordID` (`RecordID`),
  KEY `PatientID` (`PatientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `InvoiceItem`;
CREATE TABLE `InvoiceItem` (
  `ItemID` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(255) DEFAULT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `InvoiceID` int NOT NULL,
  PRIMARY KEY (`ItemID`),
  KEY `InvoiceID` (`InvoiceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `MedicalCertificate`;
CREATE TABLE `MedicalCertificate` (
  `CertificateID` int NOT NULL AUTO_INCREMENT,
  `IssueDate` date NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `PatientID` int NOT NULL,
  `DoctorID` int NOT NULL,
  PRIMARY KEY (`CertificateID`),
  KEY `PatientID` (`PatientID`),
  KEY `DoctorID` (`DoctorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `MedicalRecord`;
CREATE TABLE `MedicalRecord` (
  `RecordID` int NOT NULL AUTO_INCREMENT,
  `VisitDate` date NOT NULL,
  `Symptoms` varchar(255) DEFAULT NULL,
  `Diagnosis` varchar(255) DEFAULT NULL,
  `TreatmentDetail` varchar(255) DEFAULT NULL,
  `TreatmentResult` varchar(100) DEFAULT NULL,
  `Note` varchar(255) DEFAULT NULL,
  `PatientID` int NOT NULL,
  `DoctorID` int NOT NULL,
  PRIMARY KEY (`RecordID`),
  KEY `PatientID` (`PatientID`),
  KEY `DoctorID` (`DoctorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Patient`;
CREATE TABLE `Patient` (
  `PatientID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(64) NOT NULL,
  `Surname` varchar(64) NOT NULL,
  `Gender` char(1) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Telephone` varchar(10) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `BloodType` varchar(3) DEFAULT NULL,
  `StaffID` int DEFAULT NULL,
  `ThaiNationalID` varchar(13) DEFAULT NULL,
  `ChronicIllness` varchar(255) DEFAULT NULL,
  `RightToHealthcare` varchar(50) DEFAULT NULL,
  `DrugAllergy` varchar(255) DEFAULT NULL,
  `Weight` float DEFAULT NULL,
  `Height` float DEFAULT NULL,
  `UserID` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PatientID`),
  UNIQUE KEY `UserID` (`UserID`),
  UNIQUE KEY `ThaiNationalID` (`ThaiNationalID`),
  KEY `StaffID` (`StaffID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Prescription`;
CREATE TABLE `Prescription` (
  `PrescriptionID` int NOT NULL AUTO_INCREMENT,
  `MedicineName` varchar(100) NOT NULL,
  `Dosage` varchar(50) DEFAULT NULL,
  `Duration` varchar(50) DEFAULT NULL,
  `Instruction` varchar(255) DEFAULT NULL,
  `RecordID` int NOT NULL,
  `DoctorID` int NOT NULL,
  PRIMARY KEY (`PrescriptionID`),
  KEY `RecordID` (`RecordID`),
  KEY `DoctorID` (`DoctorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Staff`;
CREATE TABLE `Staff` (
  `StaffID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Surname` varchar(50) NOT NULL,
  `Position` varchar(50) DEFAULT NULL,
  `Telephone` varchar(10) DEFAULT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`StaffID`),
  UNIQUE KEY `UserID` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` varchar(10) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Telephone` varchar(10) DEFAULT NULL,
  `Status` varchar(10) DEFAULT 'Active',
  `ProfileImageUrl` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ==========================================
-- 2. เพิ่มข้อมูล (MOCKUP DATA) แบบจัดเต็ม
-- ==========================================

-- เพิ่มข้อมูล User 10 คน (รหัสผ่าน 123456 ทั้งหมดเพื่อง่ายต่อการทดสอบ)
-- Note: หาก Spring Boot ของคุณใช้ BCrypt ให้เปลี่ยน '123456' เป็น '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
INSERT INTO User (UserID, Username, Password, Role, Email, Telephone, Status) VALUES 
(1,'admin01','123456','Admin','admin01@hospital.com','0800000001','Active'),
(2,'doctor01','123456','Doctor','doctor01@hospital.com','0800000002','Active'),
(3,'doctor02','123456','Doctor','doctor02@hospital.com','0800000003','Active'),
(4,'doctor03','123456','Doctor','doctor03@hospital.com','0800000004','Active'),
(5,'staff01','123456','Staff','staff01@hospital.com','0800000005','Active'),
(6,'staff02','123456','Staff','staff02@hospital.com','0800000006','Active'),
(7,'patient01','123456','Patient','patient01@hospital.com','0811111111','Active'),
(8,'patient02','123456','Patient','patient02@hospital.com','0822222222','Active'),
(9,'patient03','123456','Patient','patient03@hospital.com','0833333333','Active'),
(10,'patient04','123456','Patient','patient04@hospital.com','0844444444','Active');

-- ข้อมูล Department (แผนก)
INSERT INTO Department (DepartmentID, DepName) VALUES 
(1,'General Medicine'), (2,'Cardiology'), (3,'Pediatrics'), (4,'Orthopedics'), (5,'Dermatology');

-- ข้อมูล Admin
INSERT INTO Admin (AdminID, Name, UserID) VALUES (1,'Admin One', 1);

-- ข้อมูล Doctor (3 คน)
INSERT INTO Doctor (DoctorID, Name, Surname, Specialization, Telephone, Email, DepartmentID, UserID) VALUES 
(1,'Anan','Wong','General Practitioner','0800000002','doctor01@hospital.com', 1, 2),
(2,'Somchai','Rakdee','Cardiologist','0800000003','doctor02@hospital.com', 2, 3),
(3,'Somsri','Jaiyen','Pediatrician','0800000004','doctor03@hospital.com', 3, 4);

-- ข้อมูล Staff (2 คน)
INSERT INTO Staff (StaffID, Name, Surname, Position, Telephone, UserID) VALUES 
(1,'Kanyanat','Meejai','Nurse','0800000005', 5),
(2,'Nadet','Kugimiya','Receptionist','0800000006', 6);

-- ข้อมูล Patient (4 คน)
INSERT INTO Patient (PatientID, Name, Surname, Gender, DateOfBirth, Telephone, Address, BloodType, ThaiNationalID, UserID) VALUES 
(1,'สมชาย','ใจดี','M','1990-05-15','0811111111','กรุงเทพมหานคร','A','1111111111111', 7),
(2,'สมหญิง','รักสวย','F','1995-08-20','0822222222','เชียงใหม่','B','2222222222222', 8),
(3,'มานี','มีนา','F','2010-12-10','0833333333','ภูเก็ต','O','3333333333333', 9),
(4,'ปิติ','ใจกล้า','M','1985-02-28','0844444444','ขอนแก่น','AB','4444444444444', 10);

-- ข้อมูล Appointment (10 คิว กระจายสถานะและหมอ)
INSERT INTO Appointment (AppointmentID, AppointmentDate, AppointmentTime, QueueNumber, Status, DoctorID, PatientID, reason, preparation) VALUES 
(1,'2026-05-01','09:00:00', 1, 1, 1, 1, 'ตรวจสุขภาพประจำปี','งดน้ำและอาหาร 8 ชม.'),
(2,'2026-05-01','09:30:00', 2, 3, 1, 2, 'ปวดหัวรุนแรง','-'),
(3,'2026-05-01','10:00:00', 3, 0, 1, 3, 'เป็นไข้','-'),
(4,'2026-05-02','13:00:00', 1, 3, 2, 4, 'เจ็บหน้าอก','นำประวัติการรักษาเดิมมาด้วย'),
(5,'2026-05-02','13:30:00', 2, 2, 2, 1, 'ติดตามอาการโรคหัวใจ','-'),
(6,'2026-05-03','09:00:00', 1, 3, 3, 3, 'ฉีดวัคซีนเด็ก','นำสมุดวัคซีนมาด้วย'),
(7,'2026-05-04','10:00:00', 1, 1, 1, 4, 'ปวดท้อง','-'),
(8,'2026-05-05','11:00:00', 1, 3, 1, 2, 'เวียนหัว','-'),
(9,'2026-05-06','14:00:00', 1, 3, 2, 1, 'ตรวจคลื่นไฟฟ้าหัวใจ','-'),
(10,'2026-05-07','09:00:00', 1, 3, 3, 3, 'ไข้หวัดเด็ก','-');

-- ข้อมูล MedicalRecord (ประวัติการรักษา 5 รายการ)
INSERT INTO MedicalRecord (RecordID, VisitDate, Symptoms, Diagnosis, TreatmentDetail, TreatmentResult, Note, PatientID, DoctorID) VALUES 
(1, '2026-04-10', 'มีไข้สูง ไอ เจ็บคอ', 'ไข้หวัดใหญ่', 'ให้ยาลดไข้และยาฆ่าเชื้อ', 'อาการดีขึ้น', 'พักผ่อนให้เพียงพอ', 1, 1),
(2, '2026-04-15', 'ปวดศีรษะไมเกรน', 'ไมเกรน', 'ให้ยาแก้ปวดเฉพาะทาง', 'อาการทุเลาลง', 'หลีกเลี่ยงแสงแดดจ้า', 2, 1),
(3, '2026-04-20', 'แน่นหน้าอก หายใจลำบาก', 'โรคหัวใจเต้นผิดจังหวะ', 'ตรวจ ECG และให้ยาควบคุมการเต้นของหัวใจ', 'อาการทรงตัว', 'นัดตรวจซ้ำเดือนหน้า', 4, 2),
(4, '2026-04-25', 'เด็กมีไข้ 38 องศา และมีผื่น', 'ส่าไข้', 'เช็ดตัวและให้ยาลดไข้เด็ก', 'ผื่นลดลง', 'เฝ้าระวังอาการชัก', 3, 3),
(5, '2026-05-01', 'ตรวจสุขภาพทั่วไป', 'ปกติ', 'แนะนำการออกกำลังกาย', 'แข็งแรงดี', '-', 1, 1);

-- ข้อมูล Prescription (ใบสั่งยา 6 รายการ)
INSERT INTO Prescription (PrescriptionID, MedicineName, Dosage, Duration, Instruction, RecordID, DoctorID) VALUES 
(1, 'Paracetamol 500mg', '1 เม็ด', '5 วัน', 'ทานหลังอาหาร เช้า-เย็น', 1, 1),
(2, 'Amoxicillin 250mg', '1 แคปซูล', '7 วัน', 'ทานหลังอาหาร เช้า-เย็น (ต้องทานให้หมด)', 1, 1),
(3, 'Ibuprofen 400mg', '1 เม็ด', '3 วัน', 'ทานเมื่อมีอาการปวด', 2, 1),
(4, 'Amiodarone 200mg', '1 เม็ด', '30 วัน', 'ทานหลังอาหารเช้า', 3, 2),
(5, 'Paracetamol Syrup', '1 ช้อนชา', '3 วัน', 'ทานเมื่อมีไข้', 4, 3),
(6, 'Vitamin C', '1 เม็ด', '30 วัน', 'ทานบำรุงร่างกาย', 5, 1);

-- ข้อมูล Invoice (ใบแจ้งหนี้ 5 ใบ)
INSERT INTO Invoice (InvoiceID, InvoiceDate, TotalAmount, Status, PaymentMethod, PaidDate, PatientID, RecordID) VALUES 
(1, '2026-04-10', 1200.00, 'Paid', 'Credit Card', '2026-04-10', 1, 1),
(2, '2026-04-15', 850.00, 'Paid', 'Cash', '2026-04-15', 2, 2),
(3, '2026-04-20', 3500.00, 'Unpaid', NULL, NULL, 4, 3),
(4, '2026-04-25', 900.00, 'Paid', 'PromptPay', '2026-04-25', 3, 4),
(5, '2026-05-01', 1500.00, 'Unpaid', NULL, NULL, 1, 5);

-- ข้อมูล InvoiceItem (รายการแจกแจงในใบแจ้งหนี้)
INSERT INTO InvoiceItem (ItemID, Description, Amount, InvoiceID) VALUES 
(1, 'ค่าแพทย์', 500.00, 1), (2, 'ค่ายา', 700.00, 1),
(3, 'ค่าแพทย์', 500.00, 2), (4, 'ค่ายา', 350.00, 2),
(5, 'ค่าแพทย์เฉพาะทาง', 1000.00, 3), (6, 'ค่าตรวจ ECG', 1500.00, 3), (7, 'ค่ายา', 1000.00, 3),
(8, 'ค่าแพทย์', 500.00, 4), (9, 'ค่ายาเด็ก', 400.00, 4),
(10, 'แพ็กเกจตรวจสุขภาพ', 1500.00, 5);

-- ข้อมูล MedicalCertificate (ใบรับรองแพทย์ 3 ใบ)
INSERT INTO MedicalCertificate (CertificateID, IssueDate, Description, PatientID, DoctorID) VALUES 
(1,'2026-04-10','อาการ: ไข้หวัดใหญ่ | วัตถุประสงค์: ลาป่วย 3 วัน', 1, 1),
(2,'2026-04-15','อาการ: ไมเกรน | วัตถุประสงค์: ลาพักผ่อน 1 วัน', 2, 1),
(3,'2026-05-01','อาการ: ตรวจสุขภาพ | วัตถุประสงค์: สมัครงาน', 1, 1);

-- เปิดการเช็ค Foreign Key กลับมาเหมือนเดิม
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;