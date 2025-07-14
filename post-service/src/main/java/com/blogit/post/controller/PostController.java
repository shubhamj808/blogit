package com.blogit.post.controller;

import com.blogit.post.dto.CreatePostRequest;
import com.blogit.post.dto.PostResponse;
import com.blogit.post.dto.UpdatePostRequest;
import com.blogit.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.UUID;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {
    
    private final PostService postService;

    @PostMapping
    public PostResponse createPost(@RequestHeader("X-User-Id") UUID userId, @Valid @RequestBody CreatePostRequest request) {
        return postService.createPost(userId, request);
    }
    
    @GetMapping("/{postId}")
    public PostResponse getPost(@PathVariable UUID postId) {
        return postService.getPost(postId);
    }
    
    @GetMapping
    public Page<PostResponse> getUserPosts(@RequestHeader("X-User-Id") UUID userId, 
                                           @RequestParam(defaultValue = "0") int page, 
                                           @RequestParam(defaultValue = "10") int size) {
        return postService.getUserPosts(userId, page, size);
    }
    
    @GetMapping("/feed")
    public Page<PostResponse> getFeed(@RequestHeader("X-User-Id") UUID userId, 
                                        @RequestParam(defaultValue = "0") int page, 
                                        @RequestParam(defaultValue = "10") int size) {
        return postService.getFeed(userId, page, size);
    }
    
    @GetMapping("/test")
    public String testEndpoint() {
        return "Post service is working!";
    }
    
    @PutMapping("/{postId}")
    public PostResponse updatePost(@PathVariable UUID postId, @RequestHeader("X-User-Id") UUID userId, 
                                   @Valid @RequestBody UpdatePostRequest request) {
        return postService.updatePost(postId, userId, request);
    }

    @DeleteMapping("/{postId}")
    public void deletePost(@PathVariable UUID postId, @RequestHeader("X-User-Id") UUID userId) {
        postService.deletePost(postId, userId);
    }
}
