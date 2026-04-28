package com.example.demo.service;

import com.example.demo.model.Patient;
import com.example.demo.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.example.demo.dto.PatientDTO;
import com.example.demo.mapper.PatientMapper;

import com.example.demo.dto.PatientRegisterRequestDTO;
import com.example.demo.model.UserEntity;
import com.example.demo.repository.UserRepository;

@Service
public class PatientService {
	
	@Autowired
    private PatientRepository repo;
	
	@Autowired
	private UserRepository userRepository;
	
	private Patient getEntityById(Integer id) {
	    return repo.findById(id)
	            .orElseThrow(() -> new RuntimeException("Patient not found"));
	}
	
	public Patient register(PatientRegisterRequestDTO req) {

	    // กัน username ซ้ำ
	    if (userRepository.existsByUsername(req.getUsername())) {
	        throw new RuntimeException("Username already exists");
	    }

	    if (userRepository.existsByEmail(req.getEmail())) {
	        throw new RuntimeException("Email already exists");
	    }
	    
	    if (repo.existsByThaiNationalId(req.getThaiNationalId())) {
	        throw new RuntimeException("Thai National ID already exists");
	    }

	    // 1. สร้าง User
	    UserEntity user = UserEntity.builder()
	            .username(req.getUsername())
	            .password(req.getPassword()) 
	            .email(req.getEmail())
	            .telephone(req.getTelephone())
	            .role(UserEntity.UserRole.Patient)
	            .status("Active")
	            .build();

	    userRepository.save(user);

	    // 2. สร้าง Patient
	    Patient patient = Patient.builder()
	            .name(req.getName())
	            .surname(req.getSurname())
	            .gender(req.getGender())
	            .dateOfBirth(java.time.LocalDate.parse(req.getDateOfBirth()))
	            .telephone(req.getTelephone())
	            .user(user) 
	            .build();

	    return repo.save(patient);
	}

    // GET ALL
	public List<PatientDTO> getAll() {
	    return repo.findAll()
	            .stream()
	            .map(PatientMapper::toDTO)
	            .toList();
	}

    // GET BY ID
	public PatientDTO getById(Integer id) {
	    Patient p = repo.findById(id)
	            .orElseThrow(() -> new RuntimeException("Patient not found"));

	    return PatientMapper.toDTO(p);
	}

    // CREATE
	 public Patient create(Patient p) {
	        if (repo.existsByThaiNationalId(p.getThaiNationalId())) {
	            throw new RuntimeException("Thai National ID already exists");
	        }
	        return repo.save(p);
	    }

    // UPDATE
	 public Patient update(Integer id, Patient newData) {
	        Patient old = getEntityById(id);

	        old.setName(newData.getName());
	        old.setSurname(newData.getSurname());
	        old.setGender(newData.getGender());
	        old.setDateOfBirth(newData.getDateOfBirth());
	        old.setTelephone(newData.getTelephone());
	        old.setAddress(newData.getAddress());
	        old.setBloodType(newData.getBloodType());
	        old.setThaiNationalId(newData.getThaiNationalId());
	        old.setChronicIllness(newData.getChronicIllness());
	        old.setRightToHealthcare(newData.getRightToHealthcare());
	        old.setDrugAllergy(newData.getDrugAllergy());
	        old.setWeight(newData.getWeight());
	        old.setHeight(newData.getHeight());

	        return repo.save(old);
	    }

    // DELETE
	 public void delete(Integer id) {
	        repo.deleteById(id);
	    }

    // SEARCH
	 public List<PatientDTO> search(String keyword) {
	        return repo.findByNameContainingIgnoreCaseOrSurnameContainingIgnoreCase(keyword, keyword)
	                .stream()
	                .map(PatientMapper::toDTO)
	                .toList();
	    }

    // FILTER BY STAFF
	 public List<PatientDTO> getByStaff(Integer staffId) {
	        return repo.findByStaff_StaffId(staffId)
	                .stream()
	                .map(PatientMapper::toDTO)
	                .toList();
	    }

}
