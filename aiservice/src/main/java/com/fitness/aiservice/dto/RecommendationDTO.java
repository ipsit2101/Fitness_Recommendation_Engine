package com.fitness.aiservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecommendationDTO {

    private String analysis;
    private List<String> improvements;
    private List<String> suggestions;
    private List<String> safetyInstructions;
}
