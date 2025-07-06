export interface CreateCommentRequest {
  content: string;
  parentCommentId?: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface CommentDto {
  id: string;
  postId: string;
  parentCommentId?: string;
  content: string;
  likeCount: number;
  replyCount: number;
  isLikedByUser: boolean;
  isActive: boolean;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: UserAuthorDto;
  replies: CommentDto[];
}

export interface LikeDto {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userProfileImage?: string;
  createdAt: Date;
}

export interface LikeStatusDto {
  isLiked: boolean;
  likedAt?: Date;
}

export interface BulkLikeCheckRequest {
  postIds: string[];
}

export interface UserAuthorDto {
  id: string;
  username: string;
  fullName: string;
  profileImage?: string;
}

export interface PaginationDto {
  page: number;
  size: number;
  total: number;
  totalPages: number;
} 