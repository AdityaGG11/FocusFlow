package com.focusflow.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO representing a recovery replan request for missed deadlines or delays.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReplanRequest {

    /**
     * Explanation of delay or changes in constraints (e.g. "I got sick", "Spent extra time on coding").
     */
    private String reasonForDelay;

    /**
     * Optional target tasks affected by the delays.
     */
    private List<Long> affectedTaskIds;
}
