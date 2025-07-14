import api from './axiosConfig';
import { CreatePostRequest, UpdatePostRequest, PostResponse } from '../types/post';

const BASE_PATH = import.meta.env.VITE_POST_SERVICE_PATH || '/api/v1/posts';

export const postService = {
  // Post CRUD Operations
  createPost: (data: CreatePostRequest) =>
    api.post<PostResponse>(`${BASE_PATH}`, data),

  getPost: (postId: string) =>
    api.get<PostResponse>(`${BASE_PATH}/${postId}`),

  updatePost: (postId: string, data: UpdatePostRequest) =>
    api.put<PostResponse>(`${BASE_PATH}/${postId}`, data),

  deletePost: (postId: string) =>
    api.delete(`${BASE_PATH}/${postId}`),

  // Feed and Timeline
  getFeed: (page = 0, size = 10) =>
    api.get(`${BASE_PATH}/feed`, { params: { page, size } }),

  getUserPosts: (userId: string, page = 0, size = 10) =>
    api.get(`${BASE_PATH}/user/${userId}`, { params: { page, size } }),

  // Search and Discovery
  searchPosts: (query: string, page = 0, size = 10) =>
    api.get(`${BASE_PATH}/search`, { params: { query, page, size } }),

  getPostsByHashtag: (hashtag: string, page = 0, size = 10) =>
    api.get(`${BASE_PATH}/hashtag/${hashtag}`, { params: { page, size } }),

  getTrendingPosts: (page = 0, size = 10) =>
    api.get(`${BASE_PATH}/trending`, { params: { page, size } }),

  // Post Statistics
  getPostStats: (postId: string) =>
    api.get(`${BASE_PATH}/${postId}/stats`),

  // Post Visibility
  updatePostVisibility: (postId: string, visibility: string) =>
    api.put(`${BASE_PATH}/${postId}/visibility`, { visibility }),

  // Draft Management
  saveDraft: (data: CreatePostRequest) =>
    api.post(`${BASE_PATH}/drafts`, data),

  getDrafts: (page = 0, size = 10) =>
    api.get(`${BASE_PATH}/drafts`, { params: { page, size } }),

  getDraft: (draftId: string) =>
    api.get(`${BASE_PATH}/drafts/${draftId}`),

  updateDraft: (draftId: string, data: UpdatePostRequest) =>
    api.put(`${BASE_PATH}/drafts/${draftId}`, data),

  deleteDraft: (draftId: string) =>
    api.delete(`${BASE_PATH}/drafts/${draftId}`),

  publishDraft: (draftId: string) =>
    api.post(`${BASE_PATH}/drafts/${draftId}/publish`),
};