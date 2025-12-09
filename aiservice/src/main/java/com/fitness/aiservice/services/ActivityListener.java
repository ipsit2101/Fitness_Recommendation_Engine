package com.fitness.aiservice.services;

import com.fitness.aiservice.models.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityListener {

    @KafkaListener(topics = "${kafka.topic.name}", groupId = "${spring.kafka.consumer.group-id}")
    public void processActivityMessage(Activity activity) {
        log.info("Received Activity for processing for the user: {} -> {}", activity.getUserId(), activity);
    }
}
