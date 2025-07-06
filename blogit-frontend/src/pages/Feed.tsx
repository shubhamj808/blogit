import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { fetchFeed } from '../redux/slices/postSlice';
import PostCard from '../components/post/PostCard';

const Feed: React.FC = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { feedPosts: posts, loading, error } = useAppSelector(state => state.post);

  const fetchPosts = async (pageNum: number) => {
    try {
      const result = await dispatch(fetchFeed({ page: pageNum - 1, size: 10 })).unwrap(); // Convert to 0-indexed for API
      setHasMore(result.length === 10); // Assuming page size is 10
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, [isAuthenticated]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  const handleLikeUpdate = (postId: string, liked: boolean) => {
    // This will be handled by the Redux state when we implement the like functionality
    // The post state will be updated through the Redux store
    console.log('Post liked/unliked:', postId, liked);
  };

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchPosts(1)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 space-y-6">
      {posts.map(post => (
        <PostCard key={post.id} post={post} onLikeUpdate={handleLikeUpdate} />
      ))}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
        </div>
      )}
      {!loading && hasMore && (
        <div className="text-center py-4">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
          >
            Load More
          </button>
        </div>
      )}
      {!loading && !hasMore && posts.length > 0 && (
        <p className="text-center text-gray-500 py-4">No more posts to load</p>
      )}
      {!loading && posts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No posts found</p>
        </div>
      )}
    </div>
  );
};

export default Feed;