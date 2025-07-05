package com.blogit.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User response data")
public class UserResponseDto {
    
    @Schema(description = "User ID", example = "1")
    private Long id;
    
    @Schema(description = "Username", example = "john_doe")
    private String username;
    
    @Schema(description = "Email address", example = "john@example.com")
    private String email;
    
    @Schema(description = "First name", example = "John")
    private String firstName;
    
    @Schema(description = "Last name", example = "Doe")
    private String lastName;
    
    @Schema(description = "User bio", example = "Software developer and tech enthusiast")
    private String bio;
    
    @Schema(description = "Profile picture URL", example = "https://example.com/profile.jpg")
    private String profilePictureUrl;
    
    @Schema(description = "Is account active", example = "true")
    private Boolean isActive;
    
    @Schema(description = "Account creation date", example = "2024-01-01T00:00:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last updated date", example = "2024-01-01T00:00:00")
    private LocalDateTime updatedAt;
    
    @Schema(description = "Number of followers", example = "100")
    private Long followersCount;
    
    @Schema(description = "Number of following", example = "50")
    private Long followingCount;
}
