package com.fitness.activityservice.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@Slf4j
public class UserValidationService {

    @Autowired
    private WebClient userServiceWebClient;

    public boolean validateUser(String userId) {

        log.info("Calling user validation for id: {}", userId);
        try {
            return userServiceWebClient
                    .get()
                    .uri("api/users/{userId}/validate", userId)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();
        } catch (NullPointerException | WebClientResponseException e) {
            log.error(e.toString());
        }
        return false;
    }
}
