package com.focusflow.mapper;

import com.focusflow.dto.task.CreateTaskRequest;
import com.focusflow.dto.task.TaskResponse;
import com.focusflow.dto.task.TaskSummaryResponse;
import com.focusflow.dto.task.UpdateTaskRequest;
import com.focusflow.entity.Task;
import com.focusflow.entity.User;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Task entity and Task-related DTOs.
 */
@Component
public class TaskMapper {

    /**
     * Map CreateTaskRequest to a new Task entity associated with a User.
     *
     * @param request The CreateTaskRequest DTO.
     * @param user    The owner User entity.
     * @return Task entity.
     */
    public Task toEntity(CreateTaskRequest request, User user) {
        if (request == null) {
            return null;
        }

        return Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(request.getStatus())
                .deadline(request.getDeadline())
                .estimatedHours(request.getEstimatedHours())
                .user(user)
                .recommendations(new ArrayList<>())
                .build();
    }

    /**
     * Update an existing Task entity using properties from UpdateTaskRequest.
     *
     * @param request The UpdateTaskRequest DTO.
     * @param task    The existing Task entity to update.
     */
    public void updateEntityFromRequest(UpdateTaskRequest request, Task task) {
        if (request == null || task == null) {
            return;
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setDeadline(request.getDeadline());
        task.setEstimatedHours(request.getEstimatedHours());
    }

    /**
     * Map Task entity to TaskResponse DTO.
     *
     * @param task The Task entity.
     * @return TaskResponse DTO.
     */
    public TaskResponse toResponse(Task task) {
        if (task == null) {
            return null;
        }

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .status(task.getStatus())
                .deadline(task.getDeadline())
                .estimatedHours(task.getEstimatedHours())
                .userId(task.getUser() != null ? task.getUser().getId() : null)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    /**
     * Map Task entity to TaskSummaryResponse DTO.
     *
     * @param task The Task entity.
     * @return TaskSummaryResponse DTO.
     */
    public TaskSummaryResponse toSummaryResponse(Task task) {
        if (task == null) {
            return null;
        }

        return TaskSummaryResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .priority(task.getPriority())
                .status(task.getStatus())
                .deadline(task.getDeadline())
                .estimatedHours(task.getEstimatedHours())
                .build();
    }

    /**
     * Convert list of Task entities to a list of TaskResponse DTOs.
     *
     * @param tasks The list of Task entities.
     * @return List of TaskResponse DTOs.
     */
    public List<TaskResponse> toResponseList(List<Task> tasks) {
        if (tasks == null) {
            return new ArrayList<>();
        }
        return tasks.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convert list of Task entities to a list of TaskSummaryResponse DTOs.
     *
     * @param tasks The list of Task entities.
     * @return List of TaskSummaryResponse DTOs.
     */
    public List<TaskSummaryResponse> toSummaryResponseList(List<Task> tasks) {
        if (tasks == null) {
            return new ArrayList<>();
        }
        return tasks.stream()
                .map(this::toSummaryResponse)
                .collect(Collectors.toList());
    }
}
