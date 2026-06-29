package com.focusflow.dto.dashboard;

import com.focusflow.dto.task.TaskSummaryResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Comprehensive DTO representing the aggregate status of a user's productivity workspace.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    
    // Total tasks count
    private long totalTasks;

    // Count of tasks in Todo status
    private long todoCount;

    // Count of tasks in Progress status
    private long inProgressCount;

    // Count of tasks in Completed status
    private long completedCount;

    // High priority tasks count
    private long highPriorityCount;

    // Total workload estimate in hours (for outstanding tasks)
    private double totalEstimatedHours;

    // List of upcoming critical/due tasks
    private List<TaskSummaryResponse> urgentTasks;

    // Optional quick summary or status message (e.g. "You have 3 tasks due today!")
    private String statusMessage;
}
