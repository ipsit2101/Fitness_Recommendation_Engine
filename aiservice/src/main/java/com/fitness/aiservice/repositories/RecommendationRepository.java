package com.fitness.aiservice.repositories;

import com.fitness.aiservice.models.Recommendation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RecommendationRepository extends MongoRepository<Recommendation, String> {

    List<Recommendation> findRecommendationByUserId(String userId);

    Optional<Recommendation> findRecommendationByActivityId(String activityId);
}
