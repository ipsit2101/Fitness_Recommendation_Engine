package com.fitness.userservice;

import com.fitness.userservice.models.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Boolean existsByEmail(String email);

    boolean existsByKeycloakId(String userId);

    User findByEmail(String email);

    User findByKeycloakId(String keycloakId);
}
