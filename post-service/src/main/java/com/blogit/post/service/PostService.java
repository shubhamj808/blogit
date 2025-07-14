package com.blogit.post.service;

import com.blogit.post.dto.CreatePostRequest;
import com.blogit.post.dto.PostResponse;
import com.blogit.post.dto.UpdatePostRequest;
import com.blogit.post.entity.Post;
import com.blogit.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final EventPublishingService eventPublishingService;

    public PostResponse createPost(UUID userId, CreatePostRequest request) {
        Post post = Post.builder()
                .userId(userId)
                .title(request.getTitle())
                .content(request.getContent())
                .visibility(request.getVisibility())
                .hashtags(request.getHashtags())
                .mediaUrls(request.getMediaUrls())
                .build();

        post = postRepository.save(post);
        
        // Publish post created event
        eventPublishingService.publishPostCreated(post);

        log.info("Post created: {}", post);
        return PostResponse.fromEntity(post);
    }

    public PostResponse getPost(UUID postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));

        if (!post.getIsActive()) {
            log.info("Post {} is not active", postId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found.");
        }

        return PostResponse.fromEntity(post);
    }

    public Page<PostResponse> getUserPosts(UUID userId, int page, int size) {
        return postRepository.findByUserIdAndIsActiveOrderByCreatedAtDesc(userId, true, PageRequest.of(page, size))
                .map(PostResponse::fromEntity);
    }
    
    public Page<PostResponse> getFeed(UUID userId, int page, int size) {
        // For now, return all public posts ordered by creation date
        // In a real implementation, you would consider user's following list, preferences, etc.
        return postRepository.findByVisibilityAndIsActiveOrderByCreatedAtDesc(Post.PostVisibility.PUBLIC, true, PageRequest.of(page, size))
                .map(PostResponse::fromEntity);
    }

    public PostResponse updatePost(UUID postId, UUID userId, UpdatePostRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));

        if (!post.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to update this post.");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setHashtags(request.getHashtags());
        post.setMediaUrls(request.getMediaUrls());
        post.setVisibility(request.getVisibility());

        post = postRepository.save(post);
        
        // Publish post updated event
        eventPublishingService.publishPostUpdated(post);

        return PostResponse.fromEntity(post);
    }

    public void deletePost(UUID postId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));

        if (!post.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to delete this post.");
        }

        post.setIsActive(false);
        post = postRepository.save(post);
        
        // Publish post deleted event
        eventPublishingService.publishPostDeleted(post);
    }
}
