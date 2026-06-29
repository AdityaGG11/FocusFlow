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
public class ReplanResult {
    private String summary;
    private String reason;
    private List<RevisedPriorityItem> revisedPriorities;
    private List<RevisedScheduleItem> revisedSchedule;
    private String workRedistribution;
    private List<String> recoverySuggestions;
    private String explanation;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevisedPriorityItem {
        private String taskId;
        private String taskTitle;
        private String originalPriority;
        private String newPriority;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevisedScheduleItem {
        private String time;
        private String activity;
        private String action;
    }
}
