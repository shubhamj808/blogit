# Blogit - Microservices Social Media Platform

A scalable, cloud-native social media platform built with microservices architecture, similar to Twitter.

## 🏗️ Architecture Overview

This project implements a microservices architecture with the following services:

- **API Gateway Service** - Entry point, authentication, rate limiting
- **User Service** - User management, profiles, relationships
- **Post Service** - Post creation, editing, content management
- **Interaction Service** - Likes, comments, engagement
- **Notification Service** - Real-time notifications
- **Media Service** - Image upload, processing, CDN
- **Feed Service** - Timeline generation, personalized feeds

## 🚀 Technology Stack

- **Backend**: Spring Boot 3.2+, Java 17+
- **Database**: PostgreSQL (per service), Redis (caching)
- **Message Queue**: Apache Kafka
- **Containerization**: Docker & Docker Compose
- **Security**: JWT, OAuth 2.0, Spring Security
- **Monitoring**: Actuator, Micrometer, Zipkin

## 📋 Prerequisites

- Java 17+
- Docker & Docker Compose
- Maven 3.8+
- PostgreSQL 14+
- Redis 7+
- Apache Kafka 3.0+

## 🏃‍♂️ Quick Start

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd blogit
   ```

2. **Start infrastructure services**:
   ```bash
   docker-compose up -d postgres redis kafka zookeeper
   ```

3. **Build all services**:
   ```bash
   ./build-all.sh
   ```

4. **Start all microservices**:
   ```bash
   ./start-all.sh
   ```

5. **Access the API Gateway**:
   ```
   http://localhost:8080
   ```

## 📊 Service Ports

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 8080 | Main entry point |
| User Service | 8081 | User management |
| Post Service | 8082 | Post operations |
| Interaction Service | 8083 | Likes, comments |
| Notification Service | 8084 | Notifications |
| Media Service | 8085 | Media handling |
| Feed Service | 8086 | Timeline feeds |

## 🗄️ Database Schema

Each service maintains its own database following the Database-per-Service pattern:

- `blogit_user_db` - User Service
- `blogit_post_db` - Post Service
- `blogit_interaction_db` - Interaction Service
- `blogit_notification_db` - Notification Service
- `blogit_media_db` - Media Service
- `blogit_feed_db` - Feed Service

## 🔐 Authentication

The platform uses JWT-based authentication:

1. Register/Login through User Service
2. Receive JWT token
3. Include token in `Authorization: Bearer <token>` header
4. API Gateway validates tokens and routes requests

## 📡 API Documentation

### User Service APIs
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `POST /api/users/follow/{userId}` - Follow user

### Post Service APIs
- `POST /api/posts` - Create post
- `GET /api/posts` - Get posts
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post

### Interaction Service APIs
- `POST /api/interactions/like` - Like/unlike post
- `POST /api/interactions/comment` - Add comment
- `GET /api/interactions/post/{postId}` - Get post interactions

## 🎯 Key Features

### ✅ Implemented Features
- User registration and authentication
- Post creation and management
- Like/unlike functionality
- Comment system
- Follow/unfollow users
- Real-time notifications
- Media upload and processing
- Personalized feed generation

### 🔄 Event-Driven Architecture
Services communicate via Kafka events:
- `user.created` - New user registration
- `post.created` - New post published
- `post.liked` - Post liked/unliked
- `comment.added` - New comment
- `user.followed` - User followed

## 🏭 Production Considerations

### Scaling
- Horizontal scaling with Kubernetes
- Database read replicas
- Redis clustering
- Kafka partitioning

### Monitoring
- Health checks via Spring Actuator
- Distributed tracing with Zipkin
- Metrics collection with Micrometer
- Centralized logging

### Security
- JWT token validation
- Rate limiting
- Input validation
- SQL injection prevention
- CORS configuration

## 🧪 Testing

```bash
# Run unit tests
mvn test

# Run integration tests
mvn verify

# Run all tests
./test-all.sh
```

## 📈 Performance Optimization

- Redis caching for frequently accessed data
- Database connection pooling
- Async processing with Kafka
- CDN for media files
- Response pagination
- Query optimization

## 🔧 Development

### Adding New Service
1. Create service directory in project root
2. Add Spring Boot application
3. Configure database connection
4. Add to docker-compose.yml
5. Update API Gateway routes

### Local Development
```bash
# Start only infrastructure
docker-compose up -d postgres redis kafka

# Run services individually
cd user-service && mvn spring-boot:run
cd post-service && mvn spring-boot:run
```

## 📝 License

MIT License - see LICENSE.md for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For issues and questions:
- GitHub Issues
- Email: support@blogit.com
- Documentation: /docs
