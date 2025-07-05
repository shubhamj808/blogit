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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;

    public PostResponse createPost(Long userId, CreatePostRequest request) {
        Post post = Post.builder()
                .userId(userId)
                .title(request.getTitle())
                .content(request.getContent())
                .visibility(request.getVisibility())
                .hashtags(request.getHashtags())
                .mediaUrls(request.getMediaUrls())
                .build();

        post = postRepository.save(post);

        log.info("Post created: {}", post);
        return PostResponse.fromEntity(post);
    }

    public PostResponse getPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));

        return PostResponse.fromEntity(post);
    }

    public Page<PostResponse> getUserPosts(Long userId, int page, int size) {
        return postRepository.findByUserIdAndIsActiveOrderByCreatedAtDesc(userId, true, PageRequest.of(page, size))
                .map(PostResponse::fromEntity);
    }

    public PostResponse updatePost(Long postId, Long userId, UpdatePostRequest request) {
        Post post = postRepository.findByIdAndIsActive(postId, true)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));

        if (!post.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to update this post.");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setVisibility(request.getVisibility());
        post.setHashtags(request.getHashtags());
        post.setMediaUrls(request.getMediaUrls());

        post = postRepository.save(post);

        log.info("Post updated: {}", post);
        return PostResponse.fromEntity(post);
    }

    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findByIdAndIsActive(postId, true)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));

        if (!post.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to delete this post.");
        }

        post.setIsActive(false);
        postRepository.save(post);

        log.info("Post deleted: {}", post);
    }
}
