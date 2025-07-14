package com.blogit.user.repository;

import com.blogit.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsernameOrEmail(String username, String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.bio) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<User> findByUsernameContainingOrFullNameContainingOrBioContaining(
            @Param("query") String username,
            @Param("query") String fullName,
            @Param("query") String bio,
            Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE " +
           "u.id != :userId AND " +
           "u.isActive = true AND " +
           "u.id NOT IN (SELECT uf.id.followingId FROM UserFollowing uf WHERE uf.id.followerId = :userId) " +
           "ORDER BY u.followersCount DESC")
    Page<User> findSuggestedUsers(@Param("userId") UUID userId, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.id IN :userIds")
    List<User> findByUserIds(@Param("userIds") List<UUID> userIds);
    
    @Query("SELECT u FROM User u WHERE u.isVerified = :verified")
    Page<User> findByVerified(@Param("verified") boolean verified, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<User> searchUsers(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<User> searchUsers(@Param("query") String query);
    
    // Use method name instead of @Query to avoid validation issues
    Page<User> findByIsActiveTrueOrderByJoinedAtDesc(Pageable pageable);
    
    // Use method name instead of @Query to avoid validation issues
    List<User> findByIsActiveTrueOrderByJoinedAtDesc();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    Long countActiveUsers();
    
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isActive = true")
    Optional<User> findByEmailAndActive(@Param("email") String email);
    
    @Query("SELECT u FROM User u WHERE u.username = :username AND u.isActive = true")
    Optional<User> findByUsernameAndActive(@Param("username") String username);
}
