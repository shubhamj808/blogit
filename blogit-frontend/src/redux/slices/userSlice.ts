import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../api/userService';
import { UserResponseDto, UserUpdateDto } from '../../types/user';

interface UserState {
  users: UserResponseDto[];
  selectedUser: UserResponseDto | null;
  suggestedUsers: UserResponseDto[];
  searchResults: UserResponseDto[];
  followers: Record<string, UserResponseDto[]>;
  following: Record<string, UserResponseDto[]>;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  suggestedUsers: [],
  searchResults: [],
  followers: {},
  following: {},
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await userService.getUserByUsername(username);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getCurrentUser();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current user');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (data: UserUpdateDto, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  'user/deleteUserAccount',
  async (_, { rejectWithValue }) => {
    try {
      await userService.deleteAccount();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account');
    }
  }
);

export const followUser = createAsyncThunk(
  'user/followUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userService.followUser(userId);
      return { userId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to follow user');
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'user/unfollowUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userService.unfollowUser(userId);
      return { userId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unfollow user');
    }
  }
);

export const fetchUserFollowers = createAsyncThunk(
  'user/fetchUserFollowers',
  async ({ userId, page, size }: { userId: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await userService.getFollowers(userId, page, size);
      return { userId, followers: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch followers');
    }
  }
);

export const fetchUserFollowing = createAsyncThunk(
  'user/fetchUserFollowing',
  async ({ userId, page, size }: { userId: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await userService.getFollowing(userId, page, size);
      return { userId, following: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch following');
    }
  }
);

export const searchUsers = createAsyncThunk(
  'user/searchUsers',
  async ({ query, page, size }: { query: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await userService.searchUsers(query, page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search users');
    }
  }
);

export const fetchSuggestedUsers = createAsyncThunk(
  'user/fetchSuggestedUsers',
  async ({ page, size }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await userService.getSuggestedUsers(page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch suggested users');
    }
  }
);

export const togglePrivateProfile = createAsyncThunk(
  'user/togglePrivateProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.togglePrivateProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle profile privacy');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearSuggestedUsers: (state) => {
      state.suggestedUsers = [];
    },
    clearFollowers: (state, action) => {
      if (action.payload) {
        delete state.followers[action.payload];
      } else {
        state.followers = {};
      }
    },
    clearFollowing: (state, action) => {
      if (action.payload) {
        delete state.following[action.payload];
      } else {
        state.following = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        // We don't set selectedUser here as it's for viewing other profiles
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedUser && state.selectedUser.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Follow User
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.selectedUser && state.selectedUser.id === action.payload.userId) {
          state.selectedUser.followersCount += 1;
        }
      })
      // Unfollow User
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.selectedUser && state.selectedUser.id === action.payload.userId) {
          state.selectedUser.followersCount -= 1;
        }
      })
      // Fetch User Followers
      .addCase(fetchUserFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers[action.payload.userId] = action.payload.followers;
      })
      .addCase(fetchUserFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Following
      .addCase(fetchUserFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.following[action.payload.userId] = action.payload.following;
      })
      .addCase(fetchUserFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Suggested Users
      .addCase(fetchSuggestedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestedUsers = action.payload;
      })
      .addCase(fetchSuggestedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle Private Profile
      .addCase(togglePrivateProfile.fulfilled, (state, action) => {
        if (state.selectedUser) {
          state.selectedUser.isPrivate = !state.selectedUser.isPrivate;
        }
      });
  },
});

export const { 
  clearUserError, 
  clearSelectedUser, 
  clearSearchResults, 
  clearSuggestedUsers, 
  clearFollowers, 
  clearFollowing 
} = userSlice.actions;
export default userSlice.reducer;