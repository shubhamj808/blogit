# API Gateway

The API Gateway is a Spring Cloud Gateway service that provides a central entry point to the Blogit platform's microservices, handling request routing, authentication, rate limiting, and CORS configuration.

## Features

- **Request Routing**: Routes requests to appropriate microservices based on URI.
- **Authentication**: Validates JWT tokens for secured endpoints using a custom filter.
- **Rate Limiting**: Configures Redis-based rate limiting for all routes.
- **CORS Support**: Configures global CORS settings for cross-origin requests.
- **Monitoring**: Supports Prometheus and Zipkin metrics and tracing.

## Technology Stack

- **Framework**: Spring Cloud Gateway
- **Security**: JWT via a custom filter
- **Caching**: Redis (for rate limiting)
- **Build Tool**: Maven
- **Java Version**: 17
- **Monitoring**: Prometheus, Zipkin

## API Routes

### User Service Routes
- **Auth**: `/api/auth/**` routed to User Service
- **Users**: `/api/users/**` routed to User Service

### Post Service Routes
- **Posts**: `/api/posts/**` routed to Post Service

### Additional Service Routes
- **Interaction**: `/api/interactions/**`
- **Notification**: `/api/notifications/**`
- **Media**: `/api/media/**`
- **Feed**: `/api/feed/**`

## Configuration

### Environment Variables

```env
# Redis Configuration
SPRING_REDIS_HOST=localhost
SPRING_REDIS_PORT=6379

# JWT Configuration
APP_JWT_SECRET=mySecretKey
```

### Application Profiles

- **default**: Local development with local services
- **docker**: Docker environment with containerized services

## Building and Running

### Prerequisites
- Java 17+
- Maven 3.8+
- Redis 7+

### Build
```bash
cd api-gateway
mvn clean package -DskipTests
```

### Run Locally
```bash
java -jar target/api-gateway-1.0.0.jar
```

### Run with Docker
```bash
# Build image
docker build -t blogit/api-gateway .

# Run container
docker run -p 8080:8080 --name api-gateway blogit/api-gateway
```

## Redis Rate Limiter Configuration

The gateway uses a Redis-based rate limiting configuration.
Custom key resolver resolves user ID for authenticated requests and falls back to IP address for unauthenticated requests.

Rate Limiting Example:
```yaml
- id: user-service-auth
  uri: http://localhost:8081
  predicates:
    - Path=/api/auth/**
  filters:
    - name: RequestRateLimiter
      args:
        redis-rate-limiter.replenishRate: 10
        redis-rate-limiter.burstCapacity: 20
        redis-rate-limiter.requestedTokens: 1
```

## Monitoring and Health Checks

### Health Check
```bash
curl http://localhost:8080/actuator/health
```

### Metrics
```bash
curl http://localhost:8080/actuator/metrics
```

### Prometheus Metrics
```bash
curl http://localhost:8080/actuator/prometheus
```

## Security

- JWT-based authentication
- CORS configuration
- Redis-based rate limiting

## Contributing

1. Follow the existing code style
2. Write comprehensive tests
3. Update documentation
4. Ensure all tests pass before submitting

