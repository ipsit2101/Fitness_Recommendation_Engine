package com.fitness.activityservice.dto;

import lombok.Data;
import com.fitness.activityservice.model.ActivityType;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityRequest {

    private String userId;
    private ActivityType activityType;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private Map<String, Object> additionalMetrics;
}
