import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchUserProfile, followUser, unfollowUser } from '../redux/slices/userSlice';
import { fetchUserPosts } from '../redux/slices/postSlice';
import PostCard from '../components/post/PostCard';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const dispatch = useAppDispatch();
  const { user: currentUser, isAuthenticated } = useAppSelector(state => state.auth);
  const { selectedUser, loading, error } = useAppSelector(state => state.user);
  const { userPosts } = useAppSelector(state => state.post);
  
  const [isFollowing, setIsFollowing] = useState(false);
  const profileUser = selectedUser;
  const posts = userPosts[profileUser?.id || ''] || [];
  const followersCount = profileUser?.followersCount || 0;
  const followingCount = profileUser?.followingCount || 0;
  const postsCount = posts.length;

  useEffect(() => {
    // If no username is provided, show current user's profile
    const targetUsername = username || (currentUser?.username as string);
    
    if (!targetUsername) return;

    // Fetch user profile
    dispatch(fetchUserProfile(targetUsername));
  }, [username, currentUser, dispatch]);

  useEffect(() => {
    if (profileUser?.id) {
      // Fetch user's posts
      dispatch(fetchUserPosts({ userId: profileUser.id }));

      // Check if current user is following this profile
      if (isAuthenticated && currentUser?.id !== profileUser.id) {
        // This would ideally be handled by a dedicated API call or state
        // For now, we'll use the local state
        setIsFollowing(profileUser.isFollowedByCurrentUser || false);
      }
    }
  }, [profileUser?.id, currentUser?.id, isAuthenticated, dispatch]);

  const handleFollow = async () => {
    if (!isAuthenticated || !profileUser) return;

    try {
      if (isFollowing) {
        await dispatch(unfollowUser(profileUser.id));
      } else {
        await dispatch(followUser(profileUser.id));
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error || 'User not found'}</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Return to Home
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-4xl text-indigo-700 font-bold mb-4 sm:mb-0">
                {profileUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{profileUser.fullName || profileUser.username}</h1>
                <p className="text-sm text-gray-500">@{profileUser.username}</p>
                {profileUser.bio && <p className="mt-2 text-gray-700">{profileUser.bio}</p>}
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4">
                  <div className="text-center">
                    <span className="block font-semibold">{postsCount}</span>
                    <span className="text-sm text-gray-500">Posts</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-semibold">{followersCount}</span>
                    <span className="text-sm text-gray-500">Followers</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-semibold">{followingCount}</span>
                    <span className="text-sm text-gray-500">Following</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-auto">
                {isAuthenticated && !isOwnProfile ? (
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-2 rounded-md ${isFollowing
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                ) : isOwnProfile ? (
                  <Link
                    to="/settings/profile"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Edit Profile
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <a
                href="#"
                className="w-1/3 py-4 px-1 text-center border-b-2 border-indigo-500 font-medium text-sm text-indigo-600"
              >
                Posts
              </a>
              <a
                href="#"
                className="w-1/3 py-4 px-1 text-center border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Likes
              </a>
              <a
                href="#"
                className="w-1/3 py-4 px-1 text-center border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Media
              </a>
            </nav>
          </div>

          {/* Posts */}
          <div className="p-4 sm:p-6">
            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No posts yet</p>
                {isOwnProfile && (
                  <Link
                    to="/create"
                    className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Create your first post
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;