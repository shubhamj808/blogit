import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { postService } from '../api/postService';
import { CreatePostRequest, PostVisibility } from '../types/post';
import { addNotification } from '../redux/slices/uiSlice';
import { createNotification } from '../utils/notification';
import { useAppSelector } from '../redux/hooks';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAppSelector(state => state.auth);

  const [formData, setFormData] = useState<CreatePostRequest>({
    title: '',
    content: '',
    visibility: PostVisibility.PUBLIC,
    hashtags: [],
    mediaUrls: []
  });

  const [hashtagInput, setHashtagInput] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      e.preventDefault();
      const hashtag = hashtagInput.trim().startsWith('#') ? hashtagInput.trim() : `#${hashtagInput.trim()}`;
      setFormData(prev => ({
        ...prev,
        hashtags: [...(prev.hashtags || []), hashtag]
      }));
      setHashtagInput('');
    }
  };

  const handleMediaUrlKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && mediaUrlInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        mediaUrls: [...(prev.mediaUrls || []), mediaUrlInput.trim()]
      }));
      setMediaUrlInput('');
    }
  };

  const removeHashtag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags?.filter((_, i) => i !== index)
    }));
  };

  const removeMediaUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user?.id) {
        dispatch(addNotification(createNotification('error', 'Please log in to create a post')));
        navigate('/login');
        return;
      }
      await postService.createPost(formData);
      dispatch(addNotification(createNotification('success', 'Post created successfully!')));
      navigate('/feed');
    } catch (error: any) {
      const errorMessage = error.message === 'Invalid user ID format' 
        ? 'Invalid user ID format. Please try logging out and back in.'
        : 'Failed to create post. Please try again.';
      dispatch(addNotification(createNotification('error', errorMessage)));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
            maxLength={500}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 min-h-[200px]"
            required
            maxLength={5000}
          />
        </div>

        <div>
          <label htmlFor="visibility" className="block text-sm font-medium mb-2">
            Visibility
          </label>
          <select
            id="visibility"
            name="visibility"
            value={formData.visibility}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value={PostVisibility.PUBLIC}>Public</option>
            <option value={PostVisibility.FOLLOWERS_ONLY}>Followers Only</option>
            <option value={PostVisibility.PRIVATE}>Private</option>
          </select>
        </div>

        <div>
          <label htmlFor="hashtags" className="block text-sm font-medium mb-2">
            Hashtags
          </label>
          <input
            type="text"
            id="hashtags"
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            onKeyDown={handleHashtagKeyDown}
            placeholder="Type hashtag and press Enter"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.hashtags?.map((hashtag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center gap-2"
              >
                {hashtag}
                <button
                  type="button"
                  onClick={() => removeHashtag(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="mediaUrls" className="block text-sm font-medium mb-2">
            Media URLs
          </label>
          <input
            type="url"
            id="mediaUrls"
            value={mediaUrlInput}
            onChange={(e) => setMediaUrlInput(e.target.value)}
            onKeyDown={handleMediaUrlKeyDown}
            placeholder="Enter media URL and press Enter"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 space-y-2">
            {formData.mediaUrls?.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 truncate"
                >
                  {url}
                </a>
                <button
                  type="button"
                  onClick={() => removeMediaUrl(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Create Post
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost; 