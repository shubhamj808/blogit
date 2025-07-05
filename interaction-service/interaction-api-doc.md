# Interaction Service REST API Documentation

## Service Overview

The Interaction Service manages all user interactions with posts and comments, including likes, comments, replies, and engagement analytics. It follows RESTful principles and integrates with multiple microservices to provide a comprehensive social interaction experience.

**Base URL**: `/api/v1/interactions`  
**Service Port**: 8083  
**Database**: PostgreSQL  
**Message Queue**: Apache Kafka  
**Cache**: Redis

## Table of Contents

1. [API Structure & Standards](#api-structure--standards)
2. [Authentication & Security](#authentication--security)
3. [REST API Endpoints](#rest-api-endpoints)
4. [Event System](#event-system)
5. [Service Integrations](#service-integrations)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Monitoring & Logging](#monitoring--logging)

## API Structure & Standards

### URL Structure
```
/api/v1/interactions/{resource}/{action}
```

### HTTP Methods
- **GET**: Retrieve data
- **POST**: Create new resources
- **PUT**: Update entire resources
- **PATCH**: Partial resource updates
- **DELETE**: Remove resources

### Response Format
All responses follow a consistent structure:

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2025-07-04T10:30:00Z",
  "pagination": {
    "page": 1,
    "size": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": ["Field 'content' is required"],
    "timestamp": "2025-07-04T10:30:00Z",
    "path": "/api/v1/interactions/comments"
  }
}
```

## Authentication & Security

### Headers Required
```
Authorization: Bearer {jwt-token}
Content-Type: application/json
X-User-ID: {user-id}
X-Request-ID: {unique-request-id}
```

### Security Features
- JWT token validation
- Rate limiting per user
- Request validation
- SQL injection prevention
- XSS protection

## REST API Endpoints

### 1. Post Likes Management

#### 1.1 Like a Post
```http
POST /api/v1/interactions/posts/{postId}/likes
```

**Description**: Add a like to a specific post

**Headers**:
```
Authorization: Bearer {jwt-token}
Content-Type: application/json
X-User-ID: {user-id}
```

**Path Parameters**:
- `postId` (UUID, required): ID of the post to like

**Request Body**: None

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "postId": "550e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440002",
    "createdAt": "2025-07-04T10:30:00Z"
  },
  "message": "Post liked successfully",
  "timestamp": "2025-07-04T10:30:00Z"
}
```

**Error Responses**:
- 400 Bad Request: Invalid post ID
- 401 Unauthorized: Invalid or missing token
- 404 Not Found: Post not found
- 409 Conflict: Post already liked by user

#### 1.2 Unlike a Post
```http
DELETE /api/v1/interactions/posts/{postId}/likes
```

**Description**: Remove a like from a specific post

**Headers**:
```
Authorization: Bearer {jwt-token}
X-User-ID: {user-id}
```

**Path Parameters**:
- `postId` (UUID, required): ID of the post to unlike

**Response** (204 No Content):
```json
{
  "success": true,
  "message": "Post unliked successfully",
  "timestamp": "2025-07-04T10:30:00Z"
}
```

#### 1.3 Get Post Likes
```http
GET /api/v1/interactions/posts/{postId}/likes
```

**Description**: Retrieve all likes for a specific post with pagination

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Path Parameters**:
- `postId` (UUID, required): ID of the post

**Query Parameters**:
- `page` (integer, optional, default: 0): Page number
- `size` (integer, optional, default: 20): Page size
- `sort` (string, optional, default: "createdAt,desc"): Sort criteria

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "likes": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "userId": "550e8400-e29b-41d4-a716-446655440002",
        "username": "johndoe",
        "userProfileImage": "https://cdn.example.com/profiles/johndoe.jpg",
        "createdAt": "2025-07-04T10:30:00Z"
      }
    ],
    "totalLikes": 42
  },
  "pagination": {
    "page": 0,
    "size": 20,
    "total": 42,
    "totalPages": 3
  },
  "timestamp": "2025-07-04T10:30:00Z"
}
```

#### 1.4 Check if User Liked Post
```http
GET /api/v1/interactions/posts/{postId}/likes/check
```

**Description**: Check if the current user has liked a specific post

**Headers**:
```
Authorization: Bearer {jwt-token}
X-User-ID: {user-id}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "isLiked": true,
    "likedAt": "2025-07-04T10:30:00Z"
  },
  "timestamp": "2025-07-04T10:30:00Z"
}
```

### 2. Comments Management

#### 2.1 Create Comment
```http
POST /api/v1/interactions/posts/{postId}/comments
```

**Description**: Add a comment to a specific post

**Headers**:
```
Authorization: Bearer {jwt-token}
Content-Type: application/json
X-User-ID: {user-id}
```

**Path Parameters**:
- `postId` (UUID, required): ID of the post to comment on

**Request Body**:
```json
{
  "content": "This is a great post!",
  "parentCommentId": "550e8400-e29b-41d4-a716-446655440003"
}
```

**Field Validation**:
- `content` (string, required): Comment content (1-500 characters)
- `parentCommentId` (UUID, optional): ID of parent comment for replies

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "postId": "550e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440002",
    "content": "This is a great post!",
    "parentCommentId": "550e8400-e29b-41d4-a716-446655440003",
    "likeCount": 0,
    "replyCount": 0,
    "isActive": true,
    "createdAt": "2025-07-04T10:30:00Z",
    "updatedAt": "2025-07-04T10:30:00Z",
    "author": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "username": "johndoe",
      "fullName": "John Doe",
      "profileImage": "https://cdn.example.com/profiles/johndoe.jpg"
    }
  },
  "message": "Comment created successfully",
  "timestamp": "2025-07-04T10:30:00Z"
}
```

#### 2.2 Get Post Comments
```http
GET /api/v1/interactions/posts/{postId}/comments
```

**Description**: Retrieve all comments for a specific post with pagination and threading

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Path Parameters**:
- `postId` (UUID, required): ID of the post

**Query Parameters**:
- `page` (integer, optional, default: 0): Page number
- `size` (integer, optional, default: 20): Page size
- `sort` (string, optional, default: "createdAt,desc"): Sort criteria
- `includeReplies` (boolean, optional, default: true): Include nested replies
- `maxDepth` (integer, optional, default: 3): Maximum reply depth

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "postId": "550e8400-e29b-41d4-a716-446655440001",
        "content": "This is a great post!",
        "likeCount": 5,
        "replyCount": 2,
        "isLikedByUser": false,
        "createdAt": "2025-07-04T10:30:00Z",
        "updatedAt": "2025-07-04T10:30:00Z",
        "author": {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "username": "johndoe",
          "fullName": "John Doe",
          "profileImage": "https://cdn.example.com/profiles/johndoe.jpg"
        },
        "replies": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440003",
            "content": "I agree!",
            "likeCount": 1,
            "replyCount": 0,
            "isLikedByUser": true,
            "createdAt": "2025-07-04T10:35:00Z",
            "author": {
              "id": "550e8400-e29b-41d4-a716-446655440004",
              "username": "janedoe",
              "fullName": "Jane Doe",
              "profileImage": "https://cdn.example.com/profiles/janedoe.jpg"
            }
          }
        ]
      }
    ],
    "totalComments": 15
  },
  "pagination": {
    "page": 0,
    "size": 20,
    "total": 15,
    "totalPages": 1
  },
  "timestamp": "2025-07-04T10:30:00Z"
}
```

#### 2.3 Update Comment
```http
PUT /api/v1/interactions/comments/{commentId}
```

**Description**: Update a specific comment (only by comment author)

**Headers**:
```
Authorization: Bearer {jwt-token}
Content-Type: application/json
X-User-ID: {user-id}
```

**Path Parameters**:
- `commentId` (UUID, required): ID of the comment to update

**Request Body**:
```json
{
  "content": "Updated comment content"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "content": "Updated comment content",
    "updatedAt": "2025-07-04T10:35:00Z",
    "isEdited": true
  },
  "message": "Comment updated successfully",
  "timestamp": "2025-07-04T10:35:00Z"
}
```

#### 2.4 Delete Comment
```http
DELETE /api/v1/interactions/comments/{commentId}
```

**Description**: Delete a specific comment (soft delete)

**Headers**:
```
Authorization: Bearer {jwt-token}
X-User-ID: {user-id}
```

**Path Parameters**:
- `commentId` (UUID, required): ID of the comment to delete

**Response** (204 No Content):
```json
{
  "success": true,
  "message": "Comment deleted successfully",
  "timestamp": "2025-07-04T10:35:00Z"
}
```

### 3. Comment Likes Management

#### 3.1 Like Comment
```http
POST /api/v1/interactions/comments/{commentId}/likes
```

**Description**: Add a like to a specific comment

**Headers**:
```
Authorization: Bearer {jwt-token}
X-User-ID: {user-id}
```

**Path Parameters**:
- `commentId` (UUID, required): ID of the comment to like

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "commentId": "550e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440002",
    "createdAt": "2025-07-04T10:30:00Z"
  },
  "message": "Comment liked successfully",
  "timestamp": "2025-07-04T10:30:00Z"
}
```

#### 3.2 Unlike Comment
```http
DELETE /api/v1/interactions/comments/{commentId}/likes
```

**Description**: Remove a like from a specific comment

**Response** (204 No Content):
```json
{
  "success": true,
  "message": "Comment unliked successfully",
  "timestamp": "2025-07-04T10:30:00Z"
}
```

### 4. Analytics & Statistics

#### 4.1 Get Post Engagement Statistics
```http
GET /api/v1/interactions/posts/{postId}/stats
```

**Description**: Get comprehensive engagement statistics for a post

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Path Parameters**:
- `postId` (UUID, required): ID of the post

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "postId": "550e8400-e29b-41d4-a716-446655440001",
    "likeCount": 42,
    "commentCount": 15,
    "replyCount": 8,
    "engagementRate": 0.67,
    "topComments": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "content": "This is amazing!",
        "likeCount": 10,
        "author": {
          "username": "johndoe",
          "fullName": "John Doe"
        }
      }
    ],
    "hourlyEngagement": [
      {
        "hour": "10:00",
        "likes": 5,
        "comments": 2
      }
    ]
  },
  "timestamp": "2025-07-04T10:30:00Z"
}
```

#### 4.2 Get User Interaction History
```http
GET /api/v1/interactions/users/{userId}/history
```

**Description**: Get user's interaction history with pagination

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Path Parameters**:
- `userId` (UUID, required): ID of the user

**Query Parameters**:
- `type` (string, optional): Filter by interaction type (LIKE, COMMENT)
- `page` (integer, optional, default: 0): Page number
- `size` (integer, optional, default: 20): Page size
- `fromDate` (string, optional): Start date filter (ISO 8601)
- `toDate` (string, optional): End date filter (ISO 8601)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "interactions": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "type": "LIKE",
        "targetId": "550e8400-e29b-41d4-a716-446655440001",
        "targetType": "POST",
        "createdAt": "2025-07-04T10:30:00Z",
        "postPreview": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "content": "Sample post content...",
          "author": {
            "username": "janedoe",
            "fullName": "Jane Doe"
          }
        }
      }
    ]
  },
  "pagination": {
    "page": 0,
    "size": 20,
    "total": 156,
    "totalPages": 8
  },
  "timestamp": "2025-07-04T10:30:00Z"
}
```

### 5. Batch Operations

#### 5.1 Bulk Like Status Check
```http
POST /api/v1/interactions/posts/likes/bulk-check
```

**Description**: Check like status for multiple posts at once

**Headers**:
```
Authorization: Bearer {jwt-token}
Content-Type: application/json
X-User-ID: {user-id}
```

**Request Body**:
```json
{
  "postIds": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002",
    "550e8400-e29b-41d4-a716-446655440003"
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "likeStatuses": {
      "550e8400-e29b-41d4-a716-446655440001": {
        "isLiked": true,
        "likedAt": "2025-07-04T10:30:00Z"
      },
      "550e8400-e29b-41d4-a716-446655440002": {
        "isLiked": false,
        "likedAt": null
      },
      "550e8400-e29b-41d4-a716-446655440003": {
        "isLiked": true,
        "likedAt": "2025-07-04T09:15:00Z"
      }
    }
  },
  "timestamp": "2025-07-04T10:30:00Z"
}
```

## Event System

### Kafka Events Published

#### 1. Post Like Events

**Topic**: `post-interaction-events`

**PostLikedEvent**:
```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "POST_LIKED",
  "timestamp": "2025-07-04T10:30:00Z",
  "version": "1.0",
  "data": {
    "postId": "550e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440002",
    "postOwnerId": "550e8400-e29b-41d4-a716-446655440003",
    "likeId": "550e8400-e29b-41d4-a716-446655440004"
  }
}
```

**PostUnlikedEvent**:
```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "POST_UNLIKED",
  "timestamp": "2025-07-04T10:30:00Z",
  "version": "1.0",
  "data": {
    "postId": "550e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440002",
    "postOwnerId": "550e8400-e29b-41d4-a716-446655440003"
  }
}
```

#### 2. Comment Events

**Topic**: `comment-interaction-events`

**CommentCreatedEvent**:
```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "COMMENT_CREATED",
  "timestamp": "2025-07-04T10:30:00Z",
  "version": "1.0",
  "data": {
    "commentId": "550e8400-e29b-41d4-a716-446655440001",
    "postId": "550e8400-e29b-41d4-a716-446655440002",
    "userId": "550e8400-e29b-41d4-a716-446655440003",
    "postOwnerId": "550e8400-e29b-41d4-a716-446655440004",
    "content": "Great post!",
    "parentCommentId": null,
    "mentionedUsers": ["550e8400-e29b-41d4-a716-446655440005"]
  }
}
```

**CommentUpdatedEvent**:
```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "COMMENT_UPDATED",
  "timestamp": "2025-07-04T10:30:00Z",
  "version": "1.0",
  "data": {
    "commentId": "550e8400-e29b-41d4-a716-446655440001",
    "postId": "550e8400-e29b-41d4-a716-446655440002",
    "userId": "550e8400-e29b-41d4-a716-446655440003",
    "oldContent": "Original content",
    "newContent": "Updated content"
  }
}
```

**CommentDeletedEvent**:
```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "COMMENT_DELETED",
  "timestamp": "2025-07-04T10:30:00Z",
  "version": "1.0",
  "data": {
    "commentId": "550e8400-e29b-41d4-a716-446655440001",
    "postId": "550e8400-e29b-41d4-a716-446655440002",
    "userId": "550e8400-e29b-41d4-a716-446655440003",
    "postOwnerId": "550e8400-e29b-41d4-a716-446655440004"
  }
}
```

#### 3. Comment Like Events

**Topic**: `comment-like-events`

**CommentLikedEvent**:
```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "COMMENT_LIKED",
  "timestamp": "2025-07-04T10:30:00Z",
  "version": "1.0",
  "data": {
    "commentId": "550e8400-e29b-41d4-a716-446655440001",
    "postId": "550e8400-e29b-41d4-a716-446655440002",
    "userId": "550e8400-e29b-41d4-a716-446655440003",
    "commentOwnerId": "550e8400-e29b-41d4-a716-446655440004",
    "likeId": "550e8400-e29b-41d4-a716-446655440005"
  }
}
```

### Kafka Events Consumed

#### 1. User Events

**Topic**: `user-events`

**UserCreatedEvent**: Update user cache for faster lookups  
**UserUpdatedEvent**: Refresh user profile data in responses  
**UserDeletedEvent**: Handle user deletion cleanup

#### 2. Post Events

**Topic**: `post-events`

**PostCreatedEvent**: Initialize interaction counters  
**PostDeletedEvent**: Clean up related interactions  
**PostUpdatedEvent**: Update cached post data

## Service Integrations

### 1. User Service Integration

**Purpose**: Validate users and fetch user profile data

**Integration Type**: REST API + Event Consumption

**API Calls**:
```http
GET /api/v1/users/{userId}/profile
GET /api/v1/users/bulk-profile
POST /api/v1/users/validate
```

**Usage**:
- Validate user existence before creating interactions
- Fetch user profile data for comment/like responses
- Bulk user profile fetching for efficiency

**Circuit Breaker**: Enabled with 5-second timeout

### 2. Post Service Integration

**Purpose**: Validate posts and fetch post metadata

**Integration Type**: REST API + Event Consumption

**API Calls**:
```http
GET /api/v1/posts/{postId}/metadata
GET /api/v1/posts/bulk-metadata
POST /api/v1/posts/validate
```

**Usage**:
- Validate post existence before creating interactions
- Fetch post owner information for notifications
- Check post permissions and visibility

**Circuit Breaker**: Enabled with 3-second timeout

### 3. Notification Service Integration

**Purpose**: Send notifications for interactions

**Integration Type**: Event Publishing

**Events Sent**:
- PostLikedEvent → Notification Service
- CommentCreatedEvent → Notification Service
- CommentLikedEvent → Notification Service

**Async Processing**: All notifications are sent asynchronously

### 4. Feed Service Integration

**Purpose**: Update user feeds when interactions occur

**Integration Type**: Event Publishing

**Events Sent**:
- PostLikedEvent → Feed Service (for engagement metrics)
- CommentCreatedEvent → Feed Service (for activity updates)

### 5. Analytics Service Integration

**Purpose**: Track interaction metrics and user behavior

**Integration Type**: Event Publishing

**Events Sent**:
- All interaction events for analytics processing
- User engagement metrics
- Content performance data

## Error Handling

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| UNAUTHORIZED | 401 | Invalid or missing authentication |
| FORBIDDEN | 403 | Access denied |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |
| SERVICE_UNAVAILABLE | 503 | Service temporarily unavailable |

### Error Response Examples

**Validation Error**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      "Field 'content' is required",
      "Field 'content' must be between 1 and 500 characters"
    ],
    "timestamp": "2025-07-04T10:30:00Z",
    "path": "/api/v1/interactions/posts/123/comments"
  }
}
```

**Service Integration Error**:
```json
{
  "success": false,
  "error": {
    "code": "EXTERNAL_SERVICE_ERROR",
    "message": "User service is temporarily unavailable",
    "details": ["Unable to validate user existence"],
    "timestamp": "2025-07-04T10:30:00Z",
    "path": "/api/v1/interactions/posts/123/likes"
  }
}
```

## Rate Limiting

### Rate Limit Configuration

| Endpoint Pattern | Rate Limit | Window |
|------------------|------------|---------|
| POST /api/v1/interactions/posts/*/likes | 10 per minute | 1 minute |
| POST /api/v1/interactions/posts/*/comments | 5 per minute | 1 minute |
| POST /api/v1/interactions/comments/*/likes | 20 per minute | 1 minute |
| GET /api/v1/interactions/** | 100 per minute | 1 minute |

### Rate Limit Headers

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1688472000
```

## Monitoring & Logging

### Metrics Exposed

**Application Metrics**:
- Request count by endpoint
- Response time percentiles
- Error rate by endpoint
- Active connections

**Business Metrics**:
- Likes per minute
- Comments per minute
- User engagement rate
- Top active users

**System Metrics**:
- Database connection pool usage
- Kafka consumer lag
- Redis cache hit ratio
- Memory and CPU usage

### Logging Format

```json
{
  "timestamp": "2025-07-04T10:30:00Z",
  "level": "INFO",
  "service": "interaction-service",
  "traceId": "550e8400-e29b-41d4-a716-446655440000",
  "spanId": "550e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440002",
  "endpoint": "POST /api/v1/interactions/posts/123/likes",
  "duration": 45,
  "status": 201,
  "message": "Post liked successfully"
}
```

### Health Check Endpoint

```http
GET /actuator/health
```

**Response**:
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "SELECT 1"
      }
    },
    "kafka": {
      "status": "UP",
      "details": {
        "brokers": ["localhost:9092"]
      }
    },
    "redis": {
      "status": "UP",
      "details": {
        "host": "localhost:6379"
      }
    }
  }
}
```

## API Gateway Integration

### Service Discovery

**Service Name**: `interaction-service`  
**Health Check Path**: `/actuator/health`  
**Load Balancer**: Round Robin

### Routing Configuration

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: interaction-service
          uri: lb://interaction-service
          predicates:
            - Path=/api/v1/interactions/**
          filters:
            - name: CircuitBreaker
              args:
                name: interaction-service-cb
                fallbackUri: forward:/fallback/interaction
            - name: Retry
              args:
                retries: 3
                methods: GET
            - name: RequestRateLimiter
              args:
                rate-limiter: "#{@interactionRateLimiter}"
                key-resolver: "#{@userKeyResolver}"
```

### Circuit Breaker Configuration

```yaml
resilience4j:
  circuitbreaker:
    instances:
      interaction-service:
        register-health-indicator: true
        sliding-window-size: 10
        minimum-number-of-calls: 5
        permitted-number-of-calls-in-half-open-state: 3
        wait-duration-in-open-state: 30s
        failure-rate-threshold: 50
        slow-call-rate-threshold: 50
        slow-call-duration-threshold: 2s
```

## Database Schema Details

### Table Definitions

```sql
-- Likes table with optimized indexes
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Comments table with hierarchical structure
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    parent_comment_id UUID REFERENCES comments(id),
    content TEXT NOT NULL CHECK (length(content) >= 1 AND length(content) <= 500),
    is_active BOOLEAN DEFAULT TRUE,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Comment likes table
CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES comments(id),
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- Interaction analytics table
CREATE TABLE interaction_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    interaction_type VARCHAR(20) NOT NULL, -- 'LIKE', 'COMMENT', 'SHARE'
    interaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(post_id, user_id, interaction_type, interaction_date)
);
```

### Indexes for Performance

```sql
-- Likes table indexes
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_created_at ON likes(created_at DESC);

-- Comments table indexes
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_comments_active ON comments(is_active) WHERE is_active = true;

-- Comment likes table indexes
CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);

-- Analytics table indexes
CREATE INDEX idx_analytics_post_id ON interaction_analytics(post_id);
CREATE INDEX idx_analytics_user_id ON interaction_analytics(user_id);
CREATE INDEX idx_analytics_date ON interaction_analytics(interaction_date);
CREATE INDEX idx_analytics_type ON interaction_analytics(interaction_type);
```

## Caching Strategy

### Redis Cache Keys

```
# User like status cache
user:likes:{userId}:{postId} -> boolean (TTL: 1 hour)

# Post like count cache
post:likes:count:{postId} -> integer (TTL: 30 minutes)

# Comment count cache
post:comments:count:{postId} -> integer (TTL: 30 minutes)

# User profile cache (from User Service)
user:profile:{userId} -> UserProfile JSON (TTL: 2 hours)

# Post metadata cache (from Post Service)
post:metadata:{postId} -> PostMetadata JSON (TTL: 1 hour)

# Comment thread cache
comment:thread:{commentId} -> Comment JSON with replies (TTL: 15 minutes)
```

### Cache Implementation

```java
@Service
public class InteractionCacheService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    public void cacheUserLikeStatus(String userId, String postId, boolean isLiked) {
        String key = String.format("user:likes:%s:%s", userId, postId);
        redisTemplate.opsForValue().set(key, isLiked, Duration.ofHours(1));
    }
    
    public Boolean getCachedUserLikeStatus(String userId, String postId) {
        String key = String.format("user:likes:%s:%s", userId, postId);
        return (Boolean) redisTemplate.opsForValue().get(key);
    }
    
    public void cachePostLikeCount(String postId, long count) {
        String key = String.format("post:likes:count:%s", postId);
        redisTemplate.opsForValue().set(key, count, Duration.ofMinutes(30));
    }
    
    public Long getCachedPostLikeCount(String postId) {
        String key = String.format("post:likes:count:%s", postId);
        return (Long) redisTemplate.opsForValue().get(key);
    }
    
    public void invalidatePostCaches(String postId) {
        String likeCountKey = String.format("post:likes:count:%s", postId);
        String commentCountKey = String.format("post:comments:count:%s", postId);
        redisTemplate.delete(Arrays.asList(likeCountKey, commentCountKey));
    }
}
```

## Advanced Features

### 1. Mention Detection and Handling

```http
POST /api/v1/interactions/posts/{postId}/comments
```

**Request Body with Mentions**:
```json
{
  "content": "Great post @johndoe! What do you think @janedoe?",
  "parentCommentId": null
}
```

**Response includes extracted mentions**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "content": "Great post @johndoe! What do you think @janedoe?",
    "mentions": [
      {
        "userId": "550e8400-e29b-41d4-a716-446655440001",
        "username": "johndoe",
        "startIndex": 11,
        "endIndex": 18
      },
      {
        "userId": "550e8400-e29b-41d4-a716-446655440002", 
        "username": "janedoe",
        "startIndex": 41,
        "endIndex": 48
      }
    ]
  }
}
```

### 2. Hashtag Support

```http
POST /api/v1/interactions/posts/{postId}/comments
```

**Request Body with Hashtags**:
```json
{
  "content": "This is amazing! #technology #innovation #future",
  "parentCommentId": null
}
```

**Response includes extracted hashtags**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "content": "This is amazing! #technology #innovation #future",
    "hashtags": ["technology", "innovation", "future"]
  }
}
```

### 3. Sentiment Analysis

```http
GET /api/v1/interactions/posts/{postId}/sentiment
```

**Description**: Get sentiment analysis of post interactions

**Response**:
```json
{
  "success": true,
  "data": {
    "postId": "550e8400-e29b-41d4-a716-446655440001",
    "overallSentiment": "positive",
    "sentimentScore": 0.75,
    "sentimentBreakdown": {
      "positive": 65,
      "neutral": 25,
      "negative": 10
    },
    "topPositiveComments": [
      {
        "commentId": "550e8400-e29b-41d4-a716-446655440002",
        "content": "This is absolutely fantastic!",
        "sentimentScore": 0.95
      }
    ],
    "topNegativeComments": [
      {
        "commentId": "550e8400-e29b-41d4-a716-446655440003",
        "content": "I disagree with this approach",
        "sentimentScore": -0.3
      }
    ]
  }
}
```

### 4. Trending Comments

```http
GET /api/v1/interactions/posts/{postId}/comments/trending
```

**Description**: Get trending comments based on engagement velocity

**Query Parameters**:
- `timeWindow` (string, optional, default: "24h"): Time window for trending calculation
- `limit` (integer, optional, default: 10): Maximum number of trending comments

**Response**:
```json
{
  "success": true,
  "data": {
    "trendingComments": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "content": "This changed my perspective completely!",
        "likeCount": 45,
        "replyCount": 12,
        "engagementVelocity": 0.85,
        "trendingScore": 92.5,
        "author": {
          "username": "johndoe",
          "fullName": "John Doe",
          "profileImage": "https://cdn.example.com/profiles/johndoe.jpg"
        },
        "createdAt": "2025-07-04T08:30:00Z"
      }
    ],
    "timeWindow": "24h",
    "calculatedAt": "2025-07-04T10:30:00Z"
  }
}
```

## WebSocket Integration

### Real-time Interaction Updates

**WebSocket Endpoint**: `ws://localhost:8083/ws/interactions`

**Connection Authentication**:
```javascript
const socket = new WebSocket('ws://localhost:8083/ws/interactions', [], {
  headers: {
    'Authorization': 'Bearer ' + jwtToken
  }
});
```

**Event Types**:

**New Like Event**:
```json
{
  "type": "POST_LIKED",
  "data": {
    "postId": "550e8400-e29b-41d4-a716-446655440001",
    "likeCount": 43,
    "likedBy": {
      "userId": "550e8400-e29b-41d4-a716-446655440002",
      "username": "johndoe"
    }
  },
  "timestamp": "2025-07-04T10:30:00Z"
}
```

**New Comment Event**:
```json
{
  "type": "COMMENT_CREATED",
  "data": {
    "postId": "550e8400-e29b-41d4-a716-446655440001",
    "comment": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "content": "Great insight!",
      "author": {
        "username": "janedoe",
        "fullName": "Jane Doe"
      },
      "createdAt": "2025-07-04T10:30:00Z"
    }
  },
  "timestamp": "2025-07-04T10:30:00Z"
}
```

## Security Considerations

### Input Validation

```java
@RestController
@Validated
public class InteractionController {
    
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentDto> createComment(
        @PathVariable @Valid @UUID String postId,
        @RequestBody @Valid CreateCommentRequest request,
        @RequestHeader("X-User-ID") @UUID String userId
    ) {
        // Implementation
    }
}

@Data
@Validated
public class CreateCommentRequest {
    
    @NotBlank(message = "Content is required")
    @Size(min = 1, max = 500, message = "Content must be between 1 and 500 characters")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\p{P}\\p{Z}\\p{S}]*$", message = "Content contains invalid characters")
    private String content;
    
    @UUID(message = "Invalid parent comment ID format")
    private String parentCommentId;
}
```

### SQL Injection Prevention

```java
@Repository
public class CommentRepository {
    
    @Query("SELECT c FROM Comment c WHERE c.postId = :postId AND c.isActive = true ORDER BY c.createdAt DESC")
    List<Comment> findActiveCommentsByPostId(@Param("postId") String postId);
    
    @Query("SELECT c FROM Comment c WHERE c.id = :commentId AND c.userId = :userId")
    Optional<Comment> findCommentByIdAndUserId(@Param("commentId") String commentId, @Param("userId") String userId);
}
```

### Rate Limiting Implementation

```java
@Component
public class RateLimitingFilter implements Filter {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String userId = httpRequest.getHeader("X-User-ID");
        String endpoint = httpRequest.getRequestURI();
        
        if (isRateLimited(userId, endpoint)) {
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(429);
            httpResponse.getWriter().write("{\"error\":\"Rate limit exceeded\"}");
            return;
        }
        
        chain.doFilter(request, response);
    }
    
    private boolean isRateLimited(String userId, String endpoint) {
        String key = String.format("rate_limit:%s:%s", userId, endpoint);
        String count = redisTemplate.opsForValue().get(key);
        
        if (count == null) {
            redisTemplate.opsForValue().set(key, "1", Duration.ofMinutes(1));
            return false;
        }
        
        int currentCount = Integer.parseInt(count);
        int limit = getRateLimitForEndpoint(endpoint);
        
        if (currentCount >= limit) {
            return true;
        }
        
        redisTemplate.opsForValue().increment(key);
        return false;
    }
}
```

