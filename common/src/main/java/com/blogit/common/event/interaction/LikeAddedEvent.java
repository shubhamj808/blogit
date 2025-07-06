package com.blogit.common.event.interaction;

import com.blogit.common.event.BaseEvent;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LikeAddedEvent extends BaseEvent<LikeAddedEvent.LikeAddedData> {
    
    public static final String EVENT_TYPE = "LIKE_ADDED";
    
    public LikeAddedEvent(LikeAddedData data) {
        super(EVENT_TYPE);
        this.setData(data);
    }
    
    @Data
    @NoArgsConstructor
    public static class LikeAddedData {
        private String likeId;
        private String userId;
        private String targetId;  // postId or commentId
        private String targetType;  // "POST" or "COMMENT"
        private LocalDateTime createdAt;
    }
} 