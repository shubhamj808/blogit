package com.blogit.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(name = "cover_image")
    private String coverImage;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String location;
    private String website;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "is_private", nullable = false)
    private boolean isPrivate;

    @Column(name = "followers_count", nullable = false)
    private int followersCount;

    @Column(name = "following_count", nullable = false)
    private int followingCount;

    @Column(name = "posts_count", nullable = false)
    private int postsCount;

    @Column(name = "likes_count", nullable = false)
    private int likesCount;

    @Column(name = "last_active")
    private LocalDateTime lastActive;

    @CreationTimestamp
    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ElementCollection
    @CollectionTable(name = "user_preferences", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "preference_key")
    @Column(name = "preference_value")
    private Map<String, String> preferences;

    @PrePersist
    protected void onCreate() {
        if (isActive == false) {
            isActive = true;
        }
        if (followersCount == 0) {
            followersCount = 0;
        }
        if (followingCount == 0) {
            followingCount = 0;
        }
        if (postsCount == 0) {
            postsCount = 0;
        }
        if (likesCount == 0) {
            likesCount = 0;
        }
    }
}
