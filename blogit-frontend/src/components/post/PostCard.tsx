import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { PostResponse } from '../../types/post';
import { formatDistanceToNow } from 'date-fns';
import { interactionService } from '../../api/interactionService';

interface PostCardProps {
  post: PostResponse;
  onLikeUpdate?: (postId: string, liked: boolean) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLikeUpdate }) => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likesCount || 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeClick = async () => {
    if (!isAuthenticated || isLoading) return;

    setIsLoading(true);
    try {
      if (isLiked) {
        await interactionService.unlikePost(post.id);
        setLikeCount(prev => prev - 1);
      } else {
        await interactionService.likePost(post.id);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
      onLikeUpdate?.(post.id, !isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center">
          {post.author ? (
            <Link to={`/profile/${post.author.id}`} className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl text-gray-600">
                  {post.author.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{post.author.username}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl text-gray-600">U</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Unknown User</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          )}
        </div>
        <Link to={`/post/${post.id}`}>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">{post.title}</h2>
          <p className="mt-2 text-gray-600">{post.content}</p>
        </Link>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLikeClick}
              disabled={!isAuthenticated || isLoading}
              className={`flex items-center space-x-2 ${
                isAuthenticated ? 'hover:text-indigo-600' : 'cursor-not-allowed'
              } ${isLiked ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              <svg
                className="h-5 w-5"
                fill={isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{likeCount}</span>
            </button>
            <Link
              to={`/post/${post.id}`}
              className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{post.commentsCount || 0}</span>
            </Link>
          </div>
          {user?.id && post.author && user.id === post.author.id && (
            <Link
              to={`/post/edit/${post.id}`}
              className="text-sm text-gray-500 hover:text-indigo-600"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;