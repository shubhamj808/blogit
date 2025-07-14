export interface UserRegistrationDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  dateOfBirth?: Date;
  acceptTerms: boolean;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePictureUrl?: string;
}

export interface UserLoginDto {
  usernameOrEmail: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserUpdateDto {
  fullName?: string;
  email?: string;
  bio?: string;
  location?: string;
  website?: string;
  dateOfBirth?: Date;
  profileImage?: string;
  coverImage?: string;
  isPrivate?: boolean;
}

export interface AuthResponse {
  success: boolean;
  data: UserResponseDto;
  message?: string;
  timestamp?: string;
  token?: string;
}

export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  fullName: string;
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  dateOfBirth?: Date;
  isVerified: boolean;
  isActive: boolean;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  likesCount: number;
  lastActive?: Date;
  joinedAt: Date;
  isFollowedByCurrentUser?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    path: string;
  };
  pagination?: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
  token?: string;
}