package com.blogit.user.service;

import com.blogit.common.event.DomainEvent;
import com.blogit.common.event.user.UserRegisteredEvent;
import com.blogit.common.event.user.UserUpdatedEvent;
import com.blogit.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventPublishingService {
    
    private final KafkaTemplate<String, DomainEvent<?>> kafkaTemplate;
    private static final String USER_EVENTS_TOPIC = "user-events";
    
    public void publishUserRegistered(User user) {
        try {
            UserRegisteredEvent.UserRegisteredData eventData = new UserRegisteredEvent.UserRegisteredData();
            eventData.setUserId(user.getId().toString());
            eventData.setUsername(user.getUsername());
            eventData.setEmail(user.getEmail());
            eventData.setFullName(user.getFullName());
            eventData.setVerified(user.isVerified());
            
            UserRegisteredEvent event = new UserRegisteredEvent(eventData);
            
            kafkaTemplate.send(USER_EVENTS_TOPIC, user.getId().toString(), event)
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            log.info("Successfully published UserRegisteredEvent for user: {}", user.getId());
                        } else {
                            log.error("Failed to publish UserRegisteredEvent for user: {}", user.getId(), ex);
                        }
                    });
        } catch (Exception e) {
            log.error("Error publishing UserRegisteredEvent for user: {}", user.getId(), e);
        }
    }

    public void publishUserUpdated(User user) {
        try {
            UserUpdatedEvent.UserUpdatedData eventData = new UserUpdatedEvent.UserUpdatedData();
            eventData.setUserId(user.getId().toString());
            eventData.setUsername(user.getUsername());
            eventData.setEmail(user.getEmail());
            eventData.setFullName(user.getFullName());
            eventData.setProfileImage(user.getProfileImage());
            eventData.setVerified(user.isVerified());
            eventData.setActive(user.isActive());
            
            UserUpdatedEvent event = new UserUpdatedEvent(eventData);
            
            kafkaTemplate.send(USER_EVENTS_TOPIC, user.getId().toString(), event)
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            log.info("Successfully published UserUpdatedEvent for user: {}", user.getId());
                        } else {
                            log.error("Failed to publish UserUpdatedEvent for user: {}", user.getId(), ex);
                        }
                    });
        } catch (Exception e) {
            log.error("Error publishing UserUpdatedEvent for user: {}", user.getId(), e);
        }
    }
} 