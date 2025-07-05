package com.blogit.interaction.repository;

import com.blogit.interaction.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    
    // Get all active comments for a post
    @Query("SELECT c FROM Comment c WHERE c.postId = :postId AND c.isActive = true AND c.parentCommentId IS NULL ORDER BY c.createdAt DESC")
    Page<Comment> findActiveRootCommentsByPostId(@Param("postId") UUID postId, Pageable pageable);
    
    // Get all active comments for a post (including replies)
    @Query("SELECT c FROM Comment c WHERE c.postId = :postId AND c.isActive = true ORDER BY c.createdAt DESC")
    List<Comment> findAllActiveCommentsByPostId(@Param("postId") UUID postId);
    
    // Get replies for a specific comment
    @Query("SELECT c FROM Comment c WHERE c.parentCommentId = :parentCommentId AND c.isActive = true ORDER BY c.createdAt ASC")
    List<Comment> findRepliesByParentCommentId(@Param("parentCommentId") UUID parentCommentId);
    
    // Find comment by ID and user ID (for ownership validation)
    Optional<Comment> findByIdAndUserId(UUID commentId, UUID userId);
    
    // Count active comments for a post
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.postId = :postId AND c.isActive = true")
    long countActiveCommentsByPostId(@Param("postId") UUID postId);
    
    // Count replies for a comment
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.parentCommentId = :parentCommentId AND c.isActive = true")
    long countRepliesByParentCommentId(@Param("parentCommentId") UUID parentCommentId);
    
    // Soft delete comment
    @Modifying
    @Query("UPDATE Comment c SET c.isActive = false WHERE c.id = :commentId")
    void softDeleteComment(@Param("commentId") UUID commentId);
    
    // Soft delete all replies of a comment
    @Modifying
    @Query("UPDATE Comment c SET c.isActive = false WHERE c.parentCommentId = :parentCommentId")
    void softDeleteRepliesByParentCommentId(@Param("parentCommentId") UUID parentCommentId);
    
    // Clean up comments when a post is deleted
    @Modifying
    @Query("UPDATE Comment c SET c.isActive = false WHERE c.postId = :postId")
    void softDeleteCommentsByPostId(@Param("postId") UUID postId);
    
    // Get user's comment history
    @Query("SELECT c FROM Comment c WHERE c.userId = :userId AND c.isActive = true ORDER BY c.createdAt DESC")
    Page<Comment> findUserComments(@Param("userId") UUID userId, Pageable pageable);
    
    // Find top comments by like count
    @Query("SELECT c FROM Comment c WHERE c.postId = :postId AND c.isActive = true AND c.parentCommentId IS NULL ORDER BY c.likeCount DESC, c.createdAt DESC")
    List<Comment> findTopCommentsByPostId(@Param("postId") UUID postId, Pageable pageable);
}
