import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Post } from '../types/post';
import { getPosts } from '../api/postService';
import PostCard from '../components/post/PostCard';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const fetchPosts = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await getPosts(pageNum);
      if (pageNum === 1) {
        setPosts(response.data);
      } else {
        setPosts(prev => [...prev, ...response.data]);
      }
      setHasMore(response.data.length === 10); // Assuming page size is 10
      setError(null);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
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
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, liked, likeCount: liked ? post.likeCount + 1 : post.likeCount - 1 }
          : post
      )
    );
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
    <div className="space-y-6">
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