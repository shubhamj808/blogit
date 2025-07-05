package com.blogit.interaction.repository;

import com.blogit.interaction.entity.CommentLike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, UUID> {
    
    // Check if user has liked a comment
    boolean existsByCommentIdAndUserId(UUID commentId, UUID userId);
    
    // Find specific comment like by comment and user
    Optional<CommentLike> findByCommentIdAndUserId(UUID commentId, UUID userId);
    
    // Get all likes for a comment
    Page<CommentLike> findByCommentIdOrderByCreatedAtDesc(UUID commentId, Pageable pageable);
    
    // Count likes for a comment
    long countByCommentId(UUID commentId);
    
    // Delete comment like by comment and user
    void deleteByCommentIdAndUserId(UUID commentId, UUID userId);
    
    // Get user's liked comments
    @Query("SELECT cl FROM CommentLike cl WHERE cl.userId = :userId ORDER BY cl.createdAt DESC")
    Page<CommentLike> findUserCommentLikes(@Param("userId") UUID userId, Pageable pageable);
    
    // Get comment likes for multiple comments (for checking user's like status)
    @Query("SELECT cl FROM CommentLike cl WHERE cl.commentId IN :commentIds AND cl.userId = :userId")
    List<CommentLike> findByCommentIdsAndUserId(@Param("commentIds") List<UUID> commentIds, @Param("userId") UUID userId);
    
    // Clean up comment likes when a comment is deleted
    void deleteByCommentId(UUID commentId);
}
