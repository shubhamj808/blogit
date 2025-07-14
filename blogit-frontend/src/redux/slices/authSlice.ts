import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../api/userService';
import { UserLoginDto, UserRegistrationDto, UserResponseDto, AuthResponse } from '../../types/user';

interface AuthState {
  user: UserResponseDto | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token') && !!localStorage.getItem('userId'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: UserLoginDto, { rejectWithValue }) => {
    try {
      const response = await userService.login(credentials);
      const authResponse = response.data as AuthResponse;
      if (authResponse.token) {
        localStorage.setItem('token', authResponse.token);
      }
      return authResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: UserRegistrationDto, { rejectWithValue }) => {
    try {
      const response = await userService.register(userData);
      return response.data; // This is already the wrapped response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await userService.logout();
      localStorage.removeItem('token');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getCurrentUser();
      return response.data; // This is already the wrapped response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get current user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
        state.token = action.payload.token || null;
        if (action.payload.data && action.payload.data.id) {
          localStorage.setItem('userId', action.payload.data.id);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data || null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('userId');
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data || null;
        state.isAuthenticated = true;
        if (action.payload.data?.id) {
          localStorage.setItem('userId', action.payload.data.id);
        }
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        localStorage.removeItem('userId');
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;