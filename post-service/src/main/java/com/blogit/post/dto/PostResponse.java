package com.blogit.post.dto;

import com.blogit.post.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    
    private UUID id;
    private UUID userId;
    private String title;
    private String content;
    private Post.PostVisibility visibility;
    private Set<String> hashtags;
    private Set<String> mediaUrls;
    private Long likesCount;
    private Long commentsCount;
    private Long sharesCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static PostResponse fromEntity(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .userId(post.getUserId())
                .title(post.getTitle())
                .content(post.getContent())
                .visibility(post.getVisibility())
                .hashtags(post.getHashtags())
                .mediaUrls(post.getMediaUrls())
                .likesCount(post.getLikesCount())
                .commentsCount(post.getCommentsCount())
                .sharesCount(post.getSharesCount())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
