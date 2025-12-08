package com.fitness.activityservice.services;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.model.ActivityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserValidationService userValidationService;

    public ActivityResponse trackActivity(ActivityRequest activityRequest) {

        boolean isValidUser = userValidationService.validateUser(activityRequest.getUserId());
        if (!isValidUser) {
            throw new RuntimeException("User " + activityRequest.getUserId() + " not found");
        }

        Activity activity = Activity.builder()
                .userId(activityRequest.getUserId())
                .activityType(ActivityType.RUNNING)
                .duration(activityRequest.getDuration())
                .caloriesBurned(activityRequest.getCaloriesBurned())
                .startTime(activityRequest.getStartTime())
                .additionalMetrics(activityRequest.getAdditionalMetrics())
                .build();

        Activity savedaActivity = activityRepository.save(activity);

        return ActivityResponse.builder()
                .id(savedaActivity.getId())
                .userId(savedaActivity.getUserId())
                .activityType(savedaActivity.getActivityType())
                .duration(savedaActivity.getDuration())
                .caloriesBurned(savedaActivity.getCaloriesBurned())
                .startTime(savedaActivity.getStartTime())
                .additionalMetrics(savedaActivity.getAdditionalMetrics())
                .createdAt(savedaActivity.getCreatedAt())
                .updatedAt(savedaActivity.getUpdatedAt())
                .build();
    }
}
