package com.fitness.activityservice.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@Slf4j
public class RedisCachingService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private CircuitBreakerFactory<?, ?> circuitBreakerFactory;

    public Object get(String key) {
        try {
            return circuitBreakerFactory
                    .create("redisCB")
                    .run(() -> redisTemplate.opsForValue().get(key));
        } catch (Exception ex) {
            log.warn("Redis GET skipped (Circuit-Breaker open or Redis down) for key: {}", key);
            return null; // cache miss
        }
    }

    public void put(String key, Object value, Duration ttl) {
        try {
            circuitBreakerFactory
                    .create("redisCB")
                    .run(() -> {
                        redisTemplate.opsForValue().set(key, value, ttl);
                        return null;
                    });
        } catch (Exception ex) {
            log.warn("Redis PUT skipped (Circuit-Breaker open or Redis down) for key: {}", key);
        }
    }

    public void evict(String key) {
        try {
            circuitBreakerFactory
                    .create("redisCB")
                    .run(() -> {
                        redisTemplate.delete(key);
                        return null;
                    });
        } catch (Exception ex) {
            log.warn("Redis EVICT skipped (Circuit-Breaker open or Redis down) for key: {}", key);
        }
    }
}
