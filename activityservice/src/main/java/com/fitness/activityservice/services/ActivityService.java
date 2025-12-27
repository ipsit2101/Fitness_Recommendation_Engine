package com.fitness.activityservice.services;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.dto.DeleteActivityEvent;
import com.fitness.activityservice.model.Activity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.Duration;
import java.time.LocalDateTime;
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
    private RedisCachingService cachingService;

    @Autowired
    private KafkaTemplate<String, Activity> genKafkaTemplate;

    @Autowired
    private KafkaTemplate<String, DeleteActivityEvent> delKafkaTemplate;

    @Value("${kafka.topic.activity-created}")
    private String createTopicName;

    @Value("${kafka.topic.activity-deleted}")
    private String deleteTopicName;

    private static final Duration CACHE_TTL = Duration.ofMinutes(10);

    @Transactional
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
        cachingService.evict(getCacheKey(savedaActivity.getUserId()));
        log.info("CACHE EVICT -> Removing cached activities for the user-id: {}", savedaActivity.getUserId());

        try {
            genKafkaTemplate.send(createTopicName, savedaActivity.getUserId(), savedaActivity);
            log.info("Activity details sent to topic {} for userId: {}", createTopicName, savedaActivity.getUserId());
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

    public List<ActivityResponse> getUserActivities(String userId) {

        String cacheKey = getCacheKey(userId);
        List<ActivityResponse> cachedResponse = (List<ActivityResponse>) cachingService.get(cacheKey);
        if (cachedResponse != null) {
            return cachedResponse;
        }

        // DB FALLBACK
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
                            .additionalMetrics(activity.getAdditionalMetrics())
                            .startTime(activity.getStartTime())
                            .createdAt(activity.getCreatedAt())
                            .build()
            );
        }
        cachingService.put(cacheKey, responseList, CACHE_TTL);
        return responseList;
    }

    @Transactional
    public void deleteActivity(String activityId, String userId) throws AccessDeniedException {

        boolean isValidUser = userValidationService.validateUser(userId);
        if (!isValidUser) {
            throw new RuntimeException("Unauthorized user: " + userId);
        }
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() ->
                        new RuntimeException("Activity not found: " + activityId));
        if (!activity.getUserId().equals(userId)) {
            throw new AccessDeniedException("Not allowed to delete this activity");
        }

        activityRepository.deleteById(activityId);
        log.info("Activity {} deleted from DB", activityId);

        // CACHE EVICT
        cachingService.evict(getCacheKey(userId));
        log.info("CACHE EVICT -> Removing cached activities for the userId: {}", userId);

        //publishing kafka event
        try {
            DeleteActivityEvent event = DeleteActivityEvent.builder()
                    .activityId(activityId)
                    .userId(userId)
                    .deletedAt(LocalDateTime.now())
                    .build();
            delKafkaTemplate.send(deleteTopicName, activityId, event);
            log.info("Published ACTIVITY_DELETED event for userId {} for activity: {}", userId, activity);

        } catch (Exception e) {
            log.error(e.toString());
        }
    }

    private String getCacheKey(String key) {
        return "user-activities::" + key;
    }
}
