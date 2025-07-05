package com.blogit.user.repository;

import com.blogit.user.entity.User;
import com.blogit.user.entity.UserFollowing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFollowingRepository extends JpaRepository<UserFollowing, Long> {
    
    Optional<UserFollowing> findByFollowerAndFollowing(User follower, User following);
    
    boolean existsByFollowerAndFollowing(User follower, User following);
    
    @Query("SELECT uf.following FROM UserFollowing uf WHERE uf.follower = :user")
    List<User> findFollowingUsers(@Param("user") User user);
    
    @Query("SELECT uf.following FROM UserFollowing uf WHERE uf.follower = :user")
    Page<User> findFollowingUsers(@Param("user") User user, Pageable pageable);
    
    @Query("SELECT uf.follower FROM UserFollowing uf WHERE uf.following = :user")
    List<User> findFollowers(@Param("user") User user);
    
    @Query("SELECT uf.follower FROM UserFollowing uf WHERE uf.following = :user")
    Page<User> findFollowers(@Param("user") User user, Pageable pageable);
    
    @Query("SELECT COUNT(uf) FROM UserFollowing uf WHERE uf.follower = :user")
    Long countFollowingUsers(@Param("user") User user);
    
    @Query("SELECT COUNT(uf) FROM UserFollowing uf WHERE uf.following = :user")
    Long countFollowers(@Param("user") User user);
    
    void deleteByFollowerAndFollowing(User follower, User following);
    
    @Query("SELECT uf FROM UserFollowing uf WHERE uf.follower.id = :followerId")
    List<UserFollowing> findByFollowerId(@Param("followerId") Long followerId);
    
    @Query("SELECT uf FROM UserFollowing uf WHERE uf.following.id = :followingId")
    List<UserFollowing> findByFollowingId(@Param("followingId") Long followingId);
}
