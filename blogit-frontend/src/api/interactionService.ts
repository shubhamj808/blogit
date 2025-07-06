import api from './axiosConfig';
import { CreateCommentRequest, UpdateCommentRequest, CommentDto, LikeDto } from '@/types/interaction';

const BASE_PATH = import.meta.env.VITE_INTERACTION_SERVICE_PATH || '/api/interactions';

export const interactionService = {
  // Comment Operations
  createComment: (postId: string, data: CreateCommentRequest) =>
    api.post<CommentDto>(`${BASE_PATH}/posts/${postId}/comments`, data),

  getPostComments: (postId: string, page = 0, size = 20, includeReplies = true, maxDepth = 3) =>
    api.get(`${BASE_PATH}/posts/${postId}/comments`, {
      params: { page, size, includeReplies, maxDepth }
    }),

  updateComment: (commentId: string, data: UpdateCommentRequest) =>
    api.put<CommentDto>(`${BASE_PATH}/comments/${commentId}`, data),

  deleteComment: (commentId: string) =>
    api.delete(`${BASE_PATH}/comments/${commentId}`),

  // Like Operations
  likePost: (postId: string) =>
    api.post<LikeDto>(`${BASE_PATH}/posts/${postId}/likes`),

  unlikePost: (postId: string) =>
    api.delete(`${BASE_PATH}/posts/${postId}/likes`),

  getPostLikes: (postId: string, page = 0, size = 20) =>
    api.get(`${BASE_PATH}/posts/${postId}/likes`, {
      params: { page, size }
    }),

  checkUserLikeStatus: (postId: string) =>
    api.get(`${BASE_PATH}/posts/${postId}/likes/check`),

  bulkCheckLikeStatus: (postIds: string[]) =>
    api.post(`${BASE_PATH}/posts/likes/bulk-check`, { postIds }),

  // Comment Like Operations
  likeComment: (commentId: string) =>
    api.post<CommentDto>(`${BASE_PATH}/comments/${commentId}/likes`),

  unlikeComment: (commentId: string) =>
    api.delete(`${BASE_PATH}/comments/${commentId}/likes`),

  // User Interactions
  getUserComments: (userId: string, page = 0, size = 20) =>
    api.get(`${BASE_PATH}/users/${userId}/comments`, {
      params: { page, size }
    }),

  getUserLikes: (userId: string, page = 0, size = 20) =>
    api.get(`${BASE_PATH}/users/${userId}/likes`, {
      params: { page, size }
    }),
}; 