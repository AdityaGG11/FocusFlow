/**
 * Shared types and enums for FocusFlow AI (Frontend & Backend).
 */

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum RecommendationType {
  PRIORITIZATION = "PRIORITIZATION",
  BREAKDOWN = "BREAKDOWN",
  FOCUS_PLAN = "FOCUS_PLAN",
  REPLAN = "REPLAN",
  INSIGHT = "INSIGHT",
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Kept optional for security
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string; // ISO string or YYYY-MM-DD
  estimatedHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIRecommendation {
  id: string;
  taskId?: string; // Optional depending on recommendation type
  recommendationType: RecommendationType;
  response: string; // Stringified markdown or structured JSON returned by Gemini
  createdAt: string;
}

// REST API standardized response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Authentication requests & responses
export interface AuthResponseData {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
