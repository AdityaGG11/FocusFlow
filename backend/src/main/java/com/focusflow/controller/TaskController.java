package com.focusflow.controller;

import com.focusflow.dto.ApiResponse;
import com.focusflow.dto.task.CreateTaskRequest;
import com.focusflow.dto.task.TaskResponse;
import com.focusflow.dto.task.UpdateTaskRequest;
import com.focusflow.entity.TaskPriority;
import com.focusflow.entity.TaskStatus;
import com.focusflow.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody CreateTaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        TaskResponse response = taskService.createTask(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        TaskResponse response = taskService.updateTask(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        taskService.deleteTask(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        TaskResponse response = taskService.getTaskById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Task retrieved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<TaskResponse> response = taskService.getAllTasks(userDetails.getUsername(), status, priority);
        return ResponseEntity.ok(ApiResponse.success("Tasks retrieved successfully", response));
    }
}
