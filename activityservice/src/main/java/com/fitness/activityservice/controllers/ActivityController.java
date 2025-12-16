package com.fitness.activityservice.controllers;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fitness.activityservice.services.ActivityService;

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

    @GetMapping("/test")
    public String test() {
        return "OK";
    }

}
