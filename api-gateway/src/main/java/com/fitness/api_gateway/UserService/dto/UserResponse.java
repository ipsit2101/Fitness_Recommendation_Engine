package com.fitness.api_gateway.UserService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private String id;
    private String keycloakId;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
