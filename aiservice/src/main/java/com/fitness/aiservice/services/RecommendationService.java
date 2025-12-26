package com.fitness.aiservice.services;

import com.fitness.aiservice.dto.ActivityRecommendationDTO;
import com.fitness.aiservice.dto.DeleteActivityEvent;
import com.fitness.aiservice.dto.RecommendationDTO;
import com.fitness.aiservice.models.Recommendation;
import com.fitness.aiservice.repositories.RecommendationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class RecommendationService {

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Autowired
    private RedisCachingService cachingService;

    public void saveRecommendation(Recommendation recommendation) {
        recommendationRepository.save(recommendation);
        log.info("Recommendation saved for the user {} with activity-id {}",
                recommendation.getUserId(),
                recommendation.getActivityId());
    }

    public void deleteRecommendation(DeleteActivityEvent deleteActivityEvent) {
        cachingService.deleteRecommendation(deleteActivityEvent);
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
        Recommendation response = cachingService.getRecommendationFromDB(activityId);
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
}
