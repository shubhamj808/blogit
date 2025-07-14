import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postService } from '../../api/postService';
import { PostResponse, CreatePostRequest, UpdatePostRequest, DraftPost, PostStats } from '../../types/post';

interface PostState {
  posts: PostResponse[];
  currentPost: PostResponse | null;
  drafts: DraftPost[];
  currentDraft: DraftPost | null;
  trendingPosts: PostResponse[];
  feedPosts: PostResponse[];
  userPosts: Record<string, PostResponse[]>;
  postStats: Record<string, PostStats>;
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  currentPost: null,
  drafts: [],
  currentDraft: null,
  trendingPosts: [],
  feedPosts: [],
  userPosts: {},
  postStats: {},
  loading: false,
  error: null,
};

export const fetchFeed = createAsyncThunk(
  'post/fetchFeed',
  async ({ page, size }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await postService.getFeed(page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feed');
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'post/fetchUserPosts',
  async ({ userId, page, size }: { userId: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await postService.getUserPosts(userId, page, size);
      return { userId, posts: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user posts');
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'post/fetchPostById',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await postService.getPost(postId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch post');
    }
  }
);

export const createPost = createAsyncThunk(
  'post/createPost',
  async (post: CreatePostRequest, { rejectWithValue }) => {
    try {
      const response = await postService.createPost(post);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const updatePost = createAsyncThunk(
  'post/updatePost',
  async ({ postId, post }: { postId: string; post: UpdatePostRequest }, { rejectWithValue }) => {
    try {
      const response = await postService.updatePost(postId, post);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await postService.deletePost(postId);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

export const searchPosts = createAsyncThunk(
  'post/searchPosts',
  async ({ query, page, size }: { query: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await postService.searchPosts(query, page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search posts');
    }
  }
);

export const fetchPostsByHashtag = createAsyncThunk(
  'post/fetchPostsByHashtag',
  async ({ hashtag, page, size }: { hashtag: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await postService.getPostsByHashtag(hashtag, page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts by hashtag');
    }
  }
);

export const fetchTrendingPosts = createAsyncThunk(
  'post/fetchTrendingPosts',
  async ({ page, size }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await postService.getTrendingPosts(page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trending posts');
    }
  }
);

export const fetchPostStats = createAsyncThunk(
  'post/fetchPostStats',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await postService.getPostStats(postId);
      return { postId, stats: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch post stats');
    }
  }
);

export const updatePostVisibility = createAsyncThunk(
  'post/updatePostVisibility',
  async ({ postId, visibility }: { postId: string; visibility: string }, { rejectWithValue }) => {
    try {
      const response = await postService.updatePostVisibility(postId, visibility);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post visibility');
    }
  }
);

// Draft operations
export const saveDraft = createAsyncThunk(
  'post/saveDraft',
  async (draft: CreatePostRequest, { rejectWithValue }) => {
    try {
      const response = await postService.saveDraft(draft);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save draft');
    }
  }
);

export const fetchDrafts = createAsyncThunk(
  'post/fetchDrafts',
  async ({ page, size }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await postService.getDrafts(page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch drafts');
    }
  }
);

export const fetchDraftById = createAsyncThunk(
  'post/fetchDraftById',
  async (draftId: string, { rejectWithValue }) => {
    try {
      const response = await postService.getDraft(draftId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch draft');
    }
  }
);

export const updateDraft = createAsyncThunk(
  'post/updateDraft',
  async ({ draftId, draft }: { draftId: string; draft: UpdatePostRequest }, { rejectWithValue }) => {
    try {
      const response = await postService.updateDraft(draftId, draft);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update draft');
    }
  }
);

export const deleteDraft = createAsyncThunk(
  'post/deleteDraft',
  async (draftId: string, { rejectWithValue }) => {
    try {
      await postService.deleteDraft(draftId);
      return draftId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete draft');
    }
  }
);

export const publishDraft = createAsyncThunk(
  'post/publishDraft',
  async (draftId: string, { rejectWithValue }) => {
    try {
      const response = await postService.publishDraft(draftId);
      return { draftId, post: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to publish draft');
    }
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    clearPostError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    clearPosts: (state) => {
      state.posts = [];
    },
    clearFeedPosts: (state) => {
      state.feedPosts = [];
    },
    clearTrendingPosts: (state) => {
      state.trendingPosts = [];
    },
    clearUserPosts: (state, action) => {
      if (action.payload) {
        delete state.userPosts[action.payload];
      } else {
        state.userPosts = {};
      }
    },
    clearDrafts: (state) => {
      state.drafts = [];
    },
    clearCurrentDraft: (state) => {
      state.currentDraft = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Feed
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.feedPosts = action.payload.content || [];
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts[action.payload.userId] = action.payload.posts;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = [action.payload, ...state.posts];
        state.feedPosts = [action.payload, ...state.feedPosts];
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        );
        state.feedPosts = state.feedPosts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        );
        
        // Update in userPosts if present
        Object.keys(state.userPosts).forEach(userId => {
          state.userPosts[userId] = state.userPosts[userId].map(post => 
            post.id === action.payload.id ? action.payload : post
          );
        });
        
        if (state.currentPost && state.currentPost.id === action.payload.id) {
          state.currentPost = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        state.feedPosts = state.feedPosts.filter((post) => post.id !== action.payload);
        
        // Remove from userPosts if present
        Object.keys(state.userPosts).forEach(userId => {
          state.userPosts[userId] = state.userPosts[userId].filter(post => post.id !== action.payload);
        });
        
        if (state.currentPost && state.currentPost.id === action.payload) {
          state.currentPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Search Posts
      .addCase(searchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Posts by Hashtag
      .addCase(fetchPostsByHashtag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsByHashtag.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPostsByHashtag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Trending Posts
      .addCase(fetchTrendingPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingPosts = action.payload;
      })
      .addCase(fetchTrendingPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Post Stats
      .addCase(fetchPostStats.fulfilled, (state, action) => {
        state.postStats[action.payload.postId] = action.payload.stats;
      })
      // Update Post Visibility
      .addCase(updatePostVisibility.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        state.posts = state.posts.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        );
        state.feedPosts = state.feedPosts.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        );
        if (state.currentPost && state.currentPost.id === updatedPost.id) {
          state.currentPost = updatedPost;
        }
      })
      // Save Draft
      .addCase(saveDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.drafts = [action.payload, ...state.drafts];
      })
      .addCase(saveDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Drafts
      .addCase(fetchDrafts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrafts.fulfilled, (state, action) => {
        state.loading = false;
        state.drafts = action.payload;
      })
      .addCase(fetchDrafts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Draft by ID
      .addCase(fetchDraftById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDraftById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDraft = action.payload;
      })
      .addCase(fetchDraftById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Draft
      .addCase(updateDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.drafts = state.drafts.map(draft => 
          draft.id === action.payload.id ? action.payload : draft
        );
        if (state.currentDraft && state.currentDraft.id === action.payload.id) {
          state.currentDraft = action.payload;
        }
      })
      .addCase(updateDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Draft
      .addCase(deleteDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.drafts = state.drafts.filter(draft => draft.id !== action.payload);
        if (state.currentDraft && state.currentDraft.id === action.payload) {
          state.currentDraft = null;
        }
      })
      .addCase(deleteDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Publish Draft
      .addCase(publishDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.drafts = state.drafts.filter(draft => draft.id !== action.payload.draftId);
        state.posts = [action.payload.post, ...state.posts];
        state.feedPosts = [action.payload.post, ...state.feedPosts];
        if (state.currentDraft && state.currentDraft.id === action.payload.draftId) {
          state.currentDraft = null;
        }
      })
      .addCase(publishDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearPostError, 
  clearCurrentPost, 
  clearPosts, 
  clearFeedPosts, 
  clearTrendingPosts, 
  clearUserPosts, 
  clearDrafts, 
  clearCurrentDraft 
} = postSlice.actions;
export default postSlice.reducer;