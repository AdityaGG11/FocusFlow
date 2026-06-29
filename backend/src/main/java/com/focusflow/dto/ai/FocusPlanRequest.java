package com.focusflow.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO representing a request to generate a structured daily focus plan.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FocusPlanRequest {

    /**
     * The date for which the focus plan should be constructed. Defaults to today.
     */
    private LocalDate date;

    /**
     * Optional tasks to explicitly include in the focus plan.
     */
    private List<Long> taskIds;

    /**
     * Additional user context or dynamic schedule constraints.
     */
    private String customPrompt;
}
