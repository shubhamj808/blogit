package com.blogit.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User login request")
public class UserLoginDto {
    
    @NotBlank(message = "Username or email is required")
    @Schema(description = "Username or email of the user", example = "john_doe")
    private String usernameOrEmail;
    
    @NotBlank(message = "Password is required")
    @Schema(description = "Password for the user", example = "SecurePassword123!")
    private String password;

    private boolean rememberMe;
}
