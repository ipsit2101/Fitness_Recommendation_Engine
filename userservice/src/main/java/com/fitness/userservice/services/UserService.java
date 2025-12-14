package com.fitness.userservice.services;

import com.fitness.userservice.UserRepository;
import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.models.User;
import com.fitness.userservice.models.UserRole;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserResponse register(RegisterRequest registerRequest) {

        if (userRepository.existsByEmail(registerRequest.getEmail())) {

            User existingUser = userRepository.findByEmail(registerRequest.getEmail());
            return UserResponse.builder()
                    .id(existingUser.getId())
                    .keycloakId(existingUser.getKeycloakId())
                    .password(existingUser.getPassword())
                    .email(existingUser.getEmail())
                    .firstName(existingUser.getFirstName())
                    .lastName(existingUser.getLastName())
                    .role(String.valueOf(existingUser.getRole()))
                    .createdAt(existingUser.getCreatedAt())
                    .updatedAt(existingUser.getUpdatedAt())
                    .build();
        }

        User user = User.builder()
                .email(registerRequest.getEmail())
                .keycloakId(registerRequest.getKeycloakId())
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .password(registerRequest.getPassword())
                .role(UserRole.USER)
                .build();
        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .id(savedUser.getId())
                .keycloakId(savedUser.getKeycloakId())
                .password(savedUser.getPassword())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .role(String.valueOf(savedUser.getRole()))
                .createdAt(savedUser.getCreatedAt())
                .updatedAt(savedUser.getUpdatedAt())
                .build();
    }

    public UserResponse getUser(String userId) {

        if (userRepository.existsByKeycloakId(userId)) {

            User user = userRepository.findByKeycloakId(userId);
            return UserResponse.builder()
                    .id(user.getId())
                    .keycloakId(user.getKeycloakId())
                    .password(user.getPassword())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(String.valueOf(user.getRole()))
                    .createdAt(user.getCreatedAt())
                    .updatedAt(user.getUpdatedAt())
                    .build();

        }else throw new RuntimeException("User not found");
    }

    public Boolean existsByUserId(String userId) {
        boolean isValidUser = userRepository.existsByKeycloakId(userId);
        if (isValidUser) {
            log.info("----- User validation successful -----");
        }
        return isValidUser;
    }
}
