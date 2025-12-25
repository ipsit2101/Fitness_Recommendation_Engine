package com.fitness.aiservice.config;

import com.fitness.aiservice.dto.DeleteActivityEvent;
import com.fitness.aiservice.models.Activity;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {

    // ---------------- RECEIVE ACTIVITY EVENT ----------------
    @Bean
    public ConsumerFactory<String, Activity> activityConsumerFactory(
            KafkaProperties kafkaProperties) {

        Map<String, Object> props = kafkaProperties.buildConsumerProperties();

        JsonDeserializer<Activity> deserializer =
                new JsonDeserializer<>(Activity.class, false);

        deserializer.addTrustedPackages("*");

        return new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                new ErrorHandlingDeserializer<>(deserializer)
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Activity>
    activityKafkaListenerContainerFactory(
            ConsumerFactory<String, Activity> activityConsumerFactory,
            DefaultErrorHandler errorHandler) {

        ConcurrentKafkaListenerContainerFactory<String, Activity> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(activityConsumerFactory);
        factory.setCommonErrorHandler(errorHandler);
        factory.getContainerProperties()
                .setAckMode(ContainerProperties.AckMode.RECORD);
        return factory;
    }

    // ---------------- DELETE EVENT ----------------
    @Bean
    public ConsumerFactory<String, DeleteActivityEvent>
    deleteActivityConsumerFactory(KafkaProperties kafkaProperties) {

        Map<String, Object> props = kafkaProperties.buildConsumerProperties();

        JsonDeserializer<DeleteActivityEvent> deserializer =
                new JsonDeserializer<>(DeleteActivityEvent.class, false);

        deserializer.addTrustedPackages("*");

        return new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                new ErrorHandlingDeserializer<>(deserializer)
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, DeleteActivityEvent>
    deleteActivityKafkaListenerContainerFactory(
            ConsumerFactory<String, DeleteActivityEvent> deleteActivityConsumerFactory,
            DefaultErrorHandler errorHandler) {

        ConcurrentKafkaListenerContainerFactory<String, DeleteActivityEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(deleteActivityConsumerFactory);
        factory.setCommonErrorHandler(errorHandler);
        factory.getContainerProperties()
                .setAckMode(ContainerProperties.AckMode.RECORD);

        return factory;
    }
}
