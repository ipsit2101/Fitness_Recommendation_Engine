package com.fitness.api_gateway.UserService;

import com.fitness.api_gateway.UserService.dto.RegisterRequest;
import com.fitness.api_gateway.UserService.dto.UserResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.text.MessageFormat;

@Service
@Slf4j
public class UserServiceClient {

    @Autowired
    private WebClient userServiceWebClient;


    String userServiceBaseUrl = "http://USER-SERVICE";

    public Mono<Boolean> validateUser(String userId) {

        log.info("Calling user validation for id: {}", userId);
        String apiUrl = MessageFormat.format("api/users/{0}/validate",userId);

        return userServiceWebClient
                .get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(Boolean.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                        return Mono.error(new RuntimeException("User " + userId + " not found"));
                    } else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                        return Mono.error(new RuntimeException("Invalid user: " + userId));
                    } else {
                        return Mono.error(new RuntimeException("Unexpected error occurred: " + e.getMessage()));
                    }
                });
    }

    public Mono<UserResponse> registerUser(RegisterRequest registerRequest) {

        log.info("Calling user registration API for the user: {}", registerRequest.getKeycloakId());
        String registerUrl = "api/users/register";

        return userServiceWebClient.post()
                .uri(registerUrl)
                .bodyValue(registerRequest)
                .retrieve()
                .bodyToMono(UserResponse.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                        return Mono.error(new RuntimeException("Bad request: " + e.getMessage()));
                    } else {
                        return Mono.error(new RuntimeException("Unexpected error occurred: " + e.getMessage()));
                    }
                });
    }
}
