package com.focusflow.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.focusflow.client.GeminiClient;
import com.focusflow.dto.ai.*;
import com.focusflow.entity.*;
import com.focusflow.exception.ResourceNotFoundException;
import com.focusflow.exception.AIServiceException;
import com.focusflow.repository.AIRecommendationRepository;
import com.focusflow.repository.TaskRepository;
import com.focusflow.repository.UserRepository;
import com.focusflow.mapper.AIRecommendationMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AIService {

    private final GeminiClient geminiClient;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final AIRecommendationRepository aiRecommendationRepository;
    private final AIRecommendationMapper aiRecommendationMapper;
    private final ObjectMapper objectMapper;

    public AIService(
            GeminiClient geminiClient,
            TaskRepository taskRepository,
            UserRepository userRepository,
            AIRecommendationRepository aiRecommendationRepository,
            AIRecommendationMapper aiRecommendationMapper
    ) {
        this.geminiClient = geminiClient;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.aiRecommendationRepository = aiRecommendationRepository;
        this.aiRecommendationMapper = aiRecommendationMapper;
        this.objectMapper = new ObjectMapper();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private String formatTasks(List<Task> tasks) {
        if (tasks == null || tasks.isEmpty()) {
            return "No tasks available.";
        }
        StringBuilder sb = new StringBuilder();
        for (Task task : tasks) {
            sb.append(String.format(
                    "- Task ID: %d, Title: '%s', Description: '%s', Priority: %s, Status: %s, Deadline: %s, Estimated Hours: %.1f\n",
                    task.getId(),
                    task.getTitle(),
                    task.getDescription() != null ? task.getDescription() : "None",
                    task.getPriority(),
                    task.getStatus(),
                    task.getDeadline(),
                    task.getEstimatedHours()
            ));
        }
        return sb.toString();
    }

    @Transactional
    public AIResponse prioritizeTasks(PrioritizeRequest request, String email) {
        User user = getUserByEmail(email);
        List<Task> activeTasks;

        if (request.getTaskIds() != null && !request.getTaskIds().isEmpty()) {
            activeTasks = taskRepository.findAllById(request.getTaskIds()).stream()
                    .filter(t -> t.getUser().getId().equals(user.getId()))
                    .collect(Collectors.toList());
        } else {
            activeTasks = taskRepository.findByUserId(user.getId()).stream()
                    .filter(t -> t.getStatus() != TaskStatus.COMPLETED)
                    .collect(Collectors.toList());
        }

        String taskListStr = formatTasks(activeTasks);
        String customPrompt = request.getCustomPrompt() != null ? request.getCustomPrompt() : "No special instructions.";

        String prompt = String.format(PromptTemplates.PRIORITIZATION_PROMPT, taskListStr, customPrompt);
        String result = geminiClient.generateContent(prompt, PromptTemplates.SYSTEM_INSTRUCTION);

        // Validate structure by parsing into DTO
        try {
            objectMapper.readValue(result, PrioritizationResult.class);
        } catch (Exception e) {
            throw new AIServiceException("Failed to parse and validate structured task prioritization: " + e.getMessage(), e);
        }

        AIRecommendation recommendation = saveOrUpdateRecommendation(user, null, RecommendationType.PRIORITIZATION, result);
        return aiRecommendationMapper.toResponse(recommendation);
    }

    @Transactional
    public AIResponse breakdownTask(BreakdownRequest request, String email) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + request.getTaskId()));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You are not authorized to breakdown this task");
        }

        String customPrompt = request.getCustomPrompt() != null ? request.getCustomPrompt() : "No custom requirements.";

        String prompt = String.format(
                PromptTemplates.BREAKDOWN_PROMPT,
                task.getTitle(),
                task.getDescription() != null ? task.getDescription() : "None",
                task.getPriority(),
                task.getDeadline(),
                task.getEstimatedHours(),
                customPrompt
        );

        String result = geminiClient.generateContent(prompt, PromptTemplates.SYSTEM_INSTRUCTION);

        // Validate structure by parsing into DTO
        try {
            objectMapper.readValue(result, BreakdownResult.class);
        } catch (Exception e) {
            throw new AIServiceException("Failed to parse and validate structured task breakdown: " + e.getMessage(), e);
        }

        AIRecommendation recommendation = saveOrUpdateRecommendation(user, task, RecommendationType.BREAKDOWN, result);
        return aiRecommendationMapper.toResponse(recommendation);
    }

    @Transactional
    public AIResponse generateDailyFocusPlan(FocusPlanRequest request, String email) {
        User user = getUserByEmail(email);
        List<Task> activeTasks;

        if (request.getTaskIds() != null && !request.getTaskIds().isEmpty()) {
            activeTasks = taskRepository.findAllById(request.getTaskIds()).stream()
                    .filter(t -> t.getUser().getId().equals(user.getId()))
                    .collect(Collectors.toList());
        } else {
            activeTasks = taskRepository.findByUserId(user.getId()).stream()
                    .filter(t -> t.getStatus() != TaskStatus.COMPLETED)
                    .collect(Collectors.toList());
        }

        LocalDate targetDate = request.getDate() != null ? request.getDate() : LocalDate.now();
        String customPrompt = request.getCustomPrompt() != null ? request.getCustomPrompt() : "No special constraints.";
        String taskListStr = formatTasks(activeTasks);

        String prompt = String.format(
                PromptTemplates.DAILY_FOCUS_PLAN_PROMPT,
                targetDate,
                taskListStr,
                targetDate,
                customPrompt
        );

        String result = geminiClient.generateContent(prompt, PromptTemplates.SYSTEM_INSTRUCTION);

        // Validate structure by parsing into DTO
        try {
            objectMapper.readValue(result, FocusPlanResult.class);
        } catch (Exception e) {
            throw new AIServiceException("Failed to parse and validate structured daily focus plan: " + e.getMessage(), e);
        }

        AIRecommendation recommendation = saveOrUpdateRecommendation(user, null, RecommendationType.FOCUS_PLAN, result);
        return aiRecommendationMapper.toResponse(recommendation);
    }

    @Transactional
    public AIResponse replanDelayedTasks(ReplanRequest request, String email) {
        User user = getUserByEmail(email);
        List<Task> affectedTasks = null;
        if (request.getAffectedTaskIds() != null && !request.getAffectedTaskIds().isEmpty()) {
            affectedTasks = taskRepository.findAllById(request.getAffectedTaskIds()).stream()
                    .filter(t -> t.getUser().getId().equals(user.getId()))
                    .collect(Collectors.toList());
        }

        List<Task> allActiveTasks = taskRepository.findByUserId(user.getId()).stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED)
                .collect(Collectors.toList());

        String reason = request.getReasonForDelay() != null ? request.getReasonForDelay() : "Unspecified delay/unforeseen circumstances.";
        String affectedStr = affectedTasks != null ? formatTasks(affectedTasks) : "All active tasks affected.";
        String allActiveStr = formatTasks(allActiveTasks);

        String prompt = String.format(
                PromptTemplates.REPLAN_PROMPT,
                reason,
                affectedStr,
                allActiveStr
        );

        String result = geminiClient.generateContent(prompt, PromptTemplates.SYSTEM_INSTRUCTION);

        // Validate structure by parsing into DTO
        try {
            objectMapper.readValue(result, ReplanResult.class);
        } catch (Exception e) {
            throw new AIServiceException("Failed to parse and validate structured schedule recovery: " + e.getMessage(), e);
        }

        AIRecommendation recommendation = saveOrUpdateRecommendation(user, null, RecommendationType.REPLAN, result);
        return aiRecommendationMapper.toResponse(recommendation);
    }

    @Transactional
    public AIResponse generateProductivityInsights(String email) {
        User user = getUserByEmail(email);
        List<Task> allTasks = taskRepository.findByUserId(user.getId());

        List<Task> completed = allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
                .collect(Collectors.toList());

        List<Task> pending = allTasks.stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED)
                .collect(Collectors.toList());

        String completedStr = formatTasks(completed);
        String pendingStr = formatTasks(pending);

        String prompt = String.format(
                PromptTemplates.INSIGHTS_PROMPT,
                completedStr,
                pendingStr
        );

        String result = geminiClient.generateContent(prompt, PromptTemplates.SYSTEM_INSTRUCTION);

        // Validate structure by parsing into DTO
        try {
            objectMapper.readValue(result, ProductivityInsightsResult.class);
        } catch (Exception e) {
            throw new AIServiceException("Failed to parse and validate structured productivity insights: " + e.getMessage(), e);
        }

        AIRecommendation recommendation = saveOrUpdateRecommendation(user, null, RecommendationType.INSIGHT, result);
        return aiRecommendationMapper.toResponse(recommendation);
    }

    @Transactional(readOnly = true)
    public List<AIResponse> getUserRecommendations(String email) {
        User user = getUserByEmail(email);
        List<AIRecommendation> recommendations = aiRecommendationRepository.findByUserId(user.getId());
        return aiRecommendationMapper.toResponseList(recommendations);
    }

    private AIRecommendation saveOrUpdateRecommendation(User user, Task task, RecommendationType type, String responseText) {
        if (task != null) {
            List<AIRecommendation> existing = aiRecommendationRepository.findByTaskId(task.getId());
            for (AIRecommendation rec : existing) {
                if (rec.getRecommendationType() == type) {
                    rec.setResponse(responseText);
                    return aiRecommendationRepository.save(rec);
                }
            }
        } else {
            List<AIRecommendation> existing = aiRecommendationRepository.findByUserIdAndRecommendationType(user.getId(), type);
            if (!existing.isEmpty()) {
                // Overwrite the most recent one to prevent duplicate clutter
                AIRecommendation rec = existing.get(0);
                rec.setResponse(responseText);
                return aiRecommendationRepository.save(rec);
            }
        }

        AIRecommendation newRec = AIRecommendation.builder()
                .user(user)
                .task(task)
                .recommendationType(type)
                .response(responseText)
                .build();
        return aiRecommendationRepository.save(newRec);
    }
}
