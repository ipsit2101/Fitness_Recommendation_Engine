package com.fitness.aiservice.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.models.Recommendation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.*;

@Service
@Slf4j
public class RedisCachingService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private ObjectMapper mapper;

    private final ExecutorService redisGuardExecutor = Executors.newFixedThreadPool(2);

    public <T> T get(String key, Class<T> targetType) {

        Future<Object> future = redisGuardExecutor.submit(() -> redisTemplate.opsForValue().get(key));
        try {
            Object cached = future.get(150, TimeUnit.MILLISECONDS); // HARD LIMIT
            return cached == null ? null : mapper.convertValue(cached, targetType);

        } catch (TimeoutException e) {
            log.warn("Redis GET timed out, treating as cache miss. key: {}", key);
            future.cancel(true);
            return null;

        } catch (Exception e) {
            log.warn("Redis GET failed, treating as cache miss. key: {}", key);
            return null;
        }
    }

    /* ===================== PUT ===================== */

    public void putAsync(String key, Recommendation value, Duration ttl) {
        redisGuardExecutor.submit(() -> {
            try {
                redisTemplate.opsForValue().set(key, value, ttl);
            } catch (Exception ex) {
                log.warn("Redis PUT failed in ai-service, skipping cache. key: {}", key);
            }
        });
    }

    /* ===================== EVICT ===================== */

    public void evictAsync(String key) {
        redisGuardExecutor.submit(() -> {
            try {
                redisTemplate.delete(key);
            } catch (Exception ex) {
                log.warn("Redis EVICT failed in ai-service, ignoring. key: {}", key);
            }
        });
    }
}
