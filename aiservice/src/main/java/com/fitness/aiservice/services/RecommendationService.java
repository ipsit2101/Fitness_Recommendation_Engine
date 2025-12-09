package com.fitness.aiservice.services;

import com.fitness.aiservice.models.Recommendation;
import com.fitness.aiservice.repositories.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    @Autowired
    private RecommendationRepository recommendationRepository;
    
    public List<Recommendation> getUserRecommendations(String userId) {
        return recommendationRepository.findRecommendationByUserId(userId);
    }

    public Recommendation getActivityRecommendations(String activityId) {
        return recommendationRepository.findRecommendationByActivityId(activityId)
                .orElseThrow(() -> new RuntimeException("No recommendation found for activity: " + activityId));
    }
}
