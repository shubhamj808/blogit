# Blogit Common Module

This module contains common code, DTOs, events, and utilities shared across different microservices in the Blogit application.

## Overview

The common module provides:
- Common DTOs for API responses
- Domain events for Kafka messaging
- Exception handling utilities
- Kafka configuration
- Circuit breaker and retry configurations

## Dependencies

The module requires:
- Java 21
- Maven 3.9.x
- Spring Boot 3.2.x

## Building the Module

Before building any service that depends on this module, you must first build and install this module to your local Maven repository:

```bash
# Navigate to the common module directory
cd common

# Build and install to local Maven repository
mvn clean install
```

## Usage

To use this module in other services, add the following dependency to your service's `pom.xml`:

```xml
<dependency>
    <groupId>com.blogit</groupId>
    <artifactId>common</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Package Structure

- `com.blogit.common.dto`: Common DTOs used across services
- `com.blogit.common.event`: Domain events for Kafka messaging
  - `interaction`: Interaction-related events
  - `post`: Post-related events
  - `user`: User-related events
- `com.blogit.common.exception`: Common exception handling
- `com.blogit.common.kafka`: Kafka configuration and utilities
- `com.blogit.common.resilience`: Circuit breaker and retry configurations

## Event Types

### User Events
- `UserRegisteredEvent`: Triggered when a new user registers

### Post Events
- `PostCreatedEvent`: Triggered when a new post is created

### Interaction Events
- `LikeAddedEvent`: Triggered when a user likes a post

## Contributing

When adding new shared functionality:
1. Create appropriate package structure
2. Add necessary tests
3. Update documentation
4. Ensure backward compatibility
5. Increment version if breaking changes are introduced

## Docker Build Support

For Docker builds, ensure the common module is included in the build context and built before the service that depends on it. Example Dockerfile:

```dockerfile
# Build stage
FROM maven:3.9.10-eclipse-temurin-21 as builder

# Copy and build common module first
WORKDIR /app/common
COPY common/pom.xml .
COPY common/src ./src
RUN mvn clean install

# Then build the service
WORKDIR /app/service
COPY service/pom.xml .
RUN mvn dependency:go-offline -B
COPY service/src ./src
RUN mvn clean package -DskipTests
``` 