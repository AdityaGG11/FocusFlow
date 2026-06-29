package com.focusflow.service;

public class PromptTemplates {

    public static final String SYSTEM_INSTRUCTION = 
            "You are FocusFlow's Intelligent Productivity Coach, an elite specialist in cognitive science, behavioral design, and professional task planning. " +
            "You MUST output valid, raw JSON. Do NOT wrap the JSON output in markdown code blocks or backticks. Avoid verbose meta-commentary.";

    public static final String PRIORITIZATION_PROMPT = 
            "Analyze the following active tasks for the user and determine the optimal execution order, urgency, and recommended priority level.\n\n" +
            "Tasks to prioritize:\n" +
            "%s\n\n" +
            "User custom prompt/focus instructions:\n" +
            "%s\n\n" +
            "You MUST return a JSON object with this exact structure:\n" +
            "{\n" +
            "  \"summary\": \"Brief summary of the optimization strategy\",\n" +
            "  \"priorityOrder\": [\n" +
            "    {\n" +
            "      \"taskId\": \"The task ID\",\n" +
            "      \"taskTitle\": \"The task title\",\n" +
            "      \"reasoning\": \"Why this task is placed in this position\",\n" +
            "      \"urgency\": \"HIGH or MEDIUM or LOW\",\n" +
            "      \"estimatedHours\": 2.0\n" +
            "    }\n" +
            "  ],\n" +
            "  \"estimatedFocusHours\": 5.5,\n" +
            "  \"recommendations\": [\"Actionable recommendation 1\", \"Actionable recommendation 2\"],\n" +
            "  \"warnings\": [\"Warning if task load is unrealistic or deadlines are tight\"],\n" +
            "  \"recommendedFirstTask\": \"Title of first task to do\",\n" +
            "  \"explanation\": \"Overall explanation of the scheduling logic\"\n" +
            "}\n";

    public static final String BREAKDOWN_PROMPT = 
            "Deconstruct the following task into 5 to 8 highly actionable, step-by-step subtasks.\n\n" +
            "Task Details:\n" +
            "- Title: '%s'\n" +
            "- Description: '%s'\n" +
            "- Priority: %s\n" +
            "- Deadline: %s\n" +
            "- Estimated Effort: %.1f hours\n\n" +
            "User preferences/instructions:\n" +
            "%s\n\n" +
            "You MUST return a JSON object with this exact structure:\n" +
            "{\n" +
            "  \"taskId\": \"The parent task ID\",\n" +
            "  \"taskTitle\": \"The parent task title\",\n" +
            "  \"summary\": \"Brief introductory breakdown summary\",\n" +
            "  \"subtasks\": [\n" +
            "    {\n" +
            "      \"id\": \"Subtask unique ID (e.g. sub-1)\",\n" +
            "      \"title\": \"Highly actionable subtask title\",\n" +
            "      \"duration\": \"Estimated time (e.g. 30m or 1h)\",\n" +
            "      \"reasoning\": \"Purpose of this subtask\"\n" +
            "    }\n" +
            "  ],\n" +
            "  \"milestones\": [\"Key progress marker 1\", \"Key progress marker 2\"],\n" +
            "  \"blockers\": [\"Potential blocker 1\", \"Potential blocker 2\"],\n" +
            "  \"successCriteria\": \"Concrete definition of task done\"\n" +
            "}\n";

    public static final String DAILY_FOCUS_PLAN_PROMPT = 
            "Design a highly structured, realistic hourly work schedule for today (%s) based on the user's deadlines, priorities, estimated effort, and current workload.\n\n" +
            "Active tasks to schedule:\n" +
            "%s\n\n" +
            "Target Date: %s\n" +
            "User context/schedule constraints:\n" +
            "%s\n\n" +
            "You MUST return a JSON object with this exact structure:\n" +
            "{\n" +
            "  \"date\": \"The target plan date\",\n" +
            "  \"keyFocus\": \"The single most critical objective/task title for the day\",\n" +
            "  \"workloadSummary\": \"Brief summary of total estimated hours vs available hours\",\n" +
            "  \"schedule\": [\n" +
            "    {\n" +
            "      \"time\": \"Time block (e.g., 09:00 - 11:00)\",\n" +
            "      \"block\": \"Block type (e.g., Morning Focus, Afternoon deep work, break)\",\n" +
            "      \"activity\": \"The task title or activity name\",\n" +
            "      \"type\": \"WORK or BREAK\"\n" +
            "    }\n" +
            "  ],\n" +
            "  \"expectedCompletionTime\": \"Estimated finish time (e.g., 17:30)\",\n" +
            "  \"productivityStrategy\": \"Actionable advice for staying on track today\"\n" +
            "}\n";

    public static final String REPLAN_PROMPT = 
            "The user has experienced delays or missed deadlines. Help them recover by updating their schedule and explaining the reasoning behind the modifications.\n\n" +
            "Reason for Delay/Obstacle:\n" +
            "%s\n\n" +
            "Affected Tasks:\n" +
            "%s\n\n" +
            "All Active/Pending Tasks:\n" +
            "%s\n\n" +
            "You MUST return a JSON object with this exact structure:\n" +
            "{\n" +
            "  \"summary\": \"Brief overview of the delay and recovery strategy\",\n" +
            "  \"reason\": \"Analyzed root cause of the delay\",\n" +
            "  \"revisedPriorities\": [\n" +
            "    {\n" +
            "      \"taskId\": \"Task ID\",\n" +
            "      \"taskTitle\": \"Task Title\",\n" +
            "      \"originalPriority\": \"Original priority\",\n" +
            "      \"newPriority\": \"Adjusted priority or urgency status\"\n" +
            "    }\n" +
            "  ],\n" +
            "  \"revisedSchedule\": [\n" +
            "    {\n" +
            "      \"time\": \"Time block\",\n" +
            "      \"activity\": \"Recovery action or task focus\",\n" +
            "      \"action\": \"Specific advice for this block\"\n" +
            "    }\n" +
            "  ],\n" +
            "  \"workRedistribution\": \"Specific tasks shifted or delegated to optimize workload\",\n" +
            "  \"recoverySuggestions\": [\"Immediate recovery tip 1\", \"Immediate recovery tip 2\"],\n" +
            "  \"explanation\": \"Empathetic, structured advice to restore focus and minimize stress\"\n" +
            "}\n";

    public static final String INSIGHTS_PROMPT = 
            "Review the user's task history (both completed and pending tasks) to deliver personalized productivity insights.\n\n" +
            "Completed Tasks:\n" +
            "%s\n\n" +
            "Pending/Active Tasks:\n" +
            "%s\n\n" +
            "You MUST return a JSON object with this exact structure:\n" +
            "{\n" +
            "  \"productivityScore\": 85,\n" +
            "  \"strengths\": [\"Strength 1\", \"Strength 2\"],\n" +
            "  \"weaknesses\": [\"Area of improvement 1\", \"Area of improvement 2\"],\n" +
            "  \"suggestions\": [\"Strategic tip 1\", \"Strategic tip 2\"],\n" +
            "  \"motivation\": \"Judgment-free encouraging summary\"\n" +
            "}\n";
}
