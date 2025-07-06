package com.blogit.common.kafka;

import com.blogit.common.event.DomainEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventPublisher {
    
    private final KafkaTemplate<String, DomainEvent<?>> kafkaTemplate;
    
    public <T> void publish(String topic, DomainEvent<T> event) {
        CompletableFuture<SendResult<String, DomainEvent<?>>> future = kafkaTemplate.send(topic, event);
        
        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.debug("Event published successfully: type={}, id={}, topic={}",
                        event.getEventType(), event.getEventId(), topic);
            } else {
                log.error("Failed to publish event: type={}, id={}, topic={}",
                        event.getEventType(), event.getEventId(), topic, ex);
            }
        });
    }
} 