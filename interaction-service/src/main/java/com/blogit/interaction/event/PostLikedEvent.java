package com.blogit.interaction.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostLikedEvent {
    
    private UUID eventId;
    private String eventType;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime timestamp;
    
    private String version;
    private PostLikedEventData data;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostLikedEventData {
        private UUID postId;
        private UUID userId;
        private UUID postOwnerId;
        private UUID likeId;
    }
    
    public static PostLikedEvent create(UUID postId, UUID userId, UUID postOwnerId, UUID likeId) {
        return PostLikedEvent.builder()
                .eventId(UUID.randomUUID())
                .eventType("POST_LIKED")
                .timestamp(LocalDateTime.now())
                .version("1.0")
                .data(PostLikedEventData.builder()
                        .postId(postId)
                        .userId(userId)
                        .postOwnerId(postOwnerId)
                        .likeId(likeId)
                        .build())
                .build();
    }
}
