package com.blogit.common.event;

import java.time.LocalDateTime;
import java.util.UUID;

public interface DomainEvent<T> {
    UUID getEventId();
    String getEventType();
    String getVersion();
    LocalDateTime getTimestamp();
    T getData();
} 