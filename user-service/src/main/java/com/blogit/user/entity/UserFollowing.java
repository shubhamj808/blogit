package com.blogit.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_following",
       uniqueConstraints = @UniqueConstraint(columnNames = {"follower_id", "following_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserFollowing {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "follower_id", nullable = false)
    private String followerId;

    @Column(name = "following_id", nullable = false)
    private String followingId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FollowStatus status = FollowStatus.ACTIVE;

    public enum FollowStatus {
        ACTIVE,
        BLOCKED
    }
}
