package com.blogit.post.repository;

import com.blogit.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    List<Post> findByUserIdAndIsActiveOrderByCreatedAtDesc(Long userId, Boolean isActive);
    
    Page<Post> findByUserIdAndIsActiveOrderByCreatedAtDesc(Long userId, Boolean isActive, Pageable pageable);
    
    Page<Post> findByVisibilityAndIsActiveOrderByCreatedAtDesc(Post.PostVisibility visibility, Boolean isActive, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.visibility = 'PUBLIC' AND p.isActive = true AND p.userId IN :userIds ORDER BY p.createdAt DESC")
    Page<Post> findPublicPostsByUserIds(@Param("userIds") List<Long> userIds, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.isActive = true AND p.content ILIKE %:keyword% OR p.title ILIKE %:keyword% ORDER BY p.createdAt DESC")
    Page<Post> findByContentOrTitleContainingIgnoreCase(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM Post p JOIN p.hashtags h WHERE h = :hashtag AND p.isActive = true ORDER BY p.createdAt DESC")
    Page<Post> findByHashtag(@Param("hashtag") String hashtag, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.isActive = true AND p.createdAt BETWEEN :startDate AND :endDate ORDER BY p.likesCount DESC, p.commentsCount DESC")
    Page<Post> findTrendingPosts(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);
    
    Optional<Post> findByIdAndIsActive(Long id, Boolean isActive);
    
    Long countByUserIdAndIsActive(Long userId, Boolean isActive);
    
    @Query("SELECT DISTINCT h FROM Post p JOIN p.hashtags h WHERE p.isActive = true")
    List<String> findAllActiveHashtags();
}
