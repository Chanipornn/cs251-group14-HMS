-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: hospital_db
-- ------------------------------------------------------
-- Server version	8.4.9

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

--
-- Table structure for table `AccountLog`
--

DROP TABLE IF EXISTS `AccountLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AccountLog` (
  `LogID` int NOT NULL AUTO_INCREMENT,
  `Action` varchar(30) NOT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `Detail` varchar(255) DEFAULT NULL,
  `TargetRole` varchar(20) DEFAULT NULL,
  `TargetUserID` int DEFAULT NULL,
  PRIMARY KEY (`LogID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AccountLog`
--

LOCK TABLES `AccountLog` WRITE;
/*!40000 ALTER TABLE `AccountLog` DISABLE KEYS */;
/*!40000 ALTER TABLE `AccountLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Admin`
--

DROP TABLE IF EXISTS `Admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admin` (
  `AdminID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`AdminID`),
  UNIQUE KEY `UserID` (`UserID`),
  CONSTRAINT `Admin_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin`
--

LOCK TABLES `Admin` WRITE;
/*!40000 ALTER TABLE `Admin` DISABLE KEYS */;
INSERT INTO `Admin` VALUES (1,'Admin One',1);
/*!40000 ALTER TABLE `Admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Appointment`
--

DROP TABLE IF EXISTS `Appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Appointment` (
  `AppointmentID` int NOT NULL AUTO_INCREMENT,
  `AppointmentDate` date NOT NULL,
  `AppointmentTime` time NOT NULL,
  `QueueNumber` int DEFAULT NULL,
  `Status` int DEFAULT '1' COMMENT '0=à¸¢à¸à¹€à¸¥à¸´à¸, 1=à¸™à¸±à¸”à¸ªà¸³à¹€à¸£à¹‡à¸ˆ, 2=à¹€à¸¥à¸·à¹ˆà¸­à¸™à¸™à¸±à¸”, 3=à¸£à¸­à¹€à¸‚à¹‰à¸²à¸žà¸š',
  `DoctorID` int NOT NULL,
  `PatientID` int NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `preparation` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`AppointmentID`),
  KEY `DoctorID` (`DoctorID`),
  KEY `PatientID` (`PatientID`),
  CONSTRAINT `Appointment_ibfk_1` FOREIGN KEY (`DoctorID`) REFERENCES `Doctor` (`DoctorID`),
  CONSTRAINT `Appointment_ibfk_2` FOREIGN KEY (`PatientID`) REFERENCES `Patient` (`PatientID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Appointment`
--

LOCK TABLES `Appointment` WRITE;
/*!40000 ALTER TABLE `Appointment` DISABLE KEYS */;
INSERT INTO `Appointment` VALUES (1,'2026-05-05','10:00:00',91,2,1,1,'General Physical Examination','Get enough sleep'),(2,'2026-05-01','10:00:00',32,0,1,1,NULL,NULL),(3,'2026-04-29','10:00:00',62,2,1,1,'เจ็บคอ','-'),(4,'2026-05-01','10:00:00',75,0,1,1,NULL,NULL),(5,'2026-06-11','10:00:00',78,2,1,1,'ติดตามอาการ','นอนหลับพักผ่อนให้เพียงพอ'),(6,'2026-04-07','10:40:00',8,3,1,1,'ตรวจทั่วไป','กรุณามาก่อน 15 นาที'),(7,'2026-05-07','11:30:00',1,3,1,14,'ตรวจทั่วไป','กรุณามาก่อน 15 นาที'),(8,'2026-05-05','11:30:00',92,3,1,14,'ติดตามอาการ','กรุณามาก่อน 15 นาที'),(9,'2026-05-04','10:40:00',1,3,1,14,'ติดตามอาการ','กรุณามาก่อน 15 นาที'),(10,'2026-05-06','13:40:00',1,3,1,14,'ติดตามอาการ','กรุณามาก่อน 15 นาที'),(11,'2026-05-03','10:00:00',1,3,1,14,'ติดตามอาการ','กรุณามาก่อน 15 นาที'),(12,'2026-06-06','10:00:00',1,0,1,14,'ติดตามอาการ','กรุณามาก่อน 15 นาที'),(13,'2026-06-07','13:40:00',1,0,1,14,'ติดตามอาการ','กรุณามาก่อน 15 นาที');
/*!40000 ALTER TABLE `Appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Department`
--

DROP TABLE IF EXISTS `Department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Department` (
  `DepartmentID` int NOT NULL AUTO_INCREMENT,
  `DepName` varchar(100) NOT NULL,
  PRIMARY KEY (`DepartmentID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Department`
--

LOCK TABLES `Department` WRITE;
/*!40000 ALTER TABLE `Department` DISABLE KEYS */;
INSERT INTO `Department` VALUES (1,'General Medicine'),(2,'Cardiology'),(3,'Pediatrics'),(4,'Orthopedics'),(5,'Dermatology');
/*!40000 ALTER TABLE `Department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Doctor`
--

DROP TABLE IF EXISTS `Doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  KEY `DepartmentID` (`DepartmentID`),
  CONSTRAINT `Doctor_ibfk_1` FOREIGN KEY (`DepartmentID`) REFERENCES `Department` (`DepartmentID`),
  CONSTRAINT `Doctor_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Doctor`
--

LOCK TABLES `Doctor` WRITE;
/*!40000 ALTER TABLE `Doctor` DISABLE KEYS */;
INSERT INTO `Doctor` VALUES (1,'Anan','Wong','General Practitioner','0800000002','doctor01@hospital.com',1,2);
/*!40000 ALTER TABLE `Doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Invoice`
--

DROP TABLE IF EXISTS `Invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  KEY `PatientID` (`PatientID`),
  CONSTRAINT `Invoice_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `Patient` (`PatientID`),
  CONSTRAINT `Invoice_ibfk_2` FOREIGN KEY (`RecordID`) REFERENCES `MedicalRecord` (`RecordID`),
  CONSTRAINT `Invoice_chk_1` CHECK ((`Status` in (_latin1'Paid',_latin1'Unpaid')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Invoice`
--

LOCK TABLES `Invoice` WRITE;
/*!40000 ALTER TABLE `Invoice` DISABLE KEYS */;
/*!40000 ALTER TABLE `Invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InvoiceItem`
--

DROP TABLE IF EXISTS `InvoiceItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InvoiceItem` (
  `ItemID` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(255) DEFAULT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `InvoiceID` int NOT NULL,
  PRIMARY KEY (`ItemID`),
  KEY `InvoiceID` (`InvoiceID`),
  CONSTRAINT `InvoiceItem_ibfk_1` FOREIGN KEY (`InvoiceID`) REFERENCES `Invoice` (`InvoiceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InvoiceItem`
--

LOCK TABLES `InvoiceItem` WRITE;
/*!40000 ALTER TABLE `InvoiceItem` DISABLE KEYS */;
/*!40000 ALTER TABLE `InvoiceItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MedicalCertificate`
--

DROP TABLE IF EXISTS `MedicalCertificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MedicalCertificate` (
  `CertificateID` int NOT NULL AUTO_INCREMENT,
  `IssueDate` date NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `PatientID` int NOT NULL,
  `DoctorID` int NOT NULL,
  PRIMARY KEY (`CertificateID`),
  KEY `PatientID` (`PatientID`),
  KEY `DoctorID` (`DoctorID`),
  CONSTRAINT `MedicalCertificate_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `Patient` (`PatientID`),
  CONSTRAINT `MedicalCertificate_ibfk_2` FOREIGN KEY (`DoctorID`) REFERENCES `Doctor` (`DoctorID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MedicalCertificate`
--

LOCK TABLES `MedicalCertificate` WRITE;
/*!40000 ALTER TABLE `MedicalCertificate` DISABLE KEYS */;
INSERT INTO `MedicalCertificate` VALUES (1,'2026-04-28','Sick leave 3 days',1,1);
/*!40000 ALTER TABLE `MedicalCertificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MedicalRecord`
--

DROP TABLE IF EXISTS `MedicalRecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  KEY `DoctorID` (`DoctorID`),
  CONSTRAINT `MedicalRecord_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `Patient` (`PatientID`),
  CONSTRAINT `MedicalRecord_ibfk_2` FOREIGN KEY (`DoctorID`) REFERENCES `Doctor` (`DoctorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MedicalRecord`
--

LOCK TABLES `MedicalRecord` WRITE;
/*!40000 ALTER TABLE `MedicalRecord` DISABLE KEYS */;
/*!40000 ALTER TABLE `MedicalRecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Patient`
--

DROP TABLE IF EXISTS `Patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  KEY `StaffID` (`StaffID`),
  CONSTRAINT `Patient_ibfk_1` FOREIGN KEY (`StaffID`) REFERENCES `Staff` (`StaffID`),
  CONSTRAINT `Patient_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`),
  CONSTRAINT `Patient_chk_1` CHECK ((`Gender` in (_utf8mb4'M',_utf8mb4'F')))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Patient`
--

LOCK TABLES `Patient` WRITE;
/*!40000 ALTER TABLE `Patient` DISABLE KEYS */;
INSERT INTO `Patient` VALUES (1,'Updated Name','Test','M','2000-01-01','0999999999','Chiang Mai','A',NULL,'1113642523959',NULL,NULL,NULL,NULL,NULL,4,'2026-04-28 08:55:27','2026-04-28 13:00:48'),(7,'Anan','Suksan','M','1995-07-21','0822222222','Chiang Mai','B',NULL,'4443642523959','Diabetes','Gold Card','Penicillin',70,175,5,'2026-04-28 10:33:46','2026-04-28 10:33:46'),(8,'Suda','Thongchai','F','2001-11-05','0833333333','Phuket','O',NULL,'5553642523959',NULL,'Social Security',NULL,55,160,6,'2026-04-28 10:38:23','2026-04-28 10:38:23'),(10,'Somchai','Jaidee','M','1995-01-10','0811111111',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,'2026-04-28 12:57:22','2026-04-28 12:57:22'),(13,'Test_15','tenfif','m','1999-10-15','0854265398','Homie','A',NULL,'1142352140214','-','Gold Card','-',70,185,19,'2026-04-30 16:02:37','2026-04-30 16:12:50'),(14,'Test_16','tensix','m','1995-12-26','0998457265','Homie 16','AB',NULL,'1265462589652','หอบ','Gold Card','penicillin',70,185,20,'2026-04-30 16:17:23','2026-04-30 16:37:52'),(15,'Test_17','tensev','m','2010-03-01','0998547236','Homie 17','AB',NULL,'1254856325423','หอบ','Gold Card','penicillin',70,185,21,'2026-05-01 08:45:37','2026-05-01 08:47:09');
/*!40000 ALTER TABLE `Patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Prescription`
--

DROP TABLE IF EXISTS `Prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  KEY `DoctorID` (`DoctorID`),
  CONSTRAINT `Prescription_ibfk_1` FOREIGN KEY (`RecordID`) REFERENCES `MedicalRecord` (`RecordID`),
  CONSTRAINT `Prescription_ibfk_2` FOREIGN KEY (`DoctorID`) REFERENCES `Doctor` (`DoctorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Prescription`
--

LOCK TABLES `Prescription` WRITE;
/*!40000 ALTER TABLE `Prescription` DISABLE KEYS */;
/*!40000 ALTER TABLE `Prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Staff`
--

DROP TABLE IF EXISTS `Staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Staff` (
  `StaffID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Surname` varchar(50) NOT NULL,
  `Position` varchar(50) DEFAULT NULL,
  `Telephone` varchar(10) DEFAULT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`StaffID`),
  UNIQUE KEY `UserID` (`UserID`),
  CONSTRAINT `Staff_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Staff`
--

LOCK TABLES `Staff` WRITE;
/*!40000 ALTER TABLE `Staff` DISABLE KEYS */;
INSERT INTO `Staff` VALUES (1,'Kanyanat','Meejai','Nurse','0800000003',3);
/*!40000 ALTER TABLE `Staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  UNIQUE KEY `Email` (`Email`),
  CONSTRAINT `User_chk_1` CHECK ((`Role` in (_utf8mb4'Admin',_utf8mb4'Doctor',_utf8mb4'Staff',_utf8mb4'Patient')))
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'admin01','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Admin','admin01@hospital.com','0800000001','Active',NULL),(2,'doctor01','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Doctor','doctor01@hospital.com','0800000002','Active',NULL),(3,'staff01','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Staff','staff01@hospital.com','0800000003','Active',NULL),(4,'patient01','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Patient','patient01@hospital.com','0800000004','Active',NULL),(5,'patient02','123456','Patient','patient02@hospital.com','0811111111','Active',NULL),(6,'patient03','123456','Patient','patient03@hospital.com','0822222222','Active',NULL),(8,'patient10','123456','Patient','p10@hospital.com','0811111111','Active',NULL),(9,'test05','test05','Patient','test05@gmail.com','0999999999','Active',NULL),(19,'test15','test15','Patient','test15@gmail.com',NULL,'Active',NULL),(20,'test16','test16','Patient','test16@gmail.com',NULL,'Active',NULL),(21,'test17','test17','Patient','test17@gmail.com',NULL,'Active',NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-01 16:27:19
