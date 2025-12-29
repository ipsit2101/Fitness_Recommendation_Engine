package com.fitness.aiservice.services;

import com.fitness.aiservice.dto.ActivityRecommendationDTO;
import com.fitness.aiservice.dto.DeleteActivityEvent;
import com.fitness.aiservice.dto.RecommendationDTO;
import com.fitness.aiservice.models.Recommendation;
import com.fitness.aiservice.repositories.RecommendationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class RecommendationService {

    @Autowired
    private RecommendationRepository recommendationRepository;

    private static final Duration CACHE_TTL = Duration.ofMinutes(10);

    @Autowired
    private RedisCachingService cachingService;

    public void saveRecommendation(Recommendation recommendation) {
        recommendationRepository.save(recommendation);
        log.info("Recommendation saved for the user {} with activity-id {}",
                recommendation.getUserId(),
                recommendation.getActivityId());
    }

    public void deleteRecommendation(DeleteActivityEvent deleteActivityEvent) {
        recommendationRepository
                .deleteRecommendationByActivityId(deleteActivityEvent.getActivityId());

        // CACHE EVICT
        cachingService.evictAsync(getCacheKey(deleteActivityEvent.getActivityId()));
        log.info(
                "CACHE EVICT -> Deleted recommendation for activityId: {}",
                deleteActivityEvent.getActivityId()
        );
    }
    
    public List<ActivityRecommendationDTO> getUserRecommendations(String userId) {

        List<Recommendation> recommendations = recommendationRepository.findRecommendationByUserId(userId);
        List<ActivityRecommendationDTO> activityRecommendationDTOList = new ArrayList<>();
        for (Recommendation recommendation : recommendations) {
            activityRecommendationDTOList.add(toDTO(recommendation));
        }
        return activityRecommendationDTOList;
    }

    public ActivityRecommendationDTO getActivityRecommendations(String activityId) {

        String cacheKey = getCacheKey(activityId);
        Recommendation cachedResponse = cachingService.get(cacheKey, Recommendation.class); // response is null for now
        if (cachedResponse != null) {
            return toDTO(cachedResponse);
        }

        log.info("CACHE MISS -> Fetching recommendation for the activity from DB: {}", activityId);
        Recommendation response = recommendationRepository.findRecommendationByActivityId(activityId)
                .orElseThrow(() -> new RuntimeException("No recommendation found for the activity: " + activityId));
        log.info("DB response: {}", response.getActivityId());
        cachingService.putAsync(cacheKey, response, CACHE_TTL);
        return toDTO(response);
    }

    private ActivityRecommendationDTO toDTO(Recommendation response) {
        return ActivityRecommendationDTO.builder()
                .id(response.getId())
                .createdAt(response.getCreatedAt())
                .activityId(response.getActivityId())
                .activityType(response.getActivityType())
                .duration(response.getDuration())
                .caloriesBurned(response.getCaloriesBurned())
                .userId(response.getUserId())
                .activityMetrics(response.getMetrics())
                .recommendation(
                        RecommendationDTO.builder()
                                .analysis(response.getAnalysis())
                                .improvements(response.getImprovements())
                                .suggestions(response.getSuggestions())
                                .safetyInstructions(response.getSafetyInstructions())
                                .build()
                )
                .build();
    }

    String getCacheKey(String key) {
        return "activity::recommendation::" + key;
    }
}
