package com.blogit.user.repository;

import com.blogit.user.entity.User;
import com.blogit.user.entity.UserFollowing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserFollowingRepository extends JpaRepository<UserFollowing, String> {
    
    boolean existsByFollowerIdAndFollowingId(String followerId, String followingId);
    
    void deleteByFollowerIdAndFollowingId(String followerId, String followingId);
    
    @Query("SELECT u FROM User u JOIN UserFollowing uf ON u.id = uf.followingId WHERE uf.followerId = :userId")
    Page<User> findFollowingByFollowerId(@Param("userId") String userId, Pageable pageable);
    
    @Query("SELECT u FROM User u JOIN UserFollowing uf ON u.id = uf.followerId WHERE uf.followingId = :userId")
    Page<User> findFollowersByFollowingId(@Param("userId") String userId, Pageable pageable);
    
    @Query("SELECT COUNT(uf) FROM UserFollowing uf WHERE uf.followerId = :userId")
    long countFollowingByFollowerId(@Param("userId") String userId);
    
    @Query("SELECT COUNT(uf) FROM UserFollowing uf WHERE uf.followingId = :userId")
    long countFollowersByFollowingId(@Param("userId") String userId);
    
    @Query("SELECT COUNT(uf) FROM UserFollowing uf WHERE uf.followerId = :user1Id AND uf.followingId IN " +
           "(SELECT uf2.followingId FROM UserFollowing uf2 WHERE uf2.followerId = :user2Id)")
    int countMutualFollowing(@Param("user1Id") String user1Id, @Param("user2Id") String user2Id);
}
