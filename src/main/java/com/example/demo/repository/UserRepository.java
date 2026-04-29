package com.example.demo.repository;

import com.example.demo.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {

	Optional<UserEntity> findByUsername(String username);

	Optional<UserEntity> findByEmail(String email);

	@Query("SELECT u.role FROM UserEntity u WHERE u.username = :username")
    Optional<String> findRoleByUsername(@Param("username") String username);
	
	@Query("SELECT u.id FROM UserEntity u WHERE u.email = :email")
    Optional<Integer> findIdByEmail(@Param("email") String email);

	boolean existsByUsername(String username);

	boolean existsByEmail(String email);
}