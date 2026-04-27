CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

-- User table (ศูนย์กลาง authentication)
CREATE TABLE IF NOT EXISTS User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(10) NOT NULL CHECK (Role IN ('Admin', 'Doctor', 'Staff', 'Patient')),
    Email VARCHAR(100) NOT NULL UNIQUE,
    Telephone VARCHAR(10),
    Status VARCHAR(10) DEFAULT 'Active'
);

-- Admin table
CREATE TABLE IF NOT EXISTS Admin (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    UserID INT NOT NULL UNIQUE,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- Department table
CREATE TABLE IF NOT EXISTS Department (
    DepartmentID INT AUTO_INCREMENT PRIMARY KEY,
    DepName VARCHAR(100) NOT NULL
);

-- Doctor table
CREATE TABLE IF NOT EXISTS Doctor (
    DoctorID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Surname VARCHAR(50) NOT NULL,
    Specialization VARCHAR(100),
    Telephone VARCHAR(10),
    Email VARCHAR(100),
    DepartmentID INT,
    UserID INT NOT NULL UNIQUE,
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- Staff table
CREATE TABLE IF NOT EXISTS Staff (
    StaffID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Surname VARCHAR(50) NOT NULL,
    Position VARCHAR(50),
    Telephone VARCHAR(10),
    UserID INT NOT NULL UNIQUE,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- Patient table
CREATE TABLE IF NOT EXISTS Patient (
    PatientID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(64) NOT NULL,
    Surname VARCHAR(64) NOT NULL,
    Gender CHAR(1) CHECK (Gender IN ('M', 'F')),
    DateOfBirth DATE,
    Telephone VARCHAR(10),
    Address VARCHAR(255),
    BloodType VARCHAR(3),
    StaffID INT,
    ThaiNationalID VARCHAR(13) UNIQUE,
    ChronicIllness VARCHAR(255),
    RightToHealthcare VARCHAR(50),
    DrugAllergy VARCHAR(255),
    Weight FLOAT,
    Height FLOAT,
    UserID INT NOT NULL UNIQUE,
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- Appointment table
CREATE TABLE IF NOT EXISTS Appointment (
    AppointmentID INT AUTO_INCREMENT PRIMARY KEY,
    AppointmentDate DATE NOT NULL,
    AppointmentTime TIME NOT NULL,
    QueueNumber INT,
    Status INT DEFAULT 1 COMMENT '0=ยกเลิก, 1=นัดสำเร็จ, 2=เลื่อนนัด, 3=รอเข้าพบ',
    DoctorID INT NOT NULL,
    PatientID INT NOT NULL,
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID),
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID)
);

-- MedicalRecord table
CREATE TABLE IF NOT EXISTS MedicalRecord (
    RecordID INT AUTO_INCREMENT PRIMARY KEY,
    VisitDate DATE NOT NULL,
    Symptoms VARCHAR(255),
    Diagnosis VARCHAR(255),
    TreatmentDetail VARCHAR(255),
    TreatmentResult VARCHAR(100),
    Note VARCHAR(255),
    PatientID INT NOT NULL,
    DoctorID INT NOT NULL,
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID)
);

-- Prescription table
CREATE TABLE IF NOT EXISTS Prescription (
    PrescriptionID INT AUTO_INCREMENT PRIMARY KEY,
    MedicineName VARCHAR(100) NOT NULL,
    Dosage VARCHAR(50),
    Duration VARCHAR(50),
    Instruction VARCHAR(255),
    RecordID INT NOT NULL,
    DoctorID INT NOT NULL,
    FOREIGN KEY (RecordID) REFERENCES MedicalRecord(RecordID),
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID)
);

-- MedicalCertificate table
CREATE TABLE IF NOT EXISTS MedicalCertificate (
    CertificateID INT AUTO_INCREMENT PRIMARY KEY,
    IssueDate DATE NOT NULL,
    Description VARCHAR(255),
    PatientID INT NOT NULL,
    DoctorID INT NOT NULL,
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID)
);

-- Invoice table
CREATE TABLE IF NOT EXISTS Invoice (
    InvoiceID INT AUTO_INCREMENT PRIMARY KEY,
    InvoiceDate DATE NOT NULL,
    TotalAmount DECIMAL(10,2) DEFAULT 0,
    Status VARCHAR(10) DEFAULT 'Unpaid' CHECK (Status IN ('Paid', 'Unpaid')),
    PaymentMethod VARCHAR(20),
    PaidDate DATE,
    PatientID INT NOT NULL,
    RecordID INT NOT NULL UNIQUE,
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    FOREIGN KEY (RecordID) REFERENCES MedicalRecord(RecordID)
);

-- InvoiceItem table
CREATE TABLE IF NOT EXISTS InvoiceItem (
    ItemID INT AUTO_INCREMENT PRIMARY KEY,
    Description VARCHAR(255),
    Amount DECIMAL(10,2) NOT NULL,
    InvoiceID INT NOT NULL,
    FOREIGN KEY (InvoiceID) REFERENCES Invoice(InvoiceID)
);

-- ===== SAMPLE DATA =====

-- Insert Department
INSERT INTO Department (DepName) VALUES
('General Medicine'),
('Cardiology'),
('Pediatrics'),
('Orthopedics'),
('Dermatology');

-- Insert Users (password = 'password123' แบบ BCrypt)
INSERT INTO User (Username, Password, Role, Email, Telephone, Status) VALUES
('admin01', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'admin01@hospital.com', '0800000001', 'Active'),
('doctor01', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Doctor', 'doctor01@hospital.com', '0800000002', 'Active'),
('staff01', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Staff', 'staff01@hospital.com', '0800000003', 'Active'),
('patient01', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Patient', 'patient01@hospital.com', '0800000004', 'Active');

-- Insert Admin
INSERT INTO Admin (Name, UserID) VALUES ('Admin One', 1);

-- Insert Doctor
INSERT INTO Doctor (Name, Surname, Specialization, Telephone, Email, DepartmentID, UserID) VALUES
('Anan', 'Wong', 'General Practitioner', '0800000002', 'doctor01@hospital.com', 1, 2);

-- Insert Staff
INSERT INTO Staff (Name, Surname, Position, Telephone, UserID) VALUES
('Kanyanat', 'Meejai', 'Nurse', '0800000003', 3);

-- Insert Patient
INSERT INTO Patient (Name, Surname, Gender, DateOfBirth, Telephone, Address, BloodType, ThaiNationalID, RightToHealthcare, UserID) VALUES
('Krit', 'Weerakul', 'M', '1999-03-13', '0800000004', 'Bangkok', 'A', '1113642523959', 'Gold Card', 4);