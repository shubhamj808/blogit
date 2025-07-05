package com.blogit.post.controller;

import com.blogit.post.dto.CreatePostRequest;
import com.blogit.post.dto.PostResponse;
import com.blogit.post.dto.UpdatePostRequest;
import com.blogit.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    
    private final PostService postService;

    @PostMapping
    public PostResponse createPost(@RequestHeader("X-User-Id") Long userId, @Valid @RequestBody CreatePostRequest request) {
        return postService.createPost(userId, request);
    }
    
    @GetMapping("/{postId}")
    public PostResponse getPost(@PathVariable Long postId) {
        return postService.getPost(postId);
    }
    
    @GetMapping
    public Page<PostResponse> getUserPosts(@RequestHeader("X-User-Id") Long userId, 
                                           @RequestParam(defaultValue = "0") int page, 
                                           @RequestParam(defaultValue = "10") int size) {
        return postService.getUserPosts(userId, page, size);
    }
    
    @PutMapping("/{postId}")
    public PostResponse updatePost(@PathVariable Long postId, @RequestHeader("X-User-Id") Long userId, 
                                   @Valid @RequestBody UpdatePostRequest request) {
        return postService.updatePost(postId, userId, request);
    }

    @DeleteMapping("/{postId}")
    public void deletePost(@PathVariable Long postId, @RequestHeader("X-User-Id") Long userId) {
        postService.deletePost(postId, userId);
    }
}
