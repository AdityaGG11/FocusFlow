package com.focusflow.dto.task;

import com.focusflow.entity.TaskPriority;
import com.focusflow.entity.TaskStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for updating an existing Task.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Priority is required")
    private TaskPriority priority;

    @NotNull(message = "Status is required")
    private TaskStatus status;

    @NotNull(message = "Deadline is required")
    @FutureOrPresent(message = "Deadline must be in the present or future")
    private LocalDate deadline;

    @NotNull(message = "Estimated hours are required")
    @Positive(message = "Estimated hours must be a positive number")
    private Double estimatedHours;
}
