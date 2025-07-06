package com.blogit.interaction.service.consumer;

import com.blogit.common.event.DomainEvent;
import com.blogit.common.event.post.PostCreatedEvent;
import com.blogit.common.kafka.KafkaConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PostEventConsumer {

    @KafkaListener(
        topics = KafkaConfig.TOPIC_POST_EVENTS,
        groupId = "${spring.application.name}",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void handlePostEvent(DomainEvent<?> event) {
        log.info("Received post event: {}", event.getEventType());
        
        switch (event.getEventType()) {
            case PostCreatedEvent.EVENT_TYPE:
                handlePostCreated((PostCreatedEvent) event);
                break;
            default:
                log.warn("Unhandled post event type: {}", event.getEventType());
        }
    }
    
    private void handlePostCreated(PostCreatedEvent event) {
        var postData = event.getData();
        log.info("Post created: {}", postData.getPostId());
        // Here you can add any interaction-service specific logic for new posts
        // For example, initializing like counters, preparing comment sections, etc.
    }
} 