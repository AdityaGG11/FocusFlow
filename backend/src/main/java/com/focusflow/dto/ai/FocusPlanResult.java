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
public class FocusPlanResult {
    private String date;
    private String keyFocus;
    private String workloadSummary;
    private List<ScheduleBlock> schedule;
    private String expectedCompletionTime;
    private String productivityStrategy;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScheduleBlock {
        private String time;
        private String block;
        private String activity;
        private String type;
    }
}
