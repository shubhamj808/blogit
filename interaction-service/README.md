# Interaction Service

## Overview
The Interaction Service is designed to handle user interactions with posts, such as likes, comments, and other engagement features. It will integrate with PostgreSQL, Kafka, Redis, and OpenTelemetry, and will use Swagger for API documentation.

## Features
- Manage likes and comments on posts
- Provide real-time updates using Kafka
- Handle caching with Redis
- Expose RESTful APIs
- Integrated monitoring and tracing with OpenTelemetry

## Technology Stack
- Java Spring Boot
- PostgreSQL
- Kafka
- Redis
- OpenTelemetry
- Swagger

## API Endpoints
Detailed API specifications will be documented using Swagger.

## Configuration
### Database
- Host: `postgres` (configured in `docker-compose.yml`)
- Port: `5432`
- Database: `blogit_db`

### Kafka
- Broker: `kafka:9092`
- Zookeeper: `zookeeper:2181`

### Redis
- Host: `redis`
- Port: `6379`

## Monitoring
Integrated with OpenTelemetry for distributed tracing and monitoring.

## Build Instructions
1. Ensure Docker is running.
2. Run `docker-compose up` to start required infrastructure components.
3. Build with Maven: `mvn clean package`

## Usage
### Running the Service
Execute the JAR file created by Maven build:
```
java -jar target/interaction-service-0.0.1-SNAPSHOT.jar
```

## Contributing
Please fork the repository and create pull requests for new features or bug fixes.
