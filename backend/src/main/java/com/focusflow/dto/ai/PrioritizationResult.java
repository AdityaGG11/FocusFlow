package com.focusflow.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrioritizationResult {
    private String summary;
    private List<TaskPriorityItem> priorityOrder;
    private Double estimatedFocusHours;
    private List<String> recommendations;
    private List<String> warnings;
    private String recommendedFirstTask;
    private String explanation;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskPriorityItem {
        private String taskId;
        private String taskTitle;
        private String reasoning;
        private String urgency;
        private Double estimatedHours;
    }
}
