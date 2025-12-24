package com.fitness.activityservice.controllers;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fitness.activityservice.services.ActivityService;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(@RequestBody ActivityRequest activityRequest
    , @RequestHeader("X-User-ID") String userId) {
        activityRequest.setUserId(userId);
        return ResponseEntity.ok(activityService.trackActivity(activityRequest));
    }

    @GetMapping("/user")
    public ResponseEntity<List<ActivityResponse>> getActivities(@RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }

    @DeleteMapping("/delete/{activityId}")
    public ResponseEntity<Void> deleteActivity(@PathVariable String activityId, @RequestHeader("X-User-ID") String userId) throws AccessDeniedException {
        activityService.deleteActivity(activityId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/test")
    public String test() {
        return "OK";
    }

}
