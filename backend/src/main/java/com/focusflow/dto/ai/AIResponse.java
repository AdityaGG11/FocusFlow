package com.focusflow.dto.ai;

import com.focusflow.entity.RecommendationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO representing an AI recommendation response returned to the client.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIResponse {
    private Long id;
    private Long userId;
    private Long taskId;
    private RecommendationType recommendationType;
    private String response;
    private LocalDateTime createdAt;
}
