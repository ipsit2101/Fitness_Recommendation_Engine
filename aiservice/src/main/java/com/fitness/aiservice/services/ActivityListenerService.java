package com.fitness.aiservice.services;

import com.fitness.aiservice.dto.DeleteActivityEvent;
import com.fitness.aiservice.models.Activity;
import com.fitness.aiservice.models.Recommendation;
import com.fitness.aiservice.repositories.RecommendationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ActivityListenerService {

    @Autowired
    private ActivityResponseProcessingService activityResponseProcessingService;

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private RecommendationRepository recommendationRepository;

    @KafkaListener(
            topics = "${kafka.topic.activity-created}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "activityKafkaListenerContainerFactory"
    )
    public void processActivityMessage(Activity activity) {
        log.info("Received Activity for processing for the user: {} -> {}",
                activity.getUserId(), activity);
        Recommendation recommendation = activityResponseProcessingService.generateRecommendation(activity);
        if (recommendation != null) {
            recommendationService.saveRecommendation(recommendation);
        }
    }

    @KafkaListener(
            topics = "${kafka.topic.activity-deleted}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "deleteActivityKafkaListenerContainerFactory"
    )
    public void deleteActivityMessage(DeleteActivityEvent deleteActivityEvent) {
        log.info(
                "Received ACTIVITY_DELETED event for activityId={}",
                deleteActivityEvent.getActivityId()
        );
        recommendationService.deleteRecommendation(deleteActivityEvent);
    }
}
