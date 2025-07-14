package com.blogit.interaction.service.consumer;

import com.blogit.common.event.DomainEvent;
import com.blogit.common.event.post.PostCreatedEvent;
import com.blogit.common.event.post.PostUpdatedEvent;
import com.blogit.common.event.post.PostDeletedEvent;
import com.blogit.common.kafka.KafkaConfig;
import com.blogit.interaction.service.CommentService;
import com.blogit.interaction.service.LikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class PostEventConsumer {

    private final LikeService likeService;
    private final CommentService commentService;

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
            case PostUpdatedEvent.EVENT_TYPE:
                handlePostUpdated((PostUpdatedEvent) event);
                break;
            case PostDeletedEvent.EVENT_TYPE:
                handlePostDeleted((PostDeletedEvent) event);
                break;
            default:
                log.warn("Unhandled post event type: {}", event.getEventType());
        }
    }
    
    private void handlePostCreated(PostCreatedEvent event) {
        var postData = event.getData();
        log.info("Post created: {}", postData.getPostId());
        // Initialize interaction data if needed
    }

    private void handlePostUpdated(PostUpdatedEvent event) {
        var postData = event.getData();
        log.info("Post updated: {}", postData.getPostId());
        
        if (!postData.isActive()) {
            // If post is deactivated, hide all interactions
            UUID postId = UUID.fromString(postData.getPostId());
            likeService.cleanupPostLikes(postId);
            commentService.softDeletePostComments(postId);
        }
    }

    private void handlePostDeleted(PostDeletedEvent event) {
        var postData = event.getData();
        log.info("Post deleted: {}", postData.getPostId());
        
        // Clean up all interactions for the deleted post
        UUID postId = UUID.fromString(postData.getPostId());
        likeService.cleanupPostLikes(postId);
        commentService.softDeletePostComments(postId);
    }
} 