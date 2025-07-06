# Blogit Common Library

A shared library providing common functionality, event definitions, and resilience patterns for Blogit microservices.

## Purpose

This library serves as a foundation for consistent implementation across Blogit's microservices by providing:

1. **Event-Driven Communication**
   - Standardized event definitions
   - Kafka configuration and utilities
   - Event publishing and handling abstractions

2. **Resilience Patterns**
   - Circuit breaker configurations
   - Retry mechanisms
   - Fallback strategies

3. **Common DTOs and Models**
   - Shared data structures
   - Common request/response formats
   - Cross-service data types

## Components

### 1. Event Framework
```java
// Base event interface
public interface DomainEvent<T> {
    UUID getEventId();
    String getEventType();
    T getData();
}

// Usage example
@KafkaListener(topics = "user-events")
public void handleUserEvent(DomainEvent<UserData> event) {
    switch(event.getEventType()) {
        case "USER_REGISTERED": handleRegistration(event);
        case "PROFILE_UPDATED": handleProfileUpdate(event);
    }
}
```

### 2. Kafka Integration
```java
// Publishing events
@Autowired
private EventPublisher publisher;

public void publishEvent() {
    UserRegisteredEvent event = new UserRegisteredEvent(userData);
    publisher.publish(KafkaConfig.TOPIC_USER_EVENTS, event);
}
```

### 3. Circuit Breaker
```java
// Using circuit breaker
@CircuitBreaker(name = "userService")
public UserResponse getUserProfile(String userId) {
    return userClient.getProfile(userId);
}
```

## Event Types

### User Events
- `UserRegisteredEvent`: New user registration
- `ProfileUpdatedEvent`: User profile changes
- `UserFollowEvent`: Follow/unfollow actions

### Post Events
- `PostCreatedEvent`: New post creation
- `PostUpdatedEvent`: Post content updates
- `PostDeletedEvent`: Post deletion

### Interaction Events
- `CommentCreatedEvent`: New comment
- `LikeAddedEvent`: Post/comment likes
- `InteractionDeletedEvent`: Removed interactions

## Usage

1. Add as dependency:
```xml
<dependency>
    <groupId>com.blogit</groupId>
    <artifactId>common</artifactId>
    <version>${project.version}</version>
</dependency>
```

2. Import configurations:
```java
@Import({
    KafkaConfig.class,
    CircuitBreakerConfig.class
})
```

3. Use event publisher:
```java
@Autowired
private EventPublisher publisher;

public void someBusinessLogic() {
    DomainEvent<?> event = new UserRegisteredEvent(data);
    publisher.publish("topic-name", event);
}
```

## Configuration

### Kafka Settings
```yaml
spring:
  kafka:
    bootstrap-servers: kafka:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      group-id: ${spring.application.name}
      auto-offset-reset: earliest
```

### Circuit Breaker Settings
```yaml
resilience4j:
  circuitbreaker:
    instances:
      default:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 10s
```

## Best Practices

1. **Event Design**
   - Keep events immutable
   - Include timestamp and version
   - Use meaningful event types
   - Include necessary context

2. **Error Handling**
   - Implement dead letter queues
   - Handle serialization errors
   - Log failed events
   - Implement retry mechanisms

3. **Circuit Breaker Usage**
   - Define appropriate thresholds
   - Implement fallback methods
   - Monitor breaker states
   - Configure sliding windows

4. **Testing**
   - Unit test event serialization
   - Test circuit breaker behavior
   - Verify event handling
   - Test configuration loading

## Development

### Adding New Events

1. Create event class:
```java
public class NewEventType extends BaseEvent<NewEventData> {
    public static final String EVENT_TYPE = "NEW_EVENT_TYPE";
    
    public NewEventType(NewEventData data) {
        super(EVENT_TYPE);
        this.setData(data);
    }
}
```

2. Create event data:
```java
@Data
@NoArgsConstructor
public class NewEventData {
    private String field1;
    private String field2;
}
```

### Adding Circuit Breakers

1. Define configuration:
```java
@CircuitBreaker(name = "customService")
@Retry(name = "customService")
public Response serviceCall() {
    // Service call
}
```

2. Configure properties:
```yaml
resilience4j:
  circuitbreaker:
    instances:
      customService:
        slidingWindowSize: 10
        failureRateThreshold: 50
```

## Contributing

1. Follow event naming conventions
2. Add proper documentation
3. Include unit tests
4. Update this README for new features 