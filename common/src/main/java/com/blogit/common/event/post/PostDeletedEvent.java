package com.blogit.common.event.post;

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
public class PostDeletedEvent extends BaseEvent<PostDeletedEvent.PostDeletedData> {
    
    public static final String EVENT_TYPE = "POST_DELETED";
    
    public PostDeletedEvent(PostDeletedData data) {
        super(EVENT_TYPE);
        this.setData(data);
    }
    
    @Data
    @NoArgsConstructor
    public static class PostDeletedData {
        private String postId;
        private String userId;
        private LocalDateTime deletedAt;
    }
} 