package com.fitness.aiservice.services;

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
    private RecommendationRepository recommendationRepository;

    @KafkaListener(topics = "${kafka.topic.name}", groupId = "${spring.kafka.consumer.group-id}")
    public void processActivityMessage(Activity activity) {
        log.info("Received Activity for processing for the user: {} -> {}", activity.getUserId(), activity);
        Recommendation recommendation = activityResponseProcessingService.generateRecommendation(activity);
        if (recommendation != null) {
            recommendationRepository.save(recommendation);
        }
    }
}
