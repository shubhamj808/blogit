package com.blogit.user.repository;

import com.blogit.user.entity.User;
import com.blogit.user.entity.UserFollowing;
import com.blogit.user.entity.UserFollowingId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserFollowingRepository extends JpaRepository<UserFollowing, UserFollowingId> {
    
    boolean existsByFollowerIdAndFollowingId(UUID followerId, UUID followingId);
    
    void deleteByFollowerIdAndFollowingId(UUID followerId, UUID followingId);
    
    @Query("SELECT uf.following FROM UserFollowing uf WHERE uf.id.followerId = :userId")
    Page<User> findFollowingByFollowerId(@Param("userId") UUID userId, Pageable pageable);
    
    @Query("SELECT uf.follower FROM UserFollowing uf WHERE uf.id.followingId = :userId")
    Page<User> findFollowersByFollowingId(@Param("userId") UUID userId, Pageable pageable);
    
    @Query("SELECT COUNT(uf) FROM UserFollowing uf WHERE uf.id.followerId = :userId")
    long countFollowingByFollowerId(@Param("userId") UUID userId);
    
    @Query("SELECT COUNT(uf) FROM UserFollowing uf WHERE uf.id.followingId = :userId")
    long countFollowersByFollowingId(@Param("userId") UUID userId);
    
    @Query("SELECT COUNT(uf) FROM UserFollowing uf WHERE uf.id.followerId = :user1Id AND uf.id.followingId IN " +
           "(SELECT uf2.id.followingId FROM UserFollowing uf2 WHERE uf2.id.followerId = :user2Id)")
    int countMutualFollowing(@Param("user1Id") UUID user1Id, @Param("user2Id") UUID user2Id);
}
