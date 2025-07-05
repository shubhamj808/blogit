package com.blogit.interaction.controller;

import com.blogit.interaction.dto.*;
import com.blogit.interaction.service.LikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interactions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Post Likes", description = "Operations for managing post likes")
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/posts/{postId}/likes")
    @Operation(summary = "Like a post", description = "Add a like to a specific post")
    public ResponseEntity<ApiResponse<LikeDto>> likePost(
            @Parameter(description = "ID of the post to like") @PathVariable UUID postId,
            @Parameter(description = "ID of the user") @RequestHeader("X-User-ID") UUID userId) {
        
        log.info("POST /api/v1/interactions/posts/{}/likes - User: {}", postId, userId);
        
        try {
            LikeDto like = likeService.likePost(postId, userId);
            ApiResponse<LikeDto> response = ApiResponse.success(like, "Post liked successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.warn("Failed to like post {} by user {}: {}", postId, userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/posts/{postId}/likes")
    @Operation(summary = "Unlike a post", description = "Remove a like from a specific post")
    public ResponseEntity<ApiResponse<Void>> unlikePost(
            @Parameter(description = "ID of the post to unlike") @PathVariable UUID postId,
            @Parameter(description = "ID of the user") @RequestHeader("X-User-ID") UUID userId) {
        
        log.info("DELETE /api/v1/interactions/posts/{}/likes - User: {}", postId, userId);
        
        try {
            likeService.unlikePost(postId, userId);
            ApiResponse<Void> response = ApiResponse.success(null, "Post unliked successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Failed to unlike post {} by user {}: {}", postId, userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/posts/{postId}/likes")
    @Operation(summary = "Get post likes", description = "Retrieve all likes for a specific post with pagination")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPostLikes(
            @Parameter(description = "ID of the post") @PathVariable UUID postId,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort criteria") @RequestParam(defaultValue = "createdAt,desc") String sort) {
        
        log.info("GET /api/v1/interactions/posts/{}/likes - Page: {}, Size: {}", postId, page, size);
        
        Sort.Direction direction = sort.contains("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String property = sort.split(",")[0];
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, property));
        
        Page<LikeDto> likes = likeService.getPostLikes(postId, pageRequest);
        long totalLikes = likeService.getPostLikeCount(postId);
        
        Map<String, Object> data = new HashMap<>();
        data.put("likes", likes.getContent());
        data.put("totalLikes", totalLikes);
        
        ApiResponse<Map<String, Object>> response = ApiResponse.success(
                data, 
                "Post likes retrieved successfully", 
                PaginationDto.fromPage(likes)
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/posts/{postId}/likes/check")
    @Operation(summary = "Check user like status", description = "Check if the current user has liked a specific post")
    public ResponseEntity<ApiResponse<LikeStatusDto>> checkUserLikeStatus(
            @Parameter(description = "ID of the post") @PathVariable UUID postId,
            @Parameter(description = "ID of the user") @RequestHeader("X-User-ID") UUID userId) {
        
        log.info("GET /api/v1/interactions/posts/{}/likes/check - User: {}", postId, userId);
        
        LikeStatusDto likeStatus = likeService.checkUserLikeStatus(postId, userId);
        ApiResponse<LikeStatusDto> response = ApiResponse.success(likeStatus);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/posts/likes/bulk-check")
    @Operation(summary = "Bulk like status check", description = "Check like status for multiple posts at once")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkCheckLikeStatus(
            @Parameter(description = "ID of the user") @RequestHeader("X-User-ID") UUID userId,
            @Valid @RequestBody BulkLikeCheckRequest request) {
        
        log.info("POST /api/v1/interactions/posts/likes/bulk-check - User: {}, Posts: {}", 
                userId, request.getPostIds().size());
        
        Map<UUID, LikeStatusDto> likeStatuses = likeService.bulkCheckUserLikeStatus(request.getPostIds(), userId);
        
        Map<String, Object> data = new HashMap<>();
        data.put("likeStatuses", likeStatuses);
        
        ApiResponse<Map<String, Object>> response = ApiResponse.success(
                data, 
                "Bulk like status check completed successfully"
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}/likes")
    @Operation(summary = "Get user likes", description = "Retrieve all posts liked by a specific user")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserLikes(
            @Parameter(description = "ID of the user") @PathVariable UUID userId,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        log.info("GET /api/v1/interactions/users/{}/likes - Page: {}, Size: {}", userId, page, size);
        
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<LikeDto> likes = likeService.getUserLikes(userId, pageRequest);
        
        Map<String, Object> data = new HashMap<>();
        data.put("likes", likes.getContent());
        
        ApiResponse<Map<String, Object>> response = ApiResponse.success(
                data, 
                "User likes retrieved successfully", 
                PaginationDto.fromPage(likes)
        );
        
        return ResponseEntity.ok(response);
    }
}
