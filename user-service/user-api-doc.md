# User Service REST API Documentation

## Service Overview

The User Service is the core authentication and user management service for the Blogit platform. It provides comprehensive functionality for user lifecycle management, authentication, profile management, and social relationships. Through secure JWT-based authentication and real-time event integration, it ensures a seamless and secure user experience across the platform.

**Base URL**: `/api/v1/users`  
**Service Port**: 8081  
**Database**: PostgreSQL (`blogit_user_db`)  
**Message Queue**: Apache Kafka  
**Cache**: Redis

### Key Capabilities
- **User Authentication**: Secure registration, login, and JWT-based session management
- **Profile Management**: Comprehensive user profile and preference management
- **Social Relationships**: Following/followers system with real-time updates
- **User Discovery**: Advanced search and personalized suggestions
- **Account Security**: Password management, email verification, and account protection
- **Service Integration**: Internal APIs for microservice communication
- **Event-Driven Architecture**: Real-time event publishing for platform-wide synchronization

## Table of Contents

1. [API Structure & Standards](#api-structure--standards)
2. [Core Features](#core-features)
3. [Data Models](#data-models)
4. [Authentication & Security](#authentication--security)
5. [REST API Endpoints](#rest-api-endpoints)
6. [Event System](#event-system)
7. [Service Integrations](#service-integrations)
8. [Error Handling](#error-handling)
9. [Rate Limiting](#rate-limiting)
10. [Infrastructure & Performance](#infrastructure--performance)
11. [Monitoring & Logging](#monitoring--logging)
12. [Development & Testing](#development--testing)
13. [Deployment & Configuration](#deployment--configuration)
14. [Security Considerations](#security-considerations)
15. [Troubleshooting](#troubleshooting)

## API Structure & Standards

### URL Structure
```
/api/v1/users/{resource}/{action}
```

### HTTP Methods
- **GET**: Retrieve user information and lists
- **POST**: Create new users, authentication, and actions
- **PUT**: Update complete user profiles
- **PATCH**: Partially update user attributes
- **DELETE**: Deactivate or delete user data

### Response Formats
All API responses follow a consistent JSON structure for both success and error cases.

**Success Response Format**:
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2025-07-04T10:30:00Z",
  "pagination": {
    "page": 0,
    "size": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Error Response Format**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": ["Field 'email' must be valid"],
    "timestamp": "2025-07-04T10:30:00Z",
    "path": "/api/v1/users/register"
  }
}
```

### Request Headers
```
Content-Type: application/json
Authorization: Bearer {jwt-token}
X-Request-ID: {unique-request-id}
```

## Core Features

### 1. User Lifecycle Management
The User Service manages the complete user lifecycle from registration to account deactivation. It provides secure registration with email verification, comprehensive profile management, and graceful account deactivation with data retention policies.

**Key Features**:
- User registration with email verification
- Profile creation and management
- Account preferences and privacy settings
- Account deactivation and reactivation
- Data export and deletion (GDPR compliance)

### 2. Authentication & Authorization
Robust authentication system built on JWT tokens with comprehensive security measures. The service provides secure login/logout, token refresh mechanisms, and multi-factor authentication support.

**Security Features**:
- JWT-based authentication with secure token generation
- Password hashing using BCrypt with 12 salt rounds
- Account lockout protection after failed attempts
- Session management with token refresh
- Password reset with secure token verification

### 3. Social Relationship Management
Comprehensive social networking features enabling users to connect and interact. The service manages following relationships, provides follower analytics, and supports privacy controls.

**Social Features**:
- Follow/unfollow functionality
- Followers and following lists with pagination
- Mutual connection discovery
- Privacy controls for follower visibility
- Social analytics and insights

### 4. User Discovery & Search
Advanced search capabilities with personalized recommendations. The service provides intelligent user suggestions based on social connections, interests, and activity patterns.

**Discovery Features**:
- Full-text search across usernames, names, and bios
- Personalized user suggestions
- Mutual connection-based recommendations
- Search result ranking and filtering
- Search history and trending users

### 5. Profile Management
Comprehensive profile management with rich user data support. Users can customize their profiles with images, bio, preferences, and privacy settings.

**Profile Features**:
- Profile and cover image management
- Bio and personal information
- Location and website links
- Notification preferences
- Privacy settings and controls
- Activity tracking and analytics

### 6. Service Integration
Internal APIs for seamless integration with other microservices. The service provides bulk operations, validation endpoints, and real-time event publishing.

**Integration Features**:
- Internal service authentication
- Bulk user profile retrieval
- User validation and status checks
- Real-time event publishing
- Service-to-service communication

## Data Models

### User Entity
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "profileImage": "https://cdn.example.com/profiles/johndoe.jpg",
  "coverImage": "https://cdn.example.com/covers/johndoe.jpg",
  "bio": "Software developer passionate about technology",
  "location": "San Francisco, CA",
  "website": "https://johndoe.dev",
  "dateOfBirth": "1990-01-15",
  "joinedAt": "2024-01-15T10:00:00Z",
  "lastActive": "2025-07-04T10:25:00Z",
  "isVerified": true,
  "isActive": true,
  "isPrivate": false,
  "followersCount": 150,
  "followingCount": 89,
  "postsCount": 42,
  "likesCount": 1250,
  "preferences": {
    "notifications": {
      "email": true,
      "push": true,
      "likes": true,
      "comments": true,
      "follows": true
    },
    "privacy": {
      "showEmail": false,
      "showDateOfBirth": false,
      "allowDirectMessages": true
    }
  }
}
```

### Follow Relationship
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "followerId": "550e8400-e29b-41d4-a716-446655440001",
  "followingId": "550e8400-e29b-41d4-a716-446655440002",
  "createdAt": "2025-07-04T10:30:00Z",
  "status": "ACTIVE"
}
```

### Authentication Response
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "profileImage": "https://cdn.example.com/profiles/johndoe.jpg",
    "isVerified": true,
    "followersCount": 150,
    "followingCount": 89,
    "postsCount": 42
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440001",
  "expiresAt": "2025-07-04T18:30:00Z"
}
```

## Authentication & Security

### JWT Token Structure
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe",
  "email": "john@example.com",
  "roles": ["USER"],
  "iat": 1625097600,
  "exp": 1625184000
}
```

### Authorization Levels
- **PUBLIC**: Accessible without authentication
- **USER**: Requires valid JWT token
- **ADMIN**: Requires admin role in token
- **INTERNAL**: Requires internal service authentication

### Security Headers
```
Authorization: Bearer {jwt-token}
Content-Type: application/json
X-Request-ID: {unique-request-id}
X-Service-Name: {service-name} (for internal APIs)
X-Service-Token: {internal-service-token} (for internal APIs)
```

### Password Security
- BCrypt hashing with salt rounds: 12
- Password policy: 8+ characters, mixed case, numbers, symbols
- Account lockout after 5 failed attempts
- Password reset with secure token verification
- Password history to prevent reuse

## REST API Endpoints

This section provides detailed specifications for all API endpoints, including request/response formats, authentication requirements, and error handling.

### 1. User Registration & Authentication

#### 1.1 User Registration
**Endpoint**: `POST /api/v1/users/register`  
**Authorization**: Public  
**Rate Limit**: 5 requests per minute per IP

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15",
  "acceptTerms": true
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "isVerified": false,
      "joinedAt": "2025-07-04T10:30:00Z"
    },
    "verificationRequired": true
  },
  "message": "User registered successfully. Please verify your email."
}
```

**Error Responses**:
- `400`: Validation errors (duplicate username/email, invalid password)
- `429`: Rate limit exceeded
- `500`: Internal server error

#### 1.2 User Login
**Endpoint**: `POST /api/v1/users/login`  
**Authorization**: Public  
**Rate Limit**: 10 requests per minute per IP

**Request Body**:
```json
{
  "emailOrUsername": "john@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "profileImage": "https://cdn.example.com/profiles/johndoe.jpg",
      "isVerified": true,
      "followersCount": 150,
      "followingCount": 89,
      "postsCount": 42
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440001",
    "expiresAt": "2025-07-04T18:30:00Z"
  },
  "message": "Login successful"
}
```

**Error Responses**:
- `400`: Invalid credentials
- `401`: Account locked or unverified
- `429`: Rate limit exceeded

#### 1.3 Token Refresh
**Endpoint**: `POST /api/v1/users/refresh`  
**Authorization**: Public  
**Rate Limit**: 20 requests per minute per user

**Request Body**:
```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440002",
    "expiresAt": "2025-07-04T18:30:00Z"
  },
  "message": "Token refreshed successfully"
}
```

#### 1.4 User Logout
**Endpoint**: `POST /api/v1/users/logout`  
**Authorization**: Bearer Token  
**Rate Limit**: 30 requests per minute per user

**Request Body**:
```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 2. User Profile Management

#### 2.1 Get User Profile
**Endpoint**: `GET /api/v1/users/{userId}`  
**Authorization**: Public (limited data) / Bearer Token (full data)  
**Rate Limit**: 100 requests per minute per user

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johndoe",
      "fullName": "John Doe",
      "profileImage": "https://cdn.example.com/profiles/johndoe.jpg",
      "coverImage": "https://cdn.example.com/covers/johndoe.jpg",
      "bio": "Software developer passionate about technology",
      "location": "San Francisco, CA",
      "website": "https://johndoe.dev",
      "isVerified": true,
      "isFollowing": false,
      "isFollowedBy": false,
      "joinedAt": "2024-01-15T10:00:00Z",
      "followersCount": 150,
      "followingCount": 89,
      "postsCount": 42,
      "likesCount": 1250
    }
  }
}
```

#### 2.2 Update User Profile
**Endpoint**: `PUT /api/v1/users/{userId}`  
**Authorization**: Bearer Token (own profile or admin)  
**Rate Limit**: 20 requests per minute per user

**Request Body**:
```json
{
  "fullName": "John Doe Updated",
  "bio": "Updated bio text",
  "location": "New York, NY",
  "website": "https://johndoe.com",
  "profileImage": "https://cdn.example.com/profiles/johndoe-new.jpg",
  "coverImage": "https://cdn.example.com/covers/johndoe-new.jpg",
  "isPrivate": false,
  "preferences": {
    "notifications": {
      "email": true,
      "push": false,
      "likes": true,
      "comments": true,
      "follows": true
    },
    "privacy": {
      "showEmail": false,
      "showDateOfBirth": false,
      "allowDirectMessages": true
    }
  }
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johndoe",
      "fullName": "John Doe Updated",
      "bio": "Updated bio text",
      "location": "New York, NY",
      "website": "https://johndoe.com",
      "profileImage": "https://cdn.example.com/profiles/johndoe-new.jpg",
      "coverImage": "https://cdn.example.com/covers/johndoe-new.jpg",
      "isPrivate": false,
      "updatedAt": "2025-07-04T10:30:00Z"
    }
  },
  "message": "Profile updated successfully"
}
```

### 3. Social Relationships

#### 3.1 Follow User
**Endpoint**: `POST /api/v1/users/{userId}/follow`  
**Authorization**: Bearer Token  
**Rate Limit**: 50 requests per minute per user

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "following": true,
    "followersCount": 151,
    "followingCount": 90
  },
  "message": "User followed successfully"
}
```

#### 3.2 Unfollow User
**Endpoint**: `DELETE /api/v1/users/{userId}/follow`  
**Authorization**: Bearer Token  
**Rate Limit**: 50 requests per minute per user

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "following": false,
    "followersCount": 149,
    "followingCount": 88
  },
  "message": "User unfollowed successfully"
}
```

#### 3.3 Get Followers
**Endpoint**: `GET /api/v1/users/{userId}/followers`  
**Authorization**: Public (if profile is public) / Bearer Token  
**Rate Limit**: 60 requests per minute per user

**Query Parameters**:
- `page`: Page number (default: 0)
- `size`: Page size (default: 20, max: 100)
- `sort`: Sort order (followers, recent) (default: recent)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "followers": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "username": "jane_smith",
        "fullName": "Jane Smith",
        "profileImage": "https://cdn.example.com/profiles/jane.jpg",
        "isVerified": true,
        "isFollowing": false,
        "isFollowedBy": true,
        "followedAt": "2025-06-15T14:20:00Z"
      }
    ],
    "mutualCount": 5
  },
  "pagination": {
    "page": 0,
    "size": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### 3.4 Get Following
**Endpoint**: `GET /api/v1/users/{userId}/following`  
**Authorization**: Public (if profile is public) / Bearer Token  
**Rate Limit**: 60 requests per minute per user

**Query Parameters**:
- `page`: Page number (default: 0)
- `size`: Page size (default: 20, max: 100)
- `sort`: Sort order (following, recent) (default: recent)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "following": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "username": "tech_guru",
        "fullName": "Tech Guru",
        "profileImage": "https://cdn.example.com/profiles/tech.jpg",
        "isVerified": true,
        "isFollowing": true,
        "isFollowedBy": false,
        "followedAt": "2025-05-20T09:15:00Z"
      }
    ],
    "mutualCount": 3
  },
  "pagination": {
    "page": 0,
    "size": 20,
    "total": 89,
    "totalPages": 5
  }
}
```

### 4. User Search & Discovery

#### 4.1 Search Users
**Endpoint**: `GET /api/v1/users/search`  
**Authorization**: Bearer Token  
**Rate Limit**: 30 requests per minute per user

**Query Parameters**:
- `q`: Search query (username, name, bio)
- `page`: Page number (default: 0)
- `size`: Page size (default: 20, max: 50)
- `sort`: Sort order (relevance, followers, recent) (default: relevance)
- `verified`: Filter by verified users (true/false)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "username": "john_dev",
        "fullName": "John Developer",
        "profileImage": "https://cdn.example.com/profiles/john_dev.jpg",
        "bio": "Full-stack developer",
        "isVerified": true,
        "isFollowing": false,
        "isFollowedBy": false,
        "followersCount": 1250,
        "mutualFollowersCount": 3,
        "relevanceScore": 0.95
      }
    ],
    "totalResults": 45,
    "searchTime": "12ms"
  },
  "pagination": {
    "page": 0,
    "size": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

#### 4.2 Get User Suggestions
**Endpoint**: `GET /api/v1/users/suggestions`  
**Authorization**: Bearer Token  
**Rate Limit**: 20 requests per minute per user

**Query Parameters**:
- `type`: Suggestion type (mutual, popular, recent) (default: mutual)
- `size`: Number of suggestions (default: 10, max: 50)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "username": "design_pro",
        "fullName": "Design Pro",
        "profileImage": "https://cdn.example.com/profiles/design.jpg",
        "bio": "UI/UX Designer",
        "isVerified": false,
        "followersCount": 892,
        "mutualFollowersCount": 12,
        "reason": "Followed by 12 people you follow"
      }
    ],
    "refreshIn": "24h"
  }
}
```

### 5. Internal Service APIs

#### 5.1 Bulk User Profiles
**Endpoint**: `POST /api/v1/internal/users/bulk`  
**Authorization**: Internal Service Token  
**Rate Limit**: 1000 requests per minute per service

**Request Body**:
```json
{
  "userIds": [
    "550e8400-e29b-41d4-a716-446655440000",
    "550e8400-e29b-41d4-a716-446655440001"
  ],
  "fields": ["id", "username", "fullName", "profileImage", "isVerified"]
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "johndoe",
        "fullName": "John Doe",
        "profileImage": "https://cdn.example.com/profiles/johndoe.jpg",
        "isVerified": true
      }
    ],
    "found": 1,
    "total": 2
  }
}
```

#### 5.2 Validate User
**Endpoint**: `GET /api/v1/internal/users/{userId}/validate`  
**Authorization**: Internal Service Token  
**Rate Limit**: 500 requests per minute per service

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "valid": true,
    "active": true,
    "verified": true,
    "username": "johndoe"
  }
}
```

### 6. Account Management

#### 6.1 Change Password
**Endpoint**: `PUT /api/v1/users/{userId}/password`  
**Authorization**: Bearer Token (own account)  
**Rate Limit**: 10 requests per minute per user

**Request Body**:
```json
{
  "currentPassword": "CurrentPass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

#### 6.2 Email Verification
**Endpoint**: `POST /api/v1/users/verify-email`  
**Authorization**: Public  
**Rate Limit**: 5 requests per minute per IP

**Request Body**:
```json
{
  "token": "verification-token-here"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### 6.3 Delete Account
**Endpoint**: `DELETE /api/v1/users/{userId}`  
**Authorization**: Bearer Token (own account)  
**Rate Limit**: 3 requests per minute per user

**Request Body**:
```json
{
  "password": "CurrentPass123!",
  "confirmation": "DELETE_ACCOUNT"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### 7. Admin Operations

#### 7.1 Get All Users (Admin)
**Endpoint**: `GET /api/v1/admin/users`  
**Authorization**: Admin Token  
**Rate Limit**: 100 requests per minute per admin

**Query Parameters**:
- `page`: Page number (default: 0)
- `size`: Page size (default: 20, max: 100)
- `sort`: Sort field (username, email, createdAt) (default: createdAt)
- `order`: Sort order (asc, desc) (default: desc)
- `status`: Filter by status (active, inactive, banned)
- `verified`: Filter by verification status (true/false)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "johndoe",
        "email": "john@example.com",
        "fullName": "John Doe",
        "isVerified": true,
        "isActive": true,
        "lastLoginAt": "2025-07-04T10:30:00Z",
        "joinedAt": "2025-01-15T10:00:00Z",
        "followersCount": 150,
        "followingCount": 89,
        "postsCount": 42
      }
    ]
  },
  "pagination": {
    "page": 0,
    "size": 20,
    "total": 10542,
    "totalPages": 528
  }
}
```

#### 7.2 Ban/Unban User (Admin)
**Endpoint**: `PUT /api/v1/admin/users/{userId}/ban`  
**Authorization**: Admin Token  
**Rate Limit**: 50 requests per minute per admin

**Request Body**:
```json
{
  "action": "ban",
  "reason": "Violation of community guidelines",
  "duration": "7d"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "User banned successfully"
}
```

## Event System

The User Service publishes events to Kafka topics for other services to consume. This enables real-time updates and maintains data consistency across the platform.

### Kafka Topics

#### user-lifecycle
- **user.registered**: User registration completed
- **user.verified**: Email verification completed
- **user.updated**: Profile information updated
- **user.deleted**: Account deletion completed
- **user.banned**: User account banned
- **user.unbanned**: User account unbanned

#### user-relationships
- **user.followed**: User followed another user
- **user.unfollowed**: User unfollowed another user
- **user.blocked**: User blocked another user
- **user.unblocked**: User unblocked another user

### Event Schemas

#### User Registration Event
```json
{
  "eventType": "user.registered",
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-07-04T10:30:00Z",
  "version": "1.0",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "isVerified": false,
    "joinedAt": "2025-07-04T10:30:00Z"
  }
}
```

#### User Follow Event
```json
{
  "eventType": "user.followed",
  "eventId": "550e8400-e29b-41d4-a716-446655440001",
  "timestamp": "2025-07-04T10:30:00Z",
  "version": "1.0",
  "data": {
    "followerId": "550e8400-e29b-41d4-a716-446655440000",
    "followingId": "550e8400-e29b-41d4-a716-446655440001",
    "followedAt": "2025-07-04T10:30:00Z"
  }
}
```

## Infrastructure & Performance

### Caching Strategy

#### Redis Cache Layers
- **User Profiles**: 15-minute TTL for frequently accessed profiles
- **Authentication Tokens**: TTL matches token expiry
- **User Relationships**: 30-minute TTL for followers/following lists
- **Search Results**: 5-minute TTL for search queries

#### Cache Keys
```
user:profile:{userId}           # User profile data
user:auth:{tokenId}            # Authentication tokens
user:followers:{userId}        # Followers list
user:following:{userId}        # Following list
user:search:{query}:{filters}  # Search results
```

### Database Optimizations

#### Indexes
```sql
-- User table indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_is_verified ON users(is_verified);

-- Relationships table indexes
CREATE INDEX idx_relationships_follower_id ON relationships(follower_id);
CREATE INDEX idx_relationships_following_id ON relationships(following_id);
CREATE INDEX idx_relationships_created_at ON relationships(created_at);
```

#### Connection Pooling
- **Pool Size**: 20 connections
- **Max Idle**: 10 connections
- **Connection Timeout**: 5 seconds
- **Idle Timeout**: 10 minutes

### Rate Limiting

#### Redis-based Rate Limiting
- **Sliding Window**: 1-minute windows
- **Distributed**: Shared across service instances
- **Graceful Degradation**: Reduced limits during high load

#### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1688472600
```

## Monitoring & Logging

### Health Checks

#### Health Check Endpoint
**Endpoint**: `GET /health`  
**Authorization**: Public

**Response (200 OK)**:
```json
{
  "status": "UP",
  "timestamp": "2025-07-04T10:30:00Z",
  "services": {
    "database": "UP",
    "redis": "UP",
    "kafka": "UP"
  },
  "metrics": {
    "uptime": "24h 15m 30s",
    "activeConnections": 45,
    "memoryUsage": "512MB",
    "cpuUsage": "25%"
  }
}
```

#### Readiness Check
**Endpoint**: `GET /ready`  
**Authorization**: Public

**Response (200 OK)**:
```json
{
  "status": "READY",
  "timestamp": "2025-07-04T10:30:00Z",
  "checks": {
    "database": "READY",
    "migrations": "READY",
    "cache": "READY"
  }
}
```

### Metrics

#### Prometheus Metrics
- **user_registrations_total**: Total number of user registrations
- **user_logins_total**: Total number of user logins
- **user_profile_updates_total**: Total number of profile updates
- **user_follows_total**: Total number of follow actions
- **user_search_queries_total**: Total number of search queries
- **user_api_requests_total**: Total number of API requests
- **user_api_request_duration**: API request duration histogram
- **user_cache_hits_total**: Total cache hits
- **user_cache_misses_total**: Total cache misses

### Logging

#### Log Format (JSON)
```json
{
  "timestamp": "2025-07-04T10:30:00Z",
  "level": "INFO",
  "service": "user-service",
  "traceId": "550e8400-e29b-41d4-a716-446655440000",
  "spanId": "a1b2c3d4e5f6",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "action": "user.login",
  "message": "User logged in successfully",
  "metadata": {
    "ip": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "duration": "125ms"
  }
}
```

#### Log Levels
- **ERROR**: System errors, authentication failures
- **WARN**: Rate limit violations, validation errors
- **INFO**: User actions, API requests
- **DEBUG**: Detailed request/response data (development only)

## Development & Testing

### Local Development

1. **Prerequisites:**
   - Java 17+
   - Maven 3.8+
   - PostgreSQL 14+ (or Docker)
   - Redis 7+ (or Docker)
   - Apache Kafka (or Docker)

2. **Setup and Run Locally:**
   ```bash
   # Build the project
   mvn clean package -DskipTests

   # Run the service
   java -jar target/user-service-1.0.0.jar
   ```

   Or use Docker Compose (recommended for all dependencies):
   ```bash
   docker-compose up --build user-service
   ```

3. **Testing:**
   ```bash
   # Run all unit and integration tests
   mvn test
   mvn verify
   ```

### API Testing

- Use the HTTP request files in `/http-requests/user-service/` for quick API tests.
- OpenAPI docs available at `/api/v1/docs` when the service is running.
- Postman collection: (add path if available)
- Test coverage target: 90%+

## Deployment & Configuration

### Environment Variables

#### Database Configuration
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=user_service
DB_USERNAME=user_service
DB_PASSWORD=secure_password
DB_POOL_SIZE=20
```

#### Redis Configuration
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password
REDIS_DATABASE=0
REDIS_POOL_SIZE=10
```

#### Kafka Configuration
```env
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
KAFKA_CONSUMER_GROUP=user-service
KAFKA_PRODUCER_RETRIES=3
KAFKA_PRODUCER_BATCH_SIZE=16384
```

#### Security Configuration
```env
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRATION=3600
JWT_REFRESH_EXPIRATION=86400
BCRYPT_ROUNDS=12
```

#### Application Configuration
```env
APP_NAME=user-service
APP_VERSION=1.0.0
APP_ENVIRONMENT=production
APP_PORT=8080
APP_CONTEXT_PATH=/api/v1
```

### Docker Configuration

#### Dockerfile
```dockerfile
FROM openjdk:17-jre-slim

WORKDIR /app

COPY target/user-service-*.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["java", "-jar", "app.jar"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  user-service:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=postgres
      - REDIS_HOST=redis
      - KAFKA_BOOTSTRAP_SERVERS=kafka:9092
    depends_on:
      - postgres
      - redis
      - kafka
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: user_service
      POSTGRES_USER: user_service
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6.2
    command: redis-server --requirepass redis_password
    ports:
      - "6379:6379"

  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

volumes:
  postgres_data:
```

## Security Considerations

### Authentication Security
- **JWT Tokens**: Stateless authentication with short expiration
- **Refresh Tokens**: Secure token renewal mechanism
- **Token Blacklisting**: Immediate token revocation capability
- **Multi-Factor Authentication**: TOTP support for enhanced security

### Password Security
- **BCrypt Hashing**: Industry-standard password hashing
- **Salt Rounds**: Configurable computational cost
- **Password Policy**: Enforced complexity requirements
- **Password History**: Prevention of password reuse
- **Account Lockout**: Protection against brute force attacks

### Data Protection
- **Encryption at Rest**: Database encryption for sensitive data
- **Encryption in Transit**: TLS 1.3 for all communications
- **PII Handling**: Minimal collection and secure storage
- **Data Retention**: Automatic cleanup of expired data

### API Security
- **Rate Limiting**: Protection against abuse and DDoS
- **Input Validation**: Comprehensive request sanitization
- **Output Encoding**: Prevention of XSS attacks
- **CORS Configuration**: Strict cross-origin policy
- **Security Headers**: Comprehensive security header implementation

### Privacy Compliance
- **GDPR Compliance**: User data portability and deletion rights
- **CCPA Compliance**: California privacy regulation adherence
- **Data Minimization**: Collection limited to necessary data
- **Consent Management**: Clear opt-in/opt-out mechanisms

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connectivity
psql -h localhost -p 5432 -U user_service -d user_service

# Check connection pool status
curl http://localhost:8080/actuator/metrics/hikaricp.connections
```

#### Redis Connection Issues
```bash
# Test Redis connectivity
redis-cli -h localhost -p 6379 -a redis_password ping

# Check Redis memory usage
redis-cli -h localhost -p 6379 -a redis_password info memory
```

#### Kafka Connection Issues
```bash
# List Kafka topics
kafka-topics.sh --bootstrap-server localhost:9092 --list

# Check consumer lag
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group user-service
```

#### Performance Issues
```bash
# Check application metrics
curl http://localhost:8080/actuator/metrics

# Monitor JVM memory
curl http://localhost:8080/actuator/metrics/jvm.memory.used

# Check slow queries
curl http://localhost:8080/actuator/metrics/spring.data.repository.invocations
```

### Debug Logging

#### Enable Debug Logging
```yaml
logging:
  level:
    com.blogit.user: DEBUG
    org.springframework.security: DEBUG
    org.springframework.web: DEBUG
```

#### Log Analysis
```bash
# Search for errors
grep -i "error" logs/user-service.log

# Search for specific user
grep "userId=550e8400-e29b-41d4-a716-446655440000" logs/user-service.log

# Monitor logs in real-time
tail -f logs/user-service.log | jq '.'
```

### Support Contacts

- **Development Team**: dev-team@blogit.com
- **Infrastructure Team**: infra-team@blogit.com
- **Security Team**: security-team@blogit.com
- **On-Call Support**: +1-555-BLOGIT-1

---

*This documentation is maintained by the User Service team. For updates or corrections, please create an issue in the repository or contact the development team.*
