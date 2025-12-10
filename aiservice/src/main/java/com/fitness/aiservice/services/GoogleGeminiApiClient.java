package com.fitness.aiservice.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GoogleGeminiApiClient {

    @Autowired
    private WebClient webClient;

    @Value("${gemini.api.url}")
    private String googleGeminiApi_URL;

    @Value("${gemini.api.key}")
    private String googleGeminiApi_KEY;

    public ResponseEntity<String> getApiResponse(String prompt) {

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        try {
            String response = webClient
                    .post()
                    .uri(googleGeminiApi_URL)
                    .header("Content-type", "application/json")
                    .header("x-goog-api-key", googleGeminiApi_KEY)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error(e.toString());
        }
        return null;
    }
}
