import api from './axiosConfig';
import { UserRegistrationDto, UserLoginDto, UserUpdateDto, UserResponseDto, AuthResponse, ApiResponse } from '../types/user';

const BASE_PATH = import.meta.env.VITE_USER_SERVICE_PATH || '/api/v1/users';

export const userService = {
  // Authentication
  register: (data: UserRegistrationDto) =>
    api.post<ApiResponse<UserResponseDto>>(`${BASE_PATH}/register`, data),

  login: (data: UserLoginDto) =>
    api.post<AuthResponse>(`${BASE_PATH}/login`, data),

  logout: () =>
    api.post(`${BASE_PATH}/logout`),

  // Profile Management
  getCurrentUser: () =>
    api.get<ApiResponse<UserResponseDto>>(`${BASE_PATH}/me`),

  getUserByUsername: (username: string) =>
    api.get<UserResponseDto>(`${BASE_PATH}/${username}`),

  updateProfile: (data: UserUpdateDto) =>
    api.put<UserResponseDto>(`${BASE_PATH}/me`, data),

  deleteAccount: () =>
    api.delete(`${BASE_PATH}/me`),

  // Follow Management
  followUser: (userId: string) =>
    api.post(`${BASE_PATH}/follow/${userId}`),

  unfollowUser: (userId: string) =>
    api.delete(`${BASE_PATH}/follow/${userId}`),

  getFollowers: (userId: string, page = 0, size = 10) =>
    api.get(`${BASE_PATH}/${userId}/followers`, { params: { page, size } }),

  getFollowing: (userId: string, page = 0, size = 10) =>
    api.get(`${BASE_PATH}/${userId}/following`, { params: { page, size } }),

  // Search
  searchUsers: (query: string, page = 0, size = 10) =>
    api.get(`${BASE_PATH}/search`, { params: { query, page, size } }),

  // User Suggestions
  getSuggestedUsers: (page = 0, size = 10) =>
    api.get(`${BASE_PATH}/suggestions`, { params: { page, size } }),

  // Email & Password Management
  verifyEmail: (token: string) =>
    api.post(`${BASE_PATH}/verify-email`, { token }),

  requestPasswordReset: (email: string) =>
    api.post(`${BASE_PATH}/password/reset-request`, { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post(`${BASE_PATH}/password/reset`, { token, newPassword }),

  updatePassword: (oldPassword: string, newPassword: string) =>
    api.put(`${BASE_PATH}/me/password`, { oldPassword, newPassword }),

  updateEmail: (newEmail: string) =>
    api.put(`${BASE_PATH}/me/email`, { newEmail }),

  // Privacy Settings
  togglePrivateProfile: () =>
    api.put(`${BASE_PATH}/me/privacy`),
};