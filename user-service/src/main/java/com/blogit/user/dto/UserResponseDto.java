package com.blogit.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User response data")
public class UserResponseDto {
    
    @Schema(description = "User's unique identifier")
    private String id;
    
    @Schema(description = "Username", example = "john_doe")
    private String username;
    
    @Schema(description = "Email address", example = "john@example.com")
    private String email;
    
    @Schema(description = "Full name", example = "John Doe")
    private String fullName;
    
    @Schema(description = "Profile image URL")
    private String profileImage;
    
    @Schema(description = "Cover image URL")
    private String coverImage;
    
    @Schema(description = "User's bio", example = "Software developer and tech enthusiast")
    private String bio;
    
    @Schema(description = "User's location", example = "San Francisco, CA")
    private String location;
    
    @Schema(description = "User's website", example = "https://johndoe.dev")
    private String website;
    
    @Schema(description = "Date of birth")
    private LocalDate dateOfBirth;
    
    @Schema(description = "Whether the user is verified")
    private boolean isVerified;
    
    @Schema(description = "Whether the user is active")
    private boolean isActive;
    
    @Schema(description = "Whether the user's profile is private")
    private boolean isPrivate;
    
    @Schema(description = "Number of followers")
    private int followersCount;
    
    @Schema(description = "Number of users being followed")
    private int followingCount;
    
    @Schema(description = "Number of posts")
    private int postsCount;
    
    @Schema(description = "Number of likes received")
    private int likesCount;
    
    @Schema(description = "Last active timestamp")
    private LocalDateTime lastActive;
    
    @Schema(description = "Account creation timestamp")
    private LocalDateTime joinedAt;
}
