package com.focusflow.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.focusflow.dto.ApiResponse;
import com.focusflow.dto.ai.AIResponse;
import com.focusflow.dto.ai.BreakdownRequest;
import com.focusflow.dto.ai.FocusPlanRequest;
import com.focusflow.dto.ai.PrioritizeRequest;
import com.focusflow.dto.ai.ReplanRequest;
import com.focusflow.service.AIService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/prioritize")
    public ResponseEntity<ApiResponse<AIResponse>> prioritizeTasks(
            @RequestBody PrioritizeRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        AIResponse response = aiService.prioritizeTasks(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Tasks prioritized successfully", response));
    }

    @PostMapping("/breakdown")
    public ResponseEntity<ApiResponse<AIResponse>> breakdownTask(
            @Valid @RequestBody BreakdownRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        AIResponse response = aiService.breakdownTask(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Task breakdown generated successfully", response));
    }

    @PostMapping("/focus-plan")
    public ResponseEntity<ApiResponse<AIResponse>> generateFocusPlan(
            @RequestBody FocusPlanRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        AIResponse response = aiService.generateDailyFocusPlan(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Daily focus plan generated successfully", response));
    }

    @PostMapping("/replan")
    public ResponseEntity<ApiResponse<AIResponse>> replanDelayedTasks(
            @RequestBody ReplanRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        AIResponse response = aiService.replanDelayedTasks(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Recovery plan generated successfully", response));
    }

    @PostMapping("/insights")
    public ResponseEntity<ApiResponse<AIResponse>> generateProductivityInsights(
            @AuthenticationPrincipal UserDetails userDetails) {
        AIResponse response = aiService.generateProductivityInsights(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Productivity insights generated successfully", response));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<AIResponse>>> getRecommendations(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<AIResponse> response = aiService.getUserRecommendations(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Recommendations retrieved successfully", response));
    }
}
