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
public class BreakdownResult {
    private String taskId;
    private String taskTitle;
    private String summary;
    private List<SubtaskItem> subtasks;
    private List<String> milestones;
    private List<String> blockers;
    private String successCriteria;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubtaskItem {
        private String id;
        private String title;
        private String duration;
        private String reasoning;
    }
}
