package com.blogit.post.service;

import com.blogit.common.event.post.PostCreatedEvent;
import com.blogit.common.event.post.PostUpdatedEvent;
import com.blogit.common.event.post.PostDeletedEvent;
import com.blogit.post.entity.Post;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventPublishingService {
    
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String POST_EVENTS_TOPIC = "post-events";
    
    public void publishPostCreated(Post post) {
        try {
            PostCreatedEvent.PostCreatedData eventData = new PostCreatedEvent.PostCreatedData();
            eventData.setPostId(post.getId().toString());
            eventData.setUserId(post.getUserId().toString());
            eventData.setTitle(post.getTitle());
            eventData.setContent(post.getContent());
            eventData.setTags(new ArrayList<>(post.getHashtags()));
            eventData.setDraft(false);
            eventData.setCreatedAt(post.getCreatedAt());

            PostCreatedEvent event = PostCreatedEvent.builder()
                    .eventId(UUID.randomUUID())  // Add this
                    .eventType("POST_CREATED")              // Add this
                    .version("1.0")                         // Add this
                    .timestamp(LocalDateTime.now())         // Add this
                    .data(eventData)
                    .data(eventData)
                    .build();

            kafkaTemplate.send(POST_EVENTS_TOPIC, post.getId().toString(), event)
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            log.info("Successfully published PostCreatedEvent for post: {}", post.getId());
                        } else {
                            log.error("Failed to publish PostCreatedEvent for post: {}", post.getId(), ex);
                        }
                    });
        } catch (Exception e) {
            log.error("Error publishing PostCreatedEvent for post: {}", post.getId(), e);
        }
    }

    public void publishPostUpdated(Post post) {
        try {
            PostUpdatedEvent.PostUpdatedData eventData = new PostUpdatedEvent.PostUpdatedData();
            eventData.setPostId(post.getId().toString());
            eventData.setUserId(post.getUserId().toString());
            eventData.setTitle(post.getTitle());
            eventData.setContent(post.getContent());
            eventData.setTags(new ArrayList<>(post.getHashtags()));
            eventData.setActive(post.getIsActive());
            eventData.setUpdatedAt(LocalDateTime.now());
            
            PostUpdatedEvent event = PostUpdatedEvent.builder()
                    .data(eventData)
                    .build();
            
            kafkaTemplate.send(POST_EVENTS_TOPIC, post.getId().toString(), event)
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            log.info("Successfully published PostUpdatedEvent for post: {}", post.getId());
                        } else {
                            log.error("Failed to publish PostUpdatedEvent for post: {}", post.getId(), ex);
                        }
                    });
        } catch (Exception e) {
            log.error("Error publishing PostUpdatedEvent for post: {}", post.getId(), e);
        }
    }

    public void publishPostDeleted(Post post) {
        try {
            PostDeletedEvent.PostDeletedData eventData = new PostDeletedEvent.PostDeletedData();
            eventData.setPostId(post.getId().toString());
            eventData.setUserId(post.getUserId().toString());
            eventData.setDeletedAt(LocalDateTime.now());
            
            PostDeletedEvent event = PostDeletedEvent.builder()
                    .data(eventData)
                    .build();
            
            kafkaTemplate.send(POST_EVENTS_TOPIC, post.getId().toString(), event)
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            log.info("Successfully published PostDeletedEvent for post: {}", post.getId());
                        } else {
                            log.error("Failed to publish PostDeletedEvent for post: {}", post.getId(), ex);
                        }
                    });
        } catch (Exception e) {
            log.error("Error publishing PostDeletedEvent for post: {}", post.getId(), e);
        }
    }
} 