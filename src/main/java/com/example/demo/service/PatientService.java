package com.example.demo.service;

import com.example.demo.model.Patient;
import com.example.demo.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {
	
	@Autowired
    private PatientRepository repo;

    // GET ALL
    public List<Patient> getAll() {
        return repo.findAll();
    }

    // GET BY ID
    public Patient getById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    // CREATE
    public Patient create(Patient p) {

        // กัน Thai ID ซ้ำ
        if (repo.existsByThaiNationalId(p.getThaiNationalId())) {
            throw new RuntimeException("Thai National ID already exists");
        }

        return repo.save(p);
    }

    // UPDATE
    public Patient update(Integer id, Patient newData) {
        Patient old = getById(id);

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
    public List<Patient> search(String keyword) {
        return repo.findByNameContainingIgnoreCaseOrSurnameContainingIgnoreCase(keyword, keyword);
    }

    // FILTER BY STAFF
    public List<Patient> getByStaff(Integer staffId) {
        return repo.findByStaff_StaffId(staffId);
    }

}
