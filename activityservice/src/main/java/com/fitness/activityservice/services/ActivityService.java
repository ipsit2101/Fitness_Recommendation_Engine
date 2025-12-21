package com.fitness.activityservice.services;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserValidationService userValidationService;

    @Autowired
    private KafkaTemplate<String, Activity> kafkaTemplate;

    @Value("${kafka.topic.name}")
    private String topicName;

    @CacheEvict(
            value = "user-activities",
            key = "#activityRequest.userId"
    )
    public ActivityResponse trackActivity(ActivityRequest activityRequest) {

        boolean isValidUser = userValidationService.validateUser(activityRequest.getUserId());
        if (!isValidUser) {
            throw new RuntimeException("User " + activityRequest.getUserId() + " not found");
        }

        Activity activity = Activity.builder()
                .userId(activityRequest.getUserId())
                .activityType(activityRequest.getActivityType())
                .duration(activityRequest.getDuration())
                .caloriesBurned(activityRequest.getCaloriesBurned())
                .startTime(activityRequest.getStartTime())
                .additionalMetrics(activityRequest.getAdditionalMetrics())
                .build();

        Activity savedaActivity = activityRepository.save(activity);
        log.info("Activity saved for the user {} : {}",activityRequest.getUserId(), savedaActivity);

        // CACHE EVICTION (EXPLICIT EVICTION POLICY)
        log.info("CACHE EVICT -> Removing cached activities for the user-id: {}", savedaActivity.getUserId());

        try {
            kafkaTemplate.send(topicName, savedaActivity.getUserId(), savedaActivity);
            log.info("Activity details sent to topic {} for userId: {}", topicName, savedaActivity.getUserId());
        } catch (Exception e) {
            log.error(e.toString());
        }

        return ActivityResponse.builder()
                .activityId(savedaActivity.getId())
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

    @Cacheable(
            value = "user-activities",
            key = "#userId"
    )
    public List<ActivityResponse> getUserActivities(String userId) {

        //CACHE MISS
        log.info("CACHE MISS -> Fetching activity details of the user from DB: {}", userId);
        List<Activity> activities = activityRepository.findByUserId(userId);
        List<ActivityResponse> responseList = new ArrayList<>();
        for (Activity activity : activities) {
            responseList.add(
                    ActivityResponse.builder()
                            .activityId(activity.getId())
                            .userId(activity.getUserId())
                            .activityType(activity.getActivityType())
                            .duration(activity.getDuration())
                            .caloriesBurned(activity.getCaloriesBurned())
                            .startTime(activity.getStartTime())
                            .build()
            );
        }
        return responseList;
    }
}
