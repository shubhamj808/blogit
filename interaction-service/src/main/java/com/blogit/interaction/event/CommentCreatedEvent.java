package com.blogit.interaction.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreatedEvent {
    
    private UUID eventId;
    private String eventType;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime timestamp;
    
    private String version;
    private CommentCreatedEventData data;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentCreatedEventData {
        private UUID commentId;
        private UUID postId;
        private UUID userId;
        private UUID postOwnerId;
        private String content;
        private UUID parentCommentId;
        private List<UUID> mentionedUsers;
    }
    
    public static CommentCreatedEvent create(UUID commentId, UUID postId, UUID userId, 
                                           UUID postOwnerId, String content, UUID parentCommentId, 
                                           List<UUID> mentionedUsers) {
        return CommentCreatedEvent.builder()
                .eventId(UUID.randomUUID())
                .eventType("COMMENT_CREATED")
                .timestamp(LocalDateTime.now())
                .version("1.0")
                .data(CommentCreatedEventData.builder()
                        .commentId(commentId)
                        .postId(postId)
                        .userId(userId)
                        .postOwnerId(postOwnerId)
                        .content(content)
                        .parentCommentId(parentCommentId)
                        .mentionedUsers(mentionedUsers)
                        .build())
                .build();
    }
}
