import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { interactionService } from '../../api/interactionService';
import { CommentDto, CreateCommentRequest, UpdateCommentRequest, LikeDto, LikeStatusDto } from '../../types/interaction';

interface InteractionState {
  comments: CommentDto[];
  likes: LikeDto[];
  likeStatus: Record<string, LikeStatusDto>;
  loading: boolean;
  error: string | null;
}

const initialState: InteractionState = {
  comments: [],
  likes: [],
  likeStatus: {},
  loading: false,
  error: null,
};

export const fetchPostComments = createAsyncThunk(
  'interaction/fetchPostComments',
  async ({ postId, page, size, includeReplies, maxDepth }: { 
    postId: string; 
    page: number; 
    size: number; 
    includeReplies?: boolean; 
    maxDepth?: number 
  }, { rejectWithValue }) => {
    try {
      const response = await interactionService.getPostComments(postId, page, size, includeReplies, maxDepth);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const createComment = createAsyncThunk(
  'interaction/createComment',
  async ({ postId, comment }: { postId: string; comment: CreateCommentRequest }, { rejectWithValue }) => {
    try {
      const response = await interactionService.createComment(postId, comment);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment');
    }
  }
);

export const updateComment = createAsyncThunk(
  'interaction/updateComment',
  async ({ commentId, comment }: { commentId: string; comment: UpdateCommentRequest }, { rejectWithValue }) => {
    try {
      const response = await interactionService.updateComment(commentId, comment);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'interaction/deleteComment',
  async (commentId: string, { rejectWithValue }) => {
    try {
      await interactionService.deleteComment(commentId);
      return commentId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

export const likePost = createAsyncThunk(
  'interaction/likePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await interactionService.likePost(postId);
      // Avoid duplicate postId by extracting it from response.data if it exists there
      const { postId: responsePostId, ...restData } = response.data;
      return { postId, ...restData };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'interaction/unlikePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await interactionService.unlikePost(postId);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unlike post');
    }
  }
);

export const fetchPostLikes = createAsyncThunk(
  'interaction/fetchPostLikes',
  async ({ postId, page, size }: { postId: string; page: number; size: number }, { rejectWithValue }) => {
    try {
      const response = await interactionService.getPostLikes(postId, page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch likes');
    }
  }
);

export const checkLikeStatus = createAsyncThunk(
  'interaction/checkLikeStatus',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await interactionService.checkUserLikeStatus(postId);
      // Avoid duplicate postId by extracting it from response.data if it exists there
      const { postId: responsePostId, ...restData } = response.data;
      return { postId, ...restData };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check like status');
    }
  }
);

export const bulkCheckLikeStatus = createAsyncThunk(
  'interaction/bulkCheckLikeStatus',
  async (postIds: string[], { rejectWithValue }) => {
    try {
      const response = await interactionService.bulkCheckLikeStatus(postIds);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check like statuses');
    }
  }
);

export const likeComment = createAsyncThunk(
  'interaction/likeComment',
  async (commentId: string, { rejectWithValue }) => {
    try {
      const response = await interactionService.likeComment(commentId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like comment');
    }
  }
);

export const unlikeComment = createAsyncThunk(
  'interaction/unlikeComment',
  async (commentId: string, { rejectWithValue }) => {
    try {
      await interactionService.unlikeComment(commentId);
      return commentId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unlike comment');
    }
  }
);

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    clearInteractionError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
    },
    clearLikes: (state) => {
      state.likes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Post Comments
      .addCase(fetchPostComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = [action.payload, ...state.comments];
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Comment
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.map((comment) =>
          comment.id === action.payload.id ? action.payload : comment
        );
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter((comment) => comment.id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Like Post
      .addCase(likePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.loading = false;
        state.likeStatus[action.payload.postId] = { isLiked: true, likedAt: new Date() };
      })
      .addCase(likePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Unlike Post
      .addCase(unlikePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.loading = false;
        state.likeStatus[action.payload] = { isLiked: false };
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Post Likes
      .addCase(fetchPostLikes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostLikes.fulfilled, (state, action) => {
        state.loading = false;
        state.likes = action.payload;
      })
      .addCase(fetchPostLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Check Like Status
      .addCase(checkLikeStatus.fulfilled, (state, action) => {
        state.likeStatus[action.payload.postId] = action.payload;
      })
      // Bulk Check Like Status
      .addCase(bulkCheckLikeStatus.fulfilled, (state, action) => {
        // Merge the new like statuses with existing ones, without overwriting
        Object.entries(action.payload as Record<string, LikeStatusDto>).forEach(([postId, status]) => {
          if (!state.likeStatus[postId]) {
            state.likeStatus[postId] = status;
          }
        });
      })
      // Like Comment
      .addCase(likeComment.fulfilled, (state, action) => {
        state.comments = state.comments.map(comment => {
          if (comment.id === action.payload.id) {
            return action.payload;
          }
          return comment;
        });
      })
      // Unlike Comment
      .addCase(unlikeComment.fulfilled, (state, action) => {
        state.comments = state.comments.map(comment => {
          if (comment.id === action.payload) {
            return { ...comment, isLikedByUser: false, likeCount: comment.likeCount - 1 };
          }
          return comment;
        });
      });
  },
});

export const { clearInteractionError, clearComments, clearLikes } = interactionSlice.actions;
export default interactionSlice.reducer;