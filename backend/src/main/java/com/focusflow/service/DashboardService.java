package com.focusflow.service;

import com.focusflow.dto.dashboard.DashboardResponse;
import com.focusflow.dto.task.TaskSummaryResponse;
import com.focusflow.entity.Task;
import com.focusflow.entity.TaskPriority;
import com.focusflow.entity.TaskStatus;
import com.focusflow.entity.User;
import com.focusflow.exception.ResourceNotFoundException;
import com.focusflow.mapper.TaskMapper;
import com.focusflow.repository.TaskRepository;
import com.focusflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    public DashboardService(TaskRepository taskRepository, UserRepository userRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.taskMapper = taskMapper;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboardData(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        List<Task> allTasks = taskRepository.findByUserId(user.getId());

        long totalTasks = allTasks.size();
        long todoCount = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).count();
        long inProgressCount = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long completedCount = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
        long highPriorityCount = allTasks.stream().filter(t -> t.getPriority() == TaskPriority.HIGH).count();

        // Outstanding tasks: not completed
        double totalEstimatedHours = allTasks.stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED)
                .mapToDouble(Task::getEstimatedHours)
                .sum();

        // Urgent tasks: Top 5 outstanding tasks sorted by deadline ascending
        LocalDate today = LocalDate.now();
        List<TaskSummaryResponse> urgentTasks = allTasks.stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED)
                .sorted((t1, t2) -> {
                    int c = t1.getDeadline().compareTo(t2.getDeadline());
                    if (c != 0) return c;
                    return t2.getPriority().compareTo(t1.getPriority());
                })
                .limit(5)
                .map(taskMapper::toSummaryResponse)
                .collect(Collectors.toList());

        // Calculate custom status message
        long tasksDueToday = allTasks.stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED && t.getDeadline().equals(today))
                .count();

        long overdueTasks = allTasks.stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED && t.getDeadline().isBefore(today))
                .count();

        String statusMessage;
        if (overdueTasks > 0) {
            statusMessage = String.format("Attention: You have %d overdue task(s)! Please review your priorities.", overdueTasks);
        } else if (tasksDueToday > 0) {
            statusMessage = String.format("You have %d task(s) due today. Let's make today productive!", tasksDueToday);
        } else if (todoCount + inProgressCount == 0) {
            statusMessage = "All clear! You have no outstanding tasks. Ready to plan some new goals?";
        } else {
            statusMessage = String.format("You have %d outstanding task(s) in your queue. Keep focusing!", (todoCount + inProgressCount));
        }

        return DashboardResponse.builder()
                .totalTasks(totalTasks)
                .todoCount(todoCount)
                .inProgressCount(inProgressCount)
                .completedCount(completedCount)
                .highPriorityCount(highPriorityCount)
                .totalEstimatedHours(totalEstimatedHours)
                .urgentTasks(urgentTasks)
                .statusMessage(statusMessage)
                .build();
    }
}
