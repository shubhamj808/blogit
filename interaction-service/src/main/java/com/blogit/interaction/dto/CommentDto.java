package com.blogit.interaction.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    
    private UUID id;
    private UUID postId;
    private UUID parentCommentId;
    private String content;
    private Long likeCount;
    private Long replyCount;
    private Boolean isLikedByUser;
    private Boolean isActive;
    private Boolean isEdited;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime updatedAt;
    
    private UserAuthorDto author;
    
    @Builder.Default
    private List<CommentDto> replies = new ArrayList<>();
}
