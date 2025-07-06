export interface CreatePostRequest {
  title: string;
  content: string;
  visibility: PostVisibility;
  hashtags?: string[];
  mediaUrls?: string[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  visibility?: PostVisibility;
  hashtags?: string[];
  mediaUrls?: string[];
}

export interface PostResponse {
  id: string;
  userId: string;
  title: string;
  content: string;
  visibility: PostVisibility;
  hashtags: string[];
  mediaUrls: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: string;
    username: string;
    fullName: string;
    profileImage?: string;
  };
  isLiked?: boolean;
}

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  FOLLOWERS_ONLY = 'FOLLOWERS_ONLY',
  PRIVATE = 'PRIVATE'
}

export interface PostStats {
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  engagementRate: number;
}

export interface DraftPost extends CreatePostRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
} 