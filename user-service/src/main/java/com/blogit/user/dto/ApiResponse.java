package com.blogit.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Standard API response wrapper")
public class ApiResponse<T> {
    
    @Schema(description = "Whether the operation was successful")
    private boolean success;
    
    @Schema(description = "Response data")
    private T data;
    
    @Schema(description = "Response message")
    private String message;
    
    @Schema(description = "Response timestamp")
    private LocalDateTime timestamp;
    
    @Schema(description = "Error details if operation failed")
    private ErrorDetails error;
    
    @Schema(description = "Pagination information if applicable")
    private PaginationInfo pagination;
    
    @Schema(description = "Token associated with the response")
    private String token;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Error details")
    public static class ErrorDetails {
        @Schema(description = "Error code")
        private String code;
        
        @Schema(description = "Error message")
        private String message;
        
        @Schema(description = "Request path where error occurred")
        private String path;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Pagination information")
    public static class PaginationInfo {
        @Schema(description = "Current page number (0-based)")
        private int page;
        
        @Schema(description = "Number of items per page")
        private int size;
        
        @Schema(description = "Total number of items")
        private long total;
        
        @Schema(description = "Total number of pages")
        private int totalPages;
    }
    
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static <T> ApiResponse<T> success(T data, PaginationInfo pagination) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .pagination(pagination)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static <T> ApiResponse<T> success(T data, String token, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .token(token)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static <T> ApiResponse<T> error(String error) {
        return ApiResponse.<T>builder()
                .success(false)
                .error(ErrorDetails.builder()
                        .code(null)
                        .message(error)
                        .path(null)
                        .build())
                .timestamp(LocalDateTime.now())
                .build();
    }
} 