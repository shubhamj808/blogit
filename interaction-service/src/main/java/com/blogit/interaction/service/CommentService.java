package com.blogit.interaction.service;

import com.blogit.interaction.dto.*;
import com.blogit.interaction.entity.Comment;
import com.blogit.interaction.entity.CommentLike;
import com.blogit.interaction.event.CommentCreatedEvent;
import com.blogit.interaction.repository.CommentLikeRepository;
import com.blogit.interaction.repository.CommentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final EventPublishingService eventPublishingService;

    public Page<CommentDto> getCommentsForPost(UUID postId, Pageable pageable, boolean includeReplies) {
        Page<Comment> comments = commentRepository.findActiveRootCommentsByPostId(postId, pageable);
        return comments.map(this::mapToCommentDto);
    }

    public CommentDto getCommentById(UUID commentId, UUID userId) {
        Comment comment = commentRepository.findByIdAndUserId(commentId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        return mapToCommentDto(comment);
    }

    @Transactional
    public CommentDto createComment(UUID postId, UUID userId, CreateCommentRequest createRequest) {
        Comment comment = Comment.builder()
                .postId(postId)
                .userId(userId)
                .content(createRequest.getContent())
                .parentCommentId(createRequest.getParentCommentId())
                .build();
        comment = commentRepository.save(comment);
        
        // Publish event (postOwnerId would be fetched from post service in real implementation)
        CommentCreatedEvent event = CommentCreatedEvent.create(
            comment.getId(),
            postId,
            userId,
            null, // postOwnerId - would be fetched from post service
            createRequest.getContent(),
            createRequest.getParentCommentId(),
            new ArrayList<>() // mentionedUsers - would be extracted from content
        );
        eventPublishingService.publishCommentCreatedEvent(event);
        
        return mapToCommentDto(comment);
    }

    @Transactional
    public CommentDto updateComment(UUID commentId, UUID userId, UpdateCommentRequest updateRequest) {
        Comment comment = commentRepository.findByIdAndUserId(commentId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        comment.setContent(updateRequest.getContent());
        comment.setIsEdited(true);
        comment = commentRepository.save(comment);
        return mapToCommentDto(comment);
    }

    @Transactional
    public void deleteComment(UUID commentId, UUID userId) {
        Comment comment = commentRepository.findByIdAndUserId(commentId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        commentRepository.softDeleteComment(commentId);
        commentRepository.softDeleteRepliesByParentCommentId(commentId);
    }

    public Page<CommentDto> getUserComments(UUID userId, Pageable pageable) {
        Page<Comment> comments = commentRepository.findUserComments(userId, pageable);
        return comments.map(this::mapToCommentDto);
    }

    public void likeComment(UUID commentId, UUID userId) {
        if (commentLikeRepository.existsByCommentIdAndUserId(commentId, userId)) {
            throw new IllegalArgumentException("Comment already liked by user");
        }
        CommentLike commentLike = CommentLike.builder()
                .commentId(commentId)
                .userId(userId)
                .build();
        commentLikeRepository.save(commentLike);
    }

    public void unlikeComment(UUID commentId, UUID userId) {
        commentLikeRepository.deleteByCommentIdAndUserId(commentId, userId);
    }

    public Page<CommentDto> getCommentLikes(UUID commentId, Pageable pageable) {
        Page<CommentLike> likes = commentLikeRepository.findByCommentIdOrderByCreatedAtDesc(commentId, pageable);
        return likes.map(like -> CommentDto.builder()
                .id(like.getId())
                .build());
    }

    public List<CommentDto> getTopComments(UUID postId, Pageable pageable) {
        List<Comment> comments = commentRepository.findTopCommentsByPostId(postId, pageable);
        return comments.stream()
                .map(this::mapToCommentDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void softDeletePostComments(UUID postId) {
        // log.info("Soft deleting all comments for post: {}", postId); // Original code had this line commented out
        commentRepository.softDeleteCommentsByPostId(postId);
    }

    private CommentDto mapToCommentDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .parentCommentId(comment.getParentCommentId())
                .content(comment.getContent())
                .likeCount(comment.getLikeCount())
                .replyCount(comment.getReplyCount())
                .isActive(comment.getIsActive())
                .isEdited(comment.getIsEdited())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
