package com.blogit.common.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseEvent<T> implements DomainEvent<T> {
    private UUID eventId;
    private String eventType;
    private String version;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime timestamp;
    
    private T data;
    
    protected BaseEvent(String eventType) {
        this.eventId = UUID.randomUUID();
        this.eventType = eventType;
        this.version = "1.0";
        this.timestamp = LocalDateTime.now();
    }
} 