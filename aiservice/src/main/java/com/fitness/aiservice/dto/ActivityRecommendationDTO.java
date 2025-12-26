package com.fitness.aiservice.dto;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityRecommendationDTO {

    private String id;
    private String activityId;
    private String activityType;
    private Integer duration;
    private Integer caloriesBurned;
    private String userId;
    private LocalDateTime createdAt;

    private Map<String, Object> activityMetrics;
    private RecommendationDTO recommendation;
}
