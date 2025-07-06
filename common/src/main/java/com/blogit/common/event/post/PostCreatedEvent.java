package com.blogit.common.event.post;

import com.blogit.common.event.BaseEvent;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PostCreatedEvent extends BaseEvent<PostCreatedEvent.PostCreatedData> {
    
    public static final String EVENT_TYPE = "POST_CREATED";
    
    public PostCreatedEvent(PostCreatedData data) {
        super(EVENT_TYPE);
        this.setData(data);
    }
    
    @Data
    @NoArgsConstructor
    public static class PostCreatedData {
        private String postId;
        private String userId;
        private String title;
        private String content;
        private List<String> tags;
        private boolean isDraft;
        private LocalDateTime createdAt;
    }
} 