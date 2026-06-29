package com.focusflow.service;

import com.focusflow.dto.task.CreateTaskRequest;
import com.focusflow.dto.task.TaskResponse;
import com.focusflow.dto.task.UpdateTaskRequest;
import com.focusflow.entity.Task;
import com.focusflow.entity.TaskPriority;
import com.focusflow.entity.TaskStatus;
import com.focusflow.entity.User;
import com.focusflow.exception.ForbiddenException;
import com.focusflow.exception.ResourceNotFoundException;
import com.focusflow.mapper.TaskMapper;
import com.focusflow.repository.TaskRepository;
import com.focusflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.taskMapper = taskMapper;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private Task getTaskEntityAndAuthorize(Long taskId, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
        
        if (!task.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You are not authorized to access this task");
        }
        return task;
    }

    @Transactional
    public TaskResponse createTask(CreateTaskRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Task task = taskMapper.toEntity(request, user);
        Task savedTask = taskRepository.save(task);
        return taskMapper.toResponse(savedTask);
    }

    @Transactional
    public TaskResponse updateTask(Long id, UpdateTaskRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Task task = getTaskEntityAndAuthorize(id, user);
        taskMapper.updateEntityFromRequest(request, task);
        Task updatedTask = taskRepository.save(task);
        return taskMapper.toResponse(updatedTask);
    }

    @Transactional
    public void deleteTask(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Task task = getTaskEntityAndAuthorize(id, user);
        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Task task = getTaskEntityAndAuthorize(id, user);
        return taskMapper.toResponse(task);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(String userEmail, TaskStatus status, TaskPriority priority) {
        User user = getUserByEmail(userEmail);
        List<Task> tasks;

        if (status != null && priority != null) {
            tasks = taskRepository.findByUserIdAndStatusAndPriority(user.getId(), status, priority);
        } else if (status != null) {
            tasks = taskRepository.findByUserIdAndStatus(user.getId(), status);
        } else {
            tasks = taskRepository.findByUserId(user.getId());
            if (priority != null) {
                tasks = tasks.stream()
                        .filter(t -> t.getPriority() == priority)
                        .collect(Collectors.toList());
            }
        }

        // Default sorting: deadline ascending, then priority (HIGH first), then ID ascending
        return tasks.stream()
                .sorted((t1, t2) -> {
                    int c = t1.getDeadline().compareTo(t2.getDeadline());
                    if (c != 0) return c;
                    c = t2.getPriority().compareTo(t1.getPriority()); // HIGH > MEDIUM > LOW
                    if (c != 0) return c;
                    return t1.getId().compareTo(t2.getId());
                })
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }
}
