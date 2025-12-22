package com.fitness.aiservice.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.models.Activity;
import com.fitness.aiservice.models.Recommendation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

@Service
@Slf4j
public class ActivityResponseProcessingService {

    @Autowired
    private GoogleGeminiApiClient googleGeminiApiClient;

    public Recommendation generateRecommendation(Activity activity) {

        String prompt = createActivityPrompt((activity));
        ResponseEntity<String> response = googleGeminiApiClient.getApiResponse(prompt);
        if (response != null) {
            String responseFromGemini = response.getBody();
            log.info("RESPONSE FROM GEMINI: {}", responseFromGemini);
            return processedRecommendation(activity, responseFromGemini);
        }
        return null;
    }

    private Recommendation processedRecommendation(Activity activity, String responseFromGemini) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(responseFromGemini);
            JsonNode textNode = rootNode
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String aiJsonContent = textNode.asText()
                    .replaceAll("```json\\n", "")
                    .replaceAll("\\n```", "")
                    .trim();
            log.info("Cleaned content: {}", aiJsonContent);

            JsonNode contentNode = mapper.readTree(aiJsonContent);

            String analysis = extractAnalysis(contentNode.path("analysis"));
            List<String> improvements = extractImprovements(contentNode.path("improvements"));
            List<String> suggestions = extractSuggestions(contentNode.path("suggestions"));
            List<String> safetyInstructions = extractSafetyInstructions(contentNode.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .duration(activity.getDuration())
                    .caloriesBurned(activity.getCaloriesBurned())
                    .activityType(activity.getActivityType().toString())
                    .metrics(activity.getAdditionalMetrics())
                    .analysis(analysis)
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safetyInstructions(safetyInstructions)
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error(e.toString());
            return Recommendation.builder()
                    .activityId(activity.getId())
                    .activityType(activity.getActivityType().toString())
                    .userId(activity.getUserId())
                    .metrics(new HashMap<>())
                    .analysis("Not able to generate detailed analysis")
                    .improvements(Collections.singletonList("No improvements in this scope"))
                    .suggestions(Collections.singletonList("Continue with your current plan"))
                    .safetyInstructions(Collections.singletonList("Consider consulting a fitness counsellor"))
                    .createdAt(LocalDateTime.now())
                    .build();
        }
    }

    private String extractAnalysis(JsonNode analysisNode) {

        StringBuilder analysisBuilder = new StringBuilder();
        if (!analysisNode.path("overall").isMissingNode()) {
            analysisBuilder.append("Overall: ")
                    .append(analysisNode.path("overall").asText())
                    .append("\n\n");
        }
        if (!analysisNode.path("pace").isMissingNode()) {
            analysisBuilder.append("Pace: ")
                    .append(analysisNode.path("pace").asText())
                    .append("\n\n");
        }
        if (!analysisNode.path("heartRate").isMissingNode()) {
            analysisBuilder.append("Heart Rate: ")
                    .append(analysisNode.path("heartRate").asText())
                    .append("\n\n");
        }
        if (!analysisNode.path("caloriesBurned").isMissingNode()) {
            analysisBuilder.append("Calories Burned: ")
                    .append(analysisNode.path("caloriesBurned").asText())
                    .append("\n\n");
        }
        return analysisBuilder.toString();
    }

    private List<String> extractImprovements(JsonNode impNode) {

        List<String> improvements = new ArrayList<>();
        if (impNode.isArray()) {
            impNode.forEach(node -> {
                String area = node.path("area").asText();
                String recommendation = node.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, recommendation));
            });
        }
        return improvements.isEmpty()
                ? Collections.singletonList("No improvements as needed")
                : improvements;
    }

    private List<String> extractSuggestions(JsonNode suggestionNode) {
        List<String> suggestions = new ArrayList<>();
        if (suggestionNode.isArray()) {
            suggestionNode.forEach(node -> {
                String workout = node.path("workout").asText();
                String description = node.path("description").asText();
                suggestions.add(String.format("%s: %s", workout, description));
            });
        }
        return suggestions.isEmpty()
                ? Collections.singletonList("No suggestions as needed")
                : suggestions;
    }

    private List<String> extractSafetyInstructions(JsonNode s_node) {
        List<String> safetyInstructions = new ArrayList<>();
        if (s_node.isArray()) {
            s_node.forEach(node -> safetyInstructions.add(node.asText()));
        }
        return safetyInstructions.isEmpty()
                ? Collections.singletonList("No safety instructions needed in this case.\n" +
                "                    Always follow general purpose guidelines.")
                : safetyInstructions;
    }

    private String createActivityPrompt(Activity activity) {
        return String.format("""
            Analyze this fitness activity and additional metrics being provided based on locations. Provide detailed recommendations in the following EXACT JSON format:
            {
              "analysis": {
                "overall": "Overall analysis here",
                "pace": "Pace analysis here",
                "heartRate": "Heart rate analysis here",
                "caloriesBurned": "Calories analysis here"
              },
              "improvements": [
                {
                  "area": "Area name",
                  "recommendation": "Detailed recommendation"
                }
              ],
              "suggestions": [
                {
                  "workout": "Workout name",
                  "description": "Detailed workout description"
                }
              ],
              "safety": [
                "Safety point 1",
                "Safety point 2"
              ]
            }
    
            Analyze this activity:
            Activity Type: %s
            Duration: %d minutes
            Calories Burned: %d
            Additional Metrics: %s
            
            Distance(if present) : in km
            Average heart rate(if present) : in bpm
            Weight(if present) : in kg
            Height(if present) : in cm
            
            Provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines.
            Ensure the response follows the EXACT JSON format shown above.
            """,
                    activity.getActivityType(),
                    activity.getDuration(),
                    activity.getCaloriesBurned(),
                    activity.getAdditionalMetrics()
        );
    }
}
