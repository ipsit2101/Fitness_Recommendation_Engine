package com.fitness.aiservice.services;

import com.fitness.aiservice.dto.ActivityRecommendationDTO;
import com.fitness.aiservice.dto.RecommendationDTO;
import com.fitness.aiservice.models.Recommendation;
import com.fitness.aiservice.repositories.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    @Autowired
    private RecommendationRepository recommendationRepository;
    
    public List<ActivityRecommendationDTO> getUserRecommendations(String userId) {

        List<Recommendation> recommendations = recommendationRepository.findRecommendationByUserId(userId);
        List<ActivityRecommendationDTO> activityRecommendationDTOList = new ArrayList<>();
        for (Recommendation recommendation : recommendations) {
            activityRecommendationDTOList.add(toDTO(recommendation));
        }
        return activityRecommendationDTOList;
    }

    public ActivityRecommendationDTO getActivityRecommendations(String activityId) {

        Recommendation response = recommendationRepository.findRecommendationByActivityId(activityId)
                .orElseThrow(() -> new RuntimeException("No recommendation found for the activity: " + activityId));
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
