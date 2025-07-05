# Interaction Service

The Interaction Service manages user interactions with posts and comments, including likes, comments, and engagement analytics. It is a RESTful microservice built using Spring Boot, PostgreSQL, Kafka, and Redis.

## Key Features
- Handle likes/unlikes for posts
- Comment system with unlimited threading
- Engagement metrics with real-time updates
- Kafka event publishing for interactions
- PostgreSQL for persistent storage
- Distributed tracing with OpenTelemetry
- Comprehensive REST API documentation with Swagger

## Requirements
- Java 17+
- Maven 3.8+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 7+

## Setup

### Build
```bash
mvn clean package -DskipTests
```

### Run Locally
```bash
java -jar target/interaction-service-1.0.0.jar
```

### Docker
#### Build Docker Image
```bash
docker build -t blogit-interaction-service .
```

#### Run with Docker Compose
Use the following command to start all services:
```bash
docker-compose up -d
```

## API Endpoints
Check the detailed API documentation at `/swagger-ui/index.html` after starting the service.

## Testing
HTTP request files for testing the endpoints using tools like Postman or HTTPie are located in the `http-requests` directory.

## License
This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
