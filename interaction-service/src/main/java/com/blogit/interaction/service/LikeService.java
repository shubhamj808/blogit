package com.blogit.interaction.service;

import com.blogit.interaction.dto.LikeDto;
import com.blogit.interaction.dto.LikeStatusDto;
import com.blogit.interaction.entity.Like;
import com.blogit.interaction.event.PostLikedEvent;
import com.blogit.interaction.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LikeService {

    private final LikeRepository likeRepository;
    private final EventPublishingService eventPublishingService;

    @Transactional
    public LikeDto likePost(UUID postId, UUID userId) {
        log.debug("User {} attempting to like post {}", userId, postId);
        
        if (likeRepository.existsByPostIdAndUserId(postId, userId)) {
            throw new IllegalArgumentException("Post already liked by user");
        }

        Like like = Like.builder()
                .postId(postId)
                .userId(userId)
                .build();

        like = likeRepository.save(like);
        log.info("User {} successfully liked post {}", userId, postId);

        // Publish event (postOwnerId would be fetched from post service in real implementation)
        PostLikedEvent event = PostLikedEvent.create(postId, userId, null, like.getId());
        eventPublishingService.publishPostLikedEvent(event);

        return mapToLikeDto(like);
    }

    @Transactional
    public void unlikePost(UUID postId, UUID userId) {
        log.debug("User {} attempting to unlike post {}", userId, postId);
        
        if (!likeRepository.existsByPostIdAndUserId(postId, userId)) {
            throw new IllegalArgumentException("Post is not liked by user");
        }

        likeRepository.deleteByPostIdAndUserId(postId, userId);
        log.info("User {} successfully unliked post {}", userId, postId);
    }

    public Page<LikeDto> getPostLikes(UUID postId, Pageable pageable) {
        log.debug("Fetching likes for post {} with pagination: page={}, size={}", 
                 postId, pageable.getPageNumber(), pageable.getPageSize());
        
        Page<Like> likes = likeRepository.findByPostIdOrderByCreatedAtDesc(postId, pageable);
        return likes.map(this::mapToLikeDto);
    }

    public LikeStatusDto checkUserLikeStatus(UUID postId, UUID userId) {
        log.debug("Checking like status for user {} on post {}", userId, postId);
        
        return likeRepository.findByPostIdAndUserId(postId, userId)
                .map(like -> LikeStatusDto.builder()
                        .isLiked(true)
                        .likedAt(like.getCreatedAt())
                        .build())
                .orElse(LikeStatusDto.builder()
                        .isLiked(false)
                        .likedAt(null)
                        .build());
    }

    public Map<UUID, LikeStatusDto> bulkCheckUserLikeStatus(List<UUID> postIds, UUID userId) {
        log.debug("Bulk checking like status for user {} on {} posts", userId, postIds.size());
        
        List<Like> userLikes = likeRepository.findByPostIdsAndUserId(postIds, userId);
        
        Map<UUID, LikeStatusDto> likedPosts = userLikes.stream()
                .collect(Collectors.toMap(
                        Like::getPostId,
                        like -> LikeStatusDto.builder()
                                .isLiked(true)
                                .likedAt(like.getCreatedAt())
                                .build()
                ));

        // Add non-liked posts
        return postIds.stream()
                .collect(Collectors.toMap(
                        postId -> postId,
                        postId -> likedPosts.getOrDefault(postId, 
                                LikeStatusDto.builder()
                                        .isLiked(false)
                                        .likedAt(null)
                                        .build())
                ));
    }

    public long getPostLikeCount(UUID postId) {
        log.debug("Getting like count for post {}", postId);
        return likeRepository.countByPostId(postId);
    }

    public Page<LikeDto> getUserLikes(UUID userId, Pageable pageable) {
        log.debug("Fetching likes for user {} with pagination: page={}, size={}", 
                 userId, pageable.getPageNumber(), pageable.getPageSize());
        
        Page<Like> likes = likeRepository.findUserLikes(userId, pageable);
        return likes.map(this::mapToLikeDto);
    }

    @Transactional
    public void cleanupPostLikes(UUID postId) {
        log.debug("Cleaning up likes for deleted post {}", postId);
        likeRepository.deleteByPostId(postId);
        log.info("Cleaned up likes for post {}", postId);
    }

    private LikeDto mapToLikeDto(Like like) {
        return LikeDto.builder()
                .id(like.getId())
                .postId(like.getPostId())
                .userId(like.getUserId())
                .createdAt(like.getCreatedAt())
                .build();
    }
}
