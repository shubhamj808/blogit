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
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "profile_image", length = 255)
    private String profileImage;

    @Column(name = "cover_image", length = 255)
    private String coverImage;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 100)
    private String location;

    @Column(length = 255)
    private String website;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "is_verified", nullable = false)
    @Builder.Default
    private boolean isVerified = false;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @Column(name = "is_private", nullable = false)
    @Builder.Default
    private boolean isPrivate = false;

    @Column(name = "followers_count", nullable = false)
    @Builder.Default
    private int followersCount = 0;

    @Column(name = "following_count", nullable = false)
    @Builder.Default
    private int followingCount = 0;

    @Column(name = "posts_count", nullable = false)
    @Builder.Default
    private int postsCount = 0;

    @Column(name = "likes_count", nullable = false)
    @Builder.Default
    private int likesCount = 0;

    @Column(name = "last_active", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private LocalDateTime lastActive;

    @CreationTimestamp
    @Column(name = "joined_at", nullable = false, updatable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private LocalDateTime joinedAt;

    @UpdateTimestamp
    @Column(name = "updated_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private LocalDateTime updatedAt;

    @ElementCollection
    @CollectionTable(name = "user_preferences", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "preference_key", length = 100)
    @Column(name = "preference_value")
    private Map<String, String> preferences;

    @OneToMany(mappedBy = "follower", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserFollowing> following;

    @OneToMany(mappedBy = "following", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserFollowing> followers;
}
