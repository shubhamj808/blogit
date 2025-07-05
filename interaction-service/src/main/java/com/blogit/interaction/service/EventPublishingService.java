package com.blogit.interaction.service;

import com.blogit.interaction.event.CommentCreatedEvent;
import com.blogit.interaction.event.PostLikedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventPublishingService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String POST_INTERACTION_TOPIC = "post-interaction-events";
    private static final String COMMENT_INTERACTION_TOPIC = "comment-interaction-events";

    public void publishPostLikedEvent(PostLikedEvent event) {
        try {
            log.debug("Publishing PostLikedEvent: {}", event);
            
            CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(
                    POST_INTERACTION_TOPIC, 
                    event.getData().getPostId().toString(), 
                    event
            );
            
            future.whenComplete((result, exception) -> {
                if (exception == null) {
                    log.info("Successfully published PostLikedEvent for post: {} by user: {}", 
                            event.getData().getPostId(), event.getData().getUserId());
                } else {
                    log.error("Failed to publish PostLikedEvent for post: {} by user: {}", 
                            event.getData().getPostId(), event.getData().getUserId(), exception);
                }
            });
        } catch (Exception e) {
            log.error("Error publishing PostLikedEvent: {}", event, e);
        }
    }

    public void publishCommentCreatedEvent(CommentCreatedEvent event) {
        try {
            log.debug("Publishing CommentCreatedEvent: {}", event);
            
            CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(
                    COMMENT_INTERACTION_TOPIC, 
                    event.getData().getPostId().toString(), 
                    event
            );
            
            future.whenComplete((result, exception) -> {
                if (exception == null) {
                    log.info("Successfully published CommentCreatedEvent for comment: {} on post: {}", 
                            event.getData().getCommentId(), event.getData().getPostId());
                } else {
                    log.error("Failed to publish CommentCreatedEvent for comment: {} on post: {}", 
                            event.getData().getCommentId(), event.getData().getPostId(), exception);
                }
            });
        } catch (Exception e) {
            log.error("Error publishing CommentCreatedEvent: {}", event, e);
        }
    }
}
