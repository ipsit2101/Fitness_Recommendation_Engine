package services;

import com.fitness.activityservice.ActivityRepository;
import dto.ActivityRequest;
import dto.ActivityResponse;
import model.Activity;
import model.ActivityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    public ActivityResponse trackActivity(ActivityRequest activityRequest) {
        Activity activity = Activity.builder()
                .userId(activityRequest.getUserId())
                .activityType(ActivityType.RUNNING)
                .duration(activityRequest.getDuration())
                .caloriesBurned(activityRequest.getCaloriesBurned())
                .startTime(activityRequest.getStartTime())
                .additionalMetrics(activityRequest.getAdditionalMetrics())
                .build();

        Activity savedaActivity = activityRepository.save(activity);

        return ActivityResponse.builder()
                .id(savedaActivity.getId())
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
}
