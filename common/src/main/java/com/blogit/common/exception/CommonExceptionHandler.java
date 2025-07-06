package com.blogit.common.exception;

import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@Slf4j
public abstract class CommonExceptionHandler {
    
    @ExceptionHandler(CallNotPermittedException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public ApiResponse<Void> handleCircuitBreakerException(CallNotPermittedException ex) {
        log.error("Circuit breaker is open", ex);
        return ApiResponse.error("Service is temporarily unavailable. Please try again later.");
    }
    
    @ExceptionHandler(RequestNotPermitted.class)
    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    public ApiResponse<Void> handleRateLimitException(RequestNotPermitted ex) {
        log.error("Rate limit exceeded", ex);
        return ApiResponse.error("Too many requests. Please try again later.");
    }
    
    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiResponse<Void> handleIllegalStateException(IllegalStateException ex) {
        log.error("Illegal state", ex);
        return ApiResponse.error(ex.getMessage());
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse<Void> handleResourceNotFoundException(ResourceNotFoundException ex) {
        log.error("Resource not found", ex);
        return ApiResponse.error(ex.getMessage());
    }
} 