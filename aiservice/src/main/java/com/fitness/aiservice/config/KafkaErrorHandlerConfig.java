package com.fitness.aiservice.config;

import org.apache.kafka.common.errors.SerializationException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.serializer.DeserializationException;
import org.springframework.util.backoff.ExponentialBackOff;

@Configuration
public class KafkaErrorHandlerConfig {

    @Bean
    public DefaultErrorHandler kafkaErrorHandler(KafkaTemplate<Object, Object> kafkaTemplate) {

        ExponentialBackOff backOff = new ExponentialBackOff();
        backOff.setInitialInterval(1000);   // 1 sec
        backOff.setMultiplier(2.0);         // 2x
        backOff.setMaxInterval(10000);      // max 10 sec

        DeadLetterPublishingRecoverer recoverer =
                new DeadLetterPublishingRecoverer(kafkaTemplate);

        DefaultErrorHandler handler =
                new DefaultErrorHandler(recoverer, backOff);

        // Do NOT retry poison messages
        handler.addNotRetryableExceptions(
                DeserializationException.class,
                SerializationException.class,
                IllegalArgumentException.class
        );
        return handler;
    }
}
