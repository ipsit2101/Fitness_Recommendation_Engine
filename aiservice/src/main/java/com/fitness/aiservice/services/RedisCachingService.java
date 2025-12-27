package com.fitness.aiservice.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.models.Recommendation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@Slf4j
public class RedisCachingService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private final ObjectMapper mapper = new ObjectMapper();

    public <T> T get(String key, Class<T> targetType) {
        try {
            Object cached = redisTemplate.opsForValue().get(key);
            return mapper.convertValue(cached, targetType);
        } catch (Exception ex) {
            log.warn("Redis GET failed in ai-service, treating as cache miss. key: {}", key);
            return null;
        }
    }

    /* ===================== PUT ===================== */

    public void put(String key, Recommendation value, Duration ttl) {
        try {
            redisTemplate.opsForValue().set(key, value, ttl);
        } catch (Exception ex) {
            log.warn("Redis PUT failed in ai-service, skipping cache. key: {}", key);
        }
    }

    /* ===================== EVICT ===================== */

    public void evict(String key) {
        try {
            redisTemplate.delete(key);
        } catch (Exception ex) {
            log.warn("Redis EVICT failed in ai-service, ignoring. key: {}", key);
        }
    }
}
