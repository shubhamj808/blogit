package com.blogit.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User registration request")
public class UserRegistrationDto {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Schema(description = "Username for the user", example = "john_doe")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Schema(description = "Email address of the user", example = "john@example.com")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\\\\w\\\\s]).{8,}$",
            message = "Password must contain at least one digit, one lowercase, one uppercase, one special character")
    @Schema(description = "Password for the user", example = "SecurePassword123!")
    private String password;
    
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    @Schema(description = "Full name of the user", example = "John Doe")
    private String fullName;
    
    @Past(message = "Date of birth must be in the past")
    @Schema(description = "Date of birth of the user", example = "1990-01-01")
    private LocalDate dateOfBirth;
    
    @AssertTrue(message = "You must accept the terms and conditions")
    @Schema(description = "Acceptance of terms and conditions")
    private boolean acceptTerms;
    
    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    @Schema(description = "First name of the user", example = "John")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    @Schema(description = "Last name of the user", example = "Doe")
    private String lastName;
    
    @Size(max = 500, message = "Bio must not exceed 500 characters")
    @Schema(description = "Biography of the user", example = "Software developer and blogger")
    private String bio;
    
    @Schema(description = "Profile picture URL", example = "https://example.com/profile.jpg")
    private String profilePictureUrl;
}
