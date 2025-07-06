package com.blogit.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User profile update request")
public class UserUpdateDto {
    
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    @Schema(description = "Full name of the user", example = "John Doe")
    private String fullName;
    
    @Email(message = "Email must be valid")
    @Schema(description = "Email address", example = "john@example.com")
    private String email;
    
    @Size(max = 500, message = "Bio must not exceed 500 characters")
    @Schema(description = "User's bio", example = "Software developer and tech enthusiast")
    private String bio;
    
    @Size(max = 100, message = "Location must not exceed 100 characters")
    @Schema(description = "User's location", example = "San Francisco, CA")
    private String location;
    
    @Size(max = 200, message = "Website URL must not exceed 200 characters")
    @Schema(description = "User's website", example = "https://johndoe.dev")
    private String website;
    
    @Past(message = "Date of birth must be in the past")
    @Schema(description = "Date of birth", example = "1990-01-01")
    private LocalDate dateOfBirth;
    
    @Schema(description = "Profile image URL")
    private String profileImage;
    
    @Schema(description = "Cover image URL")
    private String coverImage;
    
    @Schema(description = "Whether the profile is private")
    private Boolean isPrivate;
}
