package com.blogit.user.service;

import com.blogit.user.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    
    // Authentication
    UserResponseDto register(UserRegistrationDto registrationDto);
    ApiResponse<UserResponseDto> login(UserLoginDto loginDto);
    void logout(String userId);
    
    // Profile Management
    UserResponseDto getUserById(String userId);
    UserResponseDto getUserByUsername(String username);
    UserResponseDto updateProfile(String userId, UserUpdateDto updateDto);
    void deleteAccount(String userId);
    
    // Follow Management
    void followUser(String followerId, String followingId);
    void unfollowUser(String followerId, String followingId);
    Page<UserResponseDto> getFollowers(String userId, Pageable pageable);
    Page<UserResponseDto> getFollowing(String userId, Pageable pageable);
    boolean isFollowing(String followerId, String followingId);
    
    // User Discovery
    Page<UserResponseDto> searchUsers(String query, Pageable pageable);
    Page<UserResponseDto> getSuggestedUsers(String userId, Pageable pageable);
    
    // Account Management
    void verifyEmail(String token);
    void requestPasswordReset(String email);
    void resetPassword(String token, String newPassword);
    void updatePassword(String userId, String oldPassword, String newPassword);
    void updateEmail(String userId, String newEmail);
    
    // Status Management
    void updateLastActive(String userId);
    void togglePrivateProfile(String userId);
    void toggleAccountStatus(String userId, boolean active);
} 