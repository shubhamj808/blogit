package com.blogit.interaction.repository;

import com.blogit.interaction.entity.Like;
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
public interface LikeRepository extends JpaRepository<Like, UUID> {
    
    // Check if user has liked a post
    boolean existsByPostIdAndUserId(UUID postId, UUID userId);
    
    // Find specific like by post and user
    Optional<Like> findByPostIdAndUserId(UUID postId, UUID userId);
    
    // Get all likes for a post
    Page<Like> findByPostIdOrderByCreatedAtDesc(UUID postId, Pageable pageable);
    
    // Count likes for a post
    long countByPostId(UUID postId);
    
    // Get likes for multiple posts (bulk check)
    @Query("SELECT l FROM Like l WHERE l.postId IN :postIds AND l.userId = :userId")
    List<Like> findByPostIdsAndUserId(@Param("postIds") List<UUID> postIds, @Param("userId") UUID userId);
    
    // Delete like by post and user
    void deleteByPostIdAndUserId(UUID postId, UUID userId);
    
    // Get user's liked posts
    @Query("SELECT l FROM Like l WHERE l.userId = :userId ORDER BY l.createdAt DESC")
    Page<Like> findUserLikes(@Param("userId") UUID userId, Pageable pageable);
    
    // Clean up likes when a post is deleted
    void deleteByPostId(UUID postId);
}
