package com.focusflow.dto.task;

import com.focusflow.entity.TaskPriority;
import com.focusflow.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO representing detailed task information returned by the API.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskPriority priority;
    private TaskStatus status;
    private LocalDate deadline;
    private Double estimatedHours;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
