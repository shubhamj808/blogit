package com.blogit.user.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_following", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"follower_id", "following_id"}))
@EntityListeners(AuditingEntityListener.class)
public class UserFollowing {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    private User follower;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_id", nullable = false)
    private User following;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public UserFollowing() {}
    
    public UserFollowing(User follower, User following) {
        this.follower = follower;
        this.following = following;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getFollower() {
        return follower;
    }
    
    public void setFollower(User follower) {
        this.follower = follower;
    }
    
    public User getFollowing() {
        return following;
    }
    
    public void setFollowing(User following) {
        this.following = following;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "UserFollowing{" +
                "id=" + id +
                ", follower=" + (follower != null ? follower.getUsername() : null) +
                ", following=" + (following != null ? following.getUsername() : null) +
                ", createdAt=" + createdAt +
                '}';
    }
}
