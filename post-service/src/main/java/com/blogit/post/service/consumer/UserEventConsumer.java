package com.blogit.post.service.consumer;

import com.blogit.common.event.DomainEvent;
import com.blogit.common.event.user.UserRegisteredEvent;
import com.blogit.common.kafka.KafkaConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserEventConsumer {

    @KafkaListener(
        topics = KafkaConfig.TOPIC_USER_EVENTS,
        groupId = "${spring.application.name}",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleUserEvent(DomainEvent<?> event) {
        log.info("Received user event: {}", event.getEventType());
        
        // Add null safety check for eventType
        if (event == null) {
            log.error("Received null event");
            return;
        }
        
        String eventType = event.getEventType();
        if (eventType == null) {
            log.error("Received event with null eventType: {}", event);
            return;
        }
        
        switch (eventType) {
            case UserRegisteredEvent.EVENT_TYPE:
                handleUserRegistered((UserRegisteredEvent) event);
                break;
            default:
                log.warn("Unhandled user event type: {}", eventType);
        }
    }
    
    private void handleUserRegistered(UserRegisteredEvent event) {
        if (event == null) {
            log.error("Received null UserRegisteredEvent");
            return;
        }
        
        var userData = event.getData();
        if (userData == null) {
            log.error("Received UserRegisteredEvent with null data: {}", event);
            return;
        }
        
        log.info("User registered: {}", userData.getUserId());
        // Here you can add any post-service specific logic for new users
        // For example, creating default posts, setting up user preferences, etc.
    }
} 