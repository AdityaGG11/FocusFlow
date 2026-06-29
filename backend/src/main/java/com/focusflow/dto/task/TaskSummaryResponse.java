package com.focusflow.dto.task;

import com.focusflow.entity.TaskPriority;
import com.focusflow.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Lightweight DTO representing a summary of a task.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskSummaryResponse {
    private Long id;
    private String title;
    private TaskPriority priority;
    private TaskStatus status;
    private LocalDate deadline;
    private Double estimatedHours;
}
