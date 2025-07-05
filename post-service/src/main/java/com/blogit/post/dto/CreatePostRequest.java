package com.blogit.post.dto;

import com.blogit.post.entity.Post;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class CreatePostRequest {
    
    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 500, message = "Title must be between 1 and 500 characters")
    private String title;
    
    @NotBlank(message = "Content is required")
    @Size(min = 1, max = 5000, message = "Content must be between 1 and 5000 characters")
    private String content;
    
    private Post.PostVisibility visibility = Post.PostVisibility.PUBLIC;
    
    private Set<String> hashtags;
    
    private Set<String> mediaUrls;
}
