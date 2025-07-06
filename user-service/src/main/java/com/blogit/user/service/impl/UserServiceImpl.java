package com.blogit.user.service.impl;

import com.blogit.user.dto.*;
import com.blogit.user.entity.User;
import com.blogit.user.entity.UserFollowing;
import com.blogit.user.repository.UserFollowingRepository;
import com.blogit.user.repository.UserRepository;
import com.blogit.user.security.JwtTokenProvider;
import com.blogit.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserFollowingRepository followingRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public UserResponseDto register(UserRegistrationDto registrationDto) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(registrationDto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = User.builder()
                .username(registrationDto.getUsername())
                .email(registrationDto.getEmail())
                .password(passwordEncoder.encode(registrationDto.getPassword()))
                .fullName(registrationDto.getFullName())
                .dateOfBirth(registrationDto.getDateOfBirth())
                .isActive(true)
                .isVerified(false)
                .isPrivate(false)
                .joinedAt(LocalDateTime.now())
                .lastActive(LocalDateTime.now())
                .build();

        user = userRepository.save(user);
        return mapUserToResponseDto(user);
    }

    @Override
    public ApiResponse<UserResponseDto> login(UserLoginDto loginDto) {
        User user = userRepository.findByUsernameOrEmail(loginDto.getUsernameOrEmail(), loginDto.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Update last active
        user.setLastActive(LocalDateTime.now());
        user = userRepository.save(user);

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername());
        
        // Create response with user details and token
        UserResponseDto userResponse = mapUserToResponseDto(user);
        return ApiResponse.success(userResponse, token, "Login successful");
    }

    @Override
    public void logout(String userId) {
        // Implement token invalidation if needed
    }

    @Override
    public UserResponseDto getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapUserToResponseDto(user);
    }

    @Override
    public UserResponseDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapUserToResponseDto(user);
    }

    @Override
    public UserResponseDto updateProfile(String userId, UserUpdateDto updateDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updateDto.getEmail() != null && !updateDto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(updateDto.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(updateDto.getEmail());
            user.setVerified(false); // Require re-verification for new email
        }

        // Update other fields
        if (updateDto.getFullName() != null) user.setFullName(updateDto.getFullName());
        if (updateDto.getBio() != null) user.setBio(updateDto.getBio());
        if (updateDto.getLocation() != null) user.setLocation(updateDto.getLocation());
        if (updateDto.getWebsite() != null) user.setWebsite(updateDto.getWebsite());
        if (updateDto.getDateOfBirth() != null) user.setDateOfBirth(updateDto.getDateOfBirth());
        if (updateDto.getProfileImage() != null) user.setProfileImage(updateDto.getProfileImage());
        if (updateDto.getCoverImage() != null) user.setCoverImage(updateDto.getCoverImage());
        if (updateDto.getIsPrivate() != null) user.setPrivate(updateDto.getIsPrivate());

        user = userRepository.save(user);
        return mapUserToResponseDto(user);
    }

    @Override
    public void deleteAccount(String userId) {
        userRepository.deleteById(userId);
    }

    @Override
    public void followUser(String followerId, String followingId) {
        if (followerId.equals(followingId)) {
            throw new RuntimeException("Users cannot follow themselves");
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));

        if (followingRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            throw new RuntimeException("Already following this user");
        }

        UserFollowing userFollowing = UserFollowing.builder()
                .followerId(followerId)
                .followingId(followingId)
                .createdAt(LocalDateTime.now())
                .build();

        followingRepository.save(userFollowing);
    }

    @Override
    public void unfollowUser(String followerId, String followingId) {
        if (!followingRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            throw new RuntimeException("Not following this user");
        }

        followingRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Override
    public Page<UserResponseDto> getFollowers(String userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return followingRepository.findFollowersByFollowingId(userId, pageable)
                .map(this::mapUserToResponseDto);
    }

    @Override
    public Page<UserResponseDto> getFollowing(String userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return followingRepository.findFollowingByFollowerId(userId, pageable)
                .map(this::mapUserToResponseDto);
    }

    @Override
    public boolean isFollowing(String followerId, String followingId) {
        return followingRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Override
    public Page<UserResponseDto> searchUsers(String query, Pageable pageable) {
        return userRepository.findByUsernameContainingOrFullNameContainingOrBioContaining(query, query, query, pageable)
                .map(this::mapUserToResponseDto);
    }

    @Override
    public Page<UserResponseDto> getSuggestedUsers(String userId, Pageable pageable) {
        // Implement user suggestion logic (e.g., based on mutual followers, interests, etc.)
        return userRepository.findAll(pageable).map(this::mapUserToResponseDto);
    }

    @Override
    public void verifyEmail(String token) {
        // Implement email verification logic
    }

    @Override
    public void requestPasswordReset(String email) {
        // Implement password reset request logic
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        // Implement password reset logic
    }

    @Override
    public void updatePassword(String userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Invalid old password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public void updateEmail(String userId, String newEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userRepository.existsByEmail(newEmail)) {
            throw new RuntimeException("Email already exists");
        }

        user.setEmail(newEmail);
        user.setVerified(false);
        userRepository.save(user);
    }

    @Override
    public void updateLastActive(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setLastActive(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public void togglePrivateProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPrivate(!user.isPrivate());
        userRepository.save(user);
    }

    @Override
    public void toggleAccountStatus(String userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(active);
        userRepository.save(user);
    }

    private UserResponseDto mapUserToResponseDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .profileImage(user.getProfileImage())
                .coverImage(user.getCoverImage())
                .bio(user.getBio())
                .location(user.getLocation())
                .website(user.getWebsite())
                .dateOfBirth(user.getDateOfBirth())
                .isVerified(user.isVerified())
                .isActive(user.isActive())
                .isPrivate(user.isPrivate())
                .followersCount((int) followingRepository.countFollowersByFollowingId(user.getId()))
                .followingCount((int) followingRepository.countFollowingByFollowerId(user.getId()))
                .lastActive(user.getLastActive())
                .joinedAt(user.getJoinedAt())
                .build();
    }
} 