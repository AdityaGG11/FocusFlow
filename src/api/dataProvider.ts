import { Task, AIRecommendation, RecommendationType, TaskPriority, TaskStatus } from "../types";
import { 
  getMockTasks, 
  saveMockTasks, 
  getMockRecommendations, 
  saveMockRecommendations, 
  getMockDashboardStats, 
  generateGeminiMockResponse 
} from "./mockData";
import apiClient from "./apiClient";

// Configuration flag for Preview Mode.
// When set to true, the application runs entirely with simulated local data.
// We default to true but check import.meta.env for toggles.
export const PREVIEW_MODE = false;

export interface IDataProvider {
  login(email: string, password: string): Promise<{ name: string; email: string; token: string }>;
  register(name: string, email: string, password: string): Promise<{ name: string; email: string; token: string }>;
  getDashboardStats(): Promise<any>;
  getAIRecommendations(): Promise<AIRecommendation[]>;
  getTasks(): Promise<Task[]>;
  createTask(taskData: any): Promise<Task>;
  updateTask(id: string, taskData: any): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  generateAI(endpoint: string, payload: any): Promise<AIRecommendation>;
}

// 1. API Data Provider communicating with Spring Boot backend via Axios
export const ApiDataProvider: IDataProvider = {
  async login(email, password) {
    const res = await apiClient.post("/auth/login", { email, password });
    return res.data.data;
  },
  async register(name, email, password) {
    const res = await apiClient.post("/auth/register", { name, email, password });
    return res.data.data;
  },
  async getDashboardStats() {
    const res = await apiClient.get("/dashboard");
    return res.data.data;
  },
  async getAIRecommendations() {
    const res = await apiClient.get("/ai/recommendations");
    return res.data.data || [];
  },
  async getTasks() {
    const res = await apiClient.get("/tasks");
    return res.data.data || [];
  },
  async createTask(taskData) {
    const res = await apiClient.post("/tasks", taskData);
    return res.data.data;
  },
  async updateTask(id, taskData) {
    const res = await apiClient.put(`/tasks/${id}`, taskData);
    return res.data.data;
  },
  async deleteTask(id) {
    await apiClient.delete(`/tasks/${id}`);
  },
  async generateAI(endpoint, payload) {
    const res = await apiClient.post(endpoint, payload, { timeout: 30000 });
    return res.data.data;
  }
};

// 2. Preview Data Provider running entirely client-side using localStorage
export const PreviewDataProvider: IDataProvider = {
  async login(email, password) {
    if (email.toLowerCase() === "demo@focusflow.ai" && password === "password123") {
      return {
        name: "Demo User",
        email: "demo@focusflow.ai",
        token: "mock-jwt-token-focusflow"
      };
    } else {
      const stored = localStorage.getItem("focusflow_mock_users");
      if (stored) {
        try {
          const users = JSON.parse(stored);
          const matched = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
          if (matched) {
            return {
              name: matched.name,
              email: matched.email,
              token: "mock-jwt-token-focusflow"
            };
          }
        } catch (e) {
          // ignore
        }
      }
      throw new Error("Invalid email or password.");
    }
  },

  async register(name, email, password) {
    if (!name || !email || !password) {
      throw new Error("Please fill in all fields.");
    }
    const stored = localStorage.getItem("focusflow_mock_users");
    let users = [];
    if (stored) {
      try {
        users = JSON.parse(stored);
      } catch (e) {}
    }
    const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      users.push({ name, email, password });
      localStorage.setItem("focusflow_mock_users", JSON.stringify(users));
    }
    return {
      name,
      email,
      token: "mock-jwt-token-focusflow"
    };
  },

  async getDashboardStats() {
    return getMockDashboardStats();
  },

  async getAIRecommendations() {
    return getMockRecommendations();
  },

  async getTasks() {
    return getMockTasks();
  },

  async createTask(taskData) {
    const tasks = getMockTasks();
    const newTask: Task = {
      id: (tasks.length > 0 ? Math.max(...tasks.map(t => Number(t.id))) + 1 : 1).toString(),
      userId: "demo-user-1",
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority || TaskPriority.MEDIUM,
      status: taskData.status || TaskStatus.TODO,
      deadline: taskData.deadline,
      estimatedHours: Number(taskData.estimatedHours) || 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveMockTasks(tasks);
    return newTask;
  },

  async updateTask(id, taskData) {
    const tasks = getMockTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      tasks[idx] = {
        ...tasks[idx],
        ...taskData,
        updatedAt: new Date().toISOString()
      };
      saveMockTasks(tasks);
      return tasks[idx];
    }
    throw new Error(`Task with ID ${id} not found.`);
  },

  async deleteTask(id) {
    const tasks = getMockTasks();
    const filtered = tasks.filter(t => t.id !== id);
    saveMockTasks(filtered);
  },

  async generateAI(endpoint, payload) {
    let type: RecommendationType;
    let taskId: string | undefined = undefined;

    if (endpoint.includes("/prioritize")) {
      type = RecommendationType.PRIORITIZATION;
    } else if (endpoint.includes("/breakdown")) {
      type = RecommendationType.BREAKDOWN;
      taskId = payload.taskId?.toString();
    } else if (endpoint.includes("/focus-plan")) {
      type = RecommendationType.FOCUS_PLAN;
    } else if (endpoint.includes("/replan")) {
      type = RecommendationType.REPLAN;
    } else if (endpoint.includes("/insights")) {
      type = RecommendationType.INSIGHT;
    } else {
      throw new Error(`Unsupported AI endpoint: ${endpoint}`);
    }

    const responseText = generateGeminiMockResponse(type, payload);
    const newRec: AIRecommendation = {
      id: `rec-${Date.now()}`,
      recommendationType: type,
      response: responseText,
      taskId: taskId,
      createdAt: new Date().toISOString()
    };

    const currentRecs = getMockRecommendations().filter(r => r.recommendationType !== type);
    const updatedRecs = [newRec, ...currentRecs];
    saveMockRecommendations(updatedRecs);

    return newRec;
  }
};

// Select and export the active provider based on PREVIEW_MODE
export const dataProvider: IDataProvider = PREVIEW_MODE ? PreviewDataProvider : ApiDataProvider;
