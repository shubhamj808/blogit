package com.blogit.user.controller;

import com.blogit.user.dto.*;
import com.blogit.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "APIs for user management and social interactions")
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register a new user", description = "Create a new user account with the provided details")
    public ApiResponse<UserResponseDto> register(@Valid @RequestBody UserRegistrationDto registrationDto) {
        UserResponseDto user = userService.register(registrationDto);
        return ApiResponse.success(user, "User registered successfully");
    }
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ApiResponse<UserResponseDto> login(@Valid @RequestBody UserLoginDto loginDto) {
        return userService.login(loginDto);
    }
    
    @PostMapping("/logout")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "User logout", description = "Invalidate the current session")
    public ApiResponse<Void> logout(@AuthenticationPrincipal String userId) {
        userService.logout(userId);
        return ApiResponse.success(null, "Logout successful");
    }
    
    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get current user profile", description = "Retrieve the profile of the authenticated user")
    public ApiResponse<UserResponseDto> getCurrentUser(@AuthenticationPrincipal String userId) {
        UserResponseDto user = userService.getUserById(userId);
        return ApiResponse.success(user);
    }
    
    @GetMapping("/{username}")
    @Operation(summary = "Get user by username", description = "Retrieve a user's profile by their username")
    public ApiResponse<UserResponseDto> getUserByUsername(@PathVariable String username) {
        UserResponseDto user = userService.getUserByUsername(username);
        return ApiResponse.success(user);
    }
    
    @PutMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update user profile", description = "Update the authenticated user's profile")
    public ApiResponse<UserResponseDto> updateProfile(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody UserUpdateDto updateDto) {
        UserResponseDto user = userService.updateProfile(userId, updateDto);
        return ApiResponse.success(user, "Profile updated successfully");
    }
    
    @DeleteMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete account", description = "Deactivate the authenticated user's account")
    public ApiResponse<Void> deleteAccount(@AuthenticationPrincipal String userId) {
        userService.deleteAccount(userId);
        return ApiResponse.success(null, "Account deleted successfully");
    }
    
    @PostMapping("/follow/{userId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Follow user", description = "Follow another user")
    public ApiResponse<Void> followUser(
            @AuthenticationPrincipal String followerId,
            @PathVariable String userId) {
        userService.followUser(followerId, userId);
        return ApiResponse.success(null, "User followed successfully");
    }
    
    @DeleteMapping("/follow/{userId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Unfollow user", description = "Unfollow a previously followed user")
    public ApiResponse<Void> unfollowUser(
            @AuthenticationPrincipal String followerId,
            @PathVariable String userId) {
        userService.unfollowUser(followerId, userId);
        return ApiResponse.success(null, "User unfollowed successfully");
    }
    
    @GetMapping("/{userId}/followers")
    @Operation(summary = "Get user followers", description = "Retrieve paginated list of user's followers")
    public ApiResponse<Page<UserResponseDto>> getFollowers(
            @PathVariable String userId,
            @Parameter(hidden = true) Pageable pageable) {
        Page<UserResponseDto> followers = userService.getFollowers(userId, pageable);
        return ApiResponse.success(followers);
    }
    
    @GetMapping("/{userId}/following")
    @Operation(summary = "Get user following", description = "Retrieve paginated list of users being followed")
    public ApiResponse<Page<UserResponseDto>> getFollowing(
            @PathVariable String userId,
            @Parameter(hidden = true) Pageable pageable) {
        Page<UserResponseDto> following = userService.getFollowing(userId, pageable);
        return ApiResponse.success(following);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search users", description = "Search users by username, name, or bio")
    public ApiResponse<Page<UserResponseDto>> searchUsers(
            @RequestParam String query,
            @Parameter(hidden = true) Pageable pageable) {
        Page<UserResponseDto> users = userService.searchUsers(query, pageable);
        return ApiResponse.success(users);
    }
    
    @GetMapping("/suggestions")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get user suggestions", description = "Get personalized user suggestions")
    public ApiResponse<Page<UserResponseDto>> getSuggestedUsers(
            @AuthenticationPrincipal String userId,
            @Parameter(hidden = true) Pageable pageable) {
        Page<UserResponseDto> suggestions = userService.getSuggestedUsers(userId, pageable);
        return ApiResponse.success(suggestions);
    }
    
    @PostMapping("/verify-email")
    @Operation(summary = "Verify email", description = "Verify user's email address using verification token")
    public ApiResponse<Void> verifyEmail(@RequestParam String token) {
        userService.verifyEmail(token);
        return ApiResponse.success(null, "Email verified successfully");
    }
    
    @PostMapping("/password/reset-request")
    @Operation(summary = "Request password reset", description = "Request a password reset link")
    public ApiResponse<Void> requestPasswordReset(@RequestParam String email) {
        userService.requestPasswordReset(email);
        return ApiResponse.success(null, "Password reset link sent successfully");
    }
    
    @PostMapping("/password/reset")
    @Operation(summary = "Reset password", description = "Reset password using reset token")
    public ApiResponse<Void> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {
        userService.resetPassword(token, newPassword);
        return ApiResponse.success(null, "Password reset successfully");
    }
    
    @PutMapping("/me/password")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update password", description = "Update authenticated user's password")
    public ApiResponse<Void> updatePassword(
            @AuthenticationPrincipal String userId,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {
        userService.updatePassword(userId, oldPassword, newPassword);
        return ApiResponse.success(null, "Password updated successfully");
    }
    
    @PutMapping("/me/email")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update email", description = "Update authenticated user's email address")
    public ApiResponse<Void> updateEmail(
            @AuthenticationPrincipal String userId,
            @RequestParam String newEmail) {
        userService.updateEmail(userId, newEmail);
        return ApiResponse.success(null, "Email updated successfully");
    }
    
    @PutMapping("/me/privacy")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Toggle private profile", description = "Toggle the private status of user's profile")
    public ApiResponse<Void> togglePrivateProfile(@AuthenticationPrincipal String userId) {
        userService.togglePrivateProfile(userId);
        return ApiResponse.success(null, "Privacy settings updated successfully");
    }
} 