package com.focusflow.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO representing a request to prioritize a set of tasks using Gemini.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrioritizeRequest {
    
    /**
     * Optional custom instruction or focus areas provided by the user.
     */
    private String customPrompt;

    /**
     * Specific list of task IDs to prioritize. If null/empty, all active tasks can be used.
     */
    private List<Long> taskIds;
}
