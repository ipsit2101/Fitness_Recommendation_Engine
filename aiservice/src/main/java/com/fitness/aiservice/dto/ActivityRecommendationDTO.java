package com.fitness.aiservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityRecommendationDTO {

    private String id;
    private String activityId;
    private String activityType;
    private String userId;

    private RecommendationDTO recommendation;
}
