package com.fitness.aiservice.services;

import com.fitness.aiservice.dto.DeleteActivityEvent;
import com.fitness.aiservice.models.Recommendation;
import com.fitness.aiservice.repositories.RecommendationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RedisCachingService {

    @Autowired
    private RecommendationRepository recommendationRepository;

    @CacheEvict(
            value = "activity-analysis",
            key = "#deleteActivityEvent.activityId"
    )
    public void deleteRecommendation(DeleteActivityEvent deleteActivityEvent) {
        recommendationRepository
                .deleteRecommendationByActivityId(deleteActivityEvent.getActivityId());
        log.info(
                "CACHE EVICT -> Deleted recommendation for activityId: {}",
                deleteActivityEvent.getActivityId()
        );
    }

    @Cacheable(
            value = "activity-analysis",
            key = "#activityId",
            unless = "#result == null"
    )
    public Recommendation getRecommendationFromDB(String activityId) {
        log.info("CACHE MISS -> Fetching recommendation for the activity from DB: {}", activityId);
        return recommendationRepository.findRecommendationByActivityId(activityId)
                .orElseThrow(() -> new RuntimeException("No recommendation found for the activity: " + activityId));
    }
}
