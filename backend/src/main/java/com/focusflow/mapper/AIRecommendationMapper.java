package com.focusflow.mapper;

import com.focusflow.dto.ai.AIResponse;
import com.focusflow.entity.AIRecommendation;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between AIRecommendation entity and AIResponse DTO.
 */
@Component
public class AIRecommendationMapper {

    /**
     * Map AIRecommendation entity to AIResponse DTO.
     *
     * @param recommendation The AIRecommendation entity.
     * @return AIResponse DTO.
     */
    public AIResponse toResponse(AIRecommendation recommendation) {
        if (recommendation == null) {
            return null;
        }

        return AIResponse.builder()
                .id(recommendation.getId())
                .userId(recommendation.getUser() != null ? recommendation.getUser().getId() : null)
                .taskId(recommendation.getTask() != null ? recommendation.getTask().getId() : null)
                .recommendationType(recommendation.getRecommendationType())
                .response(recommendation.getResponse())
                .createdAt(recommendation.getCreatedAt())
                .build();
    }

    /**
     * Convert list of AIRecommendation entities to a list of AIResponse DTOs.
     *
     * @param recommendations List of AIRecommendation entities.
     * @return List of AIResponse DTOs.
     */
    public List<AIResponse> toResponseList(List<AIRecommendation> recommendations) {
        if (recommendations == null) {
            return new ArrayList<>();
        }
        return recommendations.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
