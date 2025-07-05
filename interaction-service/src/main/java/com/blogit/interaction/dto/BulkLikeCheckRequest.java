package com.blogit.interaction.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkLikeCheckRequest {
    
    @NotEmpty(message = "Post IDs list cannot be empty")
    @Size(max = 50, message = "Maximum 50 post IDs allowed per request")
    private List<UUID> postIds;
}
