package com.blogit.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User profile update data")
public class UserUpdateDto {
    
    @Schema(description = "Email address", example = "john@example.com")
    @Email(message = "Email should be valid")
    private String email;
    
    @Schema(description = "First name", example = "John")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;
    
    @Schema(description = "Last name", example = "Doe")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;
    
    @Schema(description = "User bio", example = "Software developer and tech enthusiast")
    @Size(max = 500, message = "Bio must not exceed 500 characters")
    private String bio;
    
    @Schema(description = "Profile picture URL", example = "https://example.com/profile.jpg")
    private String profilePictureUrl;
}
