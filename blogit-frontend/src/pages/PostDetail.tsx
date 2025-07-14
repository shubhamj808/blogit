import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchPostById } from '../redux/slices/postSlice';
import { postService } from '../api/postService';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentPost, loading, error } = useAppSelector(state => state.post);
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
    }
  }, [dispatch, id]);

  const handleEdit = () => {
    navigate(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id || !user?.id) {
      return;
    }

    try {
      await postService.deletePost(id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentPost) {
    return <div>Post not found</div>;
  }

  const isAuthor = user?.id === currentPost.userId;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{currentPost.title}</h1>
        
        <div className="mb-4 text-gray-600">
          <span>By {currentPost.author?.username || 'Unknown'}</span>
          <span className="mx-2">•</span>
          <span>{new Date(currentPost.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="prose max-w-none mb-6">
          {currentPost.content}
        </div>

        {currentPost.hashtags && currentPost.hashtags.length > 0 && (
          <div className="mb-6">
            {currentPost.hashtags.map((hashtag: string, index: number) => (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
              >
                {hashtag}
              </span>
            ))}
          </div>
        )}

        {isAuthor && (
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleEdit}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail; 