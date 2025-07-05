package com.blogit.interaction.controller;

import com.blogit.interaction.dto.*;
import com.blogit.interaction.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
@Tag(name = "Comments", description = "Operations for managing comments")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/posts/{postId}/comments")
    @Operation(summary = "Create comment", description = "Add a comment to a specific post")
    public ResponseEntity<ApiResponse<CommentDto>> createComment(
            @Parameter(description = "ID of the post to comment on") @PathVariable UUID postId,
            @Parameter(description = "ID of the user") @RequestHeader("X-User-ID") UUID userId,
            @Valid @RequestBody CreateCommentRequest request) {
        
        log.info("POST /api/v1/interactions/posts/{}/comments - User: {}", postId, userId);
        
        try {
            CommentDto comment = commentService.createComment(postId, userId, request);
            ApiResponse<CommentDto> response = ApiResponse.success(comment, "Comment created successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Failed to create comment for post {} by user {}: {}", postId, userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/posts/{postId}/comments")
    @Operation(summary = "Get post comments", description = "Retrieve all comments for a specific post with pagination and threading")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPostComments(
            @Parameter(description = "ID of the post") @PathVariable UUID postId,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort criteria") @RequestParam(defaultValue = "createdAt,desc") String sort,
            @Parameter(description = "Include nested replies") @RequestParam(defaultValue = "true") boolean includeReplies,
            @Parameter(description = "Maximum reply depth") @RequestParam(defaultValue = "3") int maxDepth) {
        
        log.info("GET /api/v1/interactions/posts/{}/comments - Page: {}, Size: {}, IncludeReplies: {}", 
                postId, page, size, includeReplies);
        
        Sort.Direction direction = sort.contains("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String property = sort.split(",")[0];
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, property));
        
        Page<CommentDto> comments = commentService.getCommentsForPost(postId, pageRequest, includeReplies);
        
        Map<String, Object> data = new HashMap<>();
        data.put("comments", comments.getContent());
        
        ApiResponse<Map<String, Object>> response = ApiResponse.success(
                data, 
                "Comments retrieved successfully", 
                PaginationDto.fromPage(comments)
        );
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/comments/{commentId}")
    @Operation(summary = "Update comment", description = "Update a specific comment (only by comment author)")
    public ResponseEntity<ApiResponse<CommentDto>> updateComment(
            @Parameter(description = "ID of the comment to update") @PathVariable UUID commentId,
            @Parameter(description = "ID of the user") @RequestHeader("X-User-ID") UUID userId,
            @Valid @RequestBody UpdateCommentRequest request) {
        
        log.info("PUT /api/v1/interactions/comments/{} - User: {}", commentId, userId);
        
        try {
            CommentDto comment = commentService.updateComment(commentId, userId, request);
            ApiResponse<CommentDto> response = ApiResponse.success(comment, "Comment updated successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Failed to update comment {} by user {}: {}", commentId, userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error updating comment {} by user {}: {}", commentId, userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/comments/{commentId}")
    @Operation(summary = "Delete comment", description = "Delete a specific comment (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @Parameter(description = "ID of the comment to delete") @PathVariable UUID commentId,
            @Parameter(description = "ID of the user") @RequestHeader("X-User-ID") UUID userId) {
        
        log.info("DELETE /api/v1/interactions/comments/{} - User: {}", commentId, userId);
        
        try {
            commentService.deleteComment(commentId, userId);
            ApiResponse<Void> response = ApiResponse.success(null, "Comment deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Failed to delete comment {} by user {}: {}", commentId, userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error deleting comment {} by user {}: {}", commentId, userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/comments/{commentId}/likes")
    @Operation(summary = "Like comment", description = "Add a like to a specific comment")
    public ResponseEntity<ApiResponse<CommentDto>> likeComment(
            @Parameter(description = "ID of the comment to like") @PathVariable UUID commentId,
            @Parameter(description = "ID of the user") @RequestHeader("X-User-ID") UUID userId) {
        
        log.info("POST /api/v1/interactions/comments/{}/likes - User: {}", commentId, userId);
        
        try {
            commentService.likeComment(commentId, userId);
            ApiResponse<CommentDto> response = ApiResponse.success(null, "Comment liked successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.warn("Failed to like comment {} by user {}: {}", commentId, userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/comments/{commentId}/likes")
    @Operation(summary = "Unlike comment", description = "Remove a like from a specific comment")
    public ResponseEntity<ApiResponse<Void>> unlikeComment(
            @Parameter(description = "ID of the comment to unlike") @PathVariable UUID commentId,
            @Parameter(description = "ID of the user") @RequestHeader("X-User-ID") UUID userId) {
        
        log.info("DELETE /api/v1/interactions/comments/{}/likes - User: {}", commentId, userId);
        
        try {
            commentService.unlikeComment(commentId, userId);
            ApiResponse<Void> response = ApiResponse.success(null, "Comment unliked successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error unliking comment {} by user {}: {}", commentId, userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/users/{userId}/comments")
    @Operation(summary = "Get user comments", description = "Retrieve comments made by a specific user")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserComments(
            @Parameter(description = "ID of the user") @PathVariable UUID userId,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        log.info("GET /api/v1/interactions/users/{}/comments - Page: {}, Size: {}", userId, page, size);
        
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<CommentDto> comments = commentService.getUserComments(userId, pageRequest);
        
        Map<String, Object> data = new HashMap<>();
        data.put("comments", comments.getContent());
        
        ApiResponse<Map<String, Object>> response = ApiResponse.success(
                data, 
                "User comments retrieved successfully", 
                PaginationDto.fromPage(comments)
        );
        
        return ResponseEntity.ok(response);
    }
}
