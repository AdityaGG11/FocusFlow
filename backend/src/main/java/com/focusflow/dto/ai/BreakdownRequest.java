package com.focusflow.dto.ai;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing a request to breakdown a task into actionable sub-steps.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreakdownRequest {

    @NotNull(message = "Task ID is required")
    private Long taskId;

    /**
     * Optional level of detail or specific requirements for sub-steps.
     */
    private String customPrompt;
}
