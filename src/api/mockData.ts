import { Task, TaskPriority, TaskStatus, AIRecommendation, RecommendationType } from "../types";

// Persistent mock state in LocalStorage
const TASKS_KEY = "focusflow_mock_tasks";
const RECS_KEY = "focusflow_mock_recs";

const DEFAULT_TASKS: Task[] = [
  {
    id: "1",
    userId: "demo-user-1",
    title: "Complete Advanced DBMS Project Schema",
    description: "Design 3NF relational normalization structures, establish foreign key constraints, and implement seed data for user profiles.",
    priority: TaskPriority.HIGH,
    status: TaskStatus.IN_PROGRESS,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 days from now
    estimatedHours: 6.0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    userId: "demo-user-1",
    title: "Revise Operating System Mutex Lectures",
    description: "Study semaphores, race conditions, dining philosophers problem, and practice standard concurrent synchronization programming.",
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 4 days from now
    estimatedHours: 4.0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    userId: "demo-user-1",
    title: "Optimize Spring Boot Security JWT Filters",
    description: "Debug stateful session leaks, optimize token verification filter chain, and write validation tests for malicious endpoints.",
    priority: TaskPriority.HIGH,
    status: TaskStatus.TODO,
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 day from now
    estimatedHours: 3.5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    userId: "demo-user-1",
    title: "Draft Phase 5 Production Readiness Readme",
    description: "Compile deployment instructions, configuration environment variable definitions, and write script explanations.",
    priority: TaskPriority.LOW,
    status: TaskStatus.COMPLETED,
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Yesterday
    estimatedHours: 2.0,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function getMockTasks(): Task[] {
  const stored = localStorage.getItem(TASKS_KEY);
  if (!stored) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(DEFAULT_TASKS));
    return DEFAULT_TASKS;
  }
  return JSON.parse(stored);
}

export function saveMockTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function getMockRecommendations(): AIRecommendation[] {
  const stored = localStorage.getItem(RECS_KEY);
  if (!stored) {
    const initialRecs: AIRecommendation[] = [
      {
        id: "rec-init-1",
        recommendationType: RecommendationType.PRIORITIZATION,
        response: JSON.stringify({
          summary: "Optimized execution order for active tasks to maximize impact and meet upcoming deadlines.",
          priorityOrder: [
            {
              taskId: "3",
              taskTitle: "Optimize Spring Boot Security JWT Filters",
              reasoning: "Critical security issue. Deadline is in 24 hours. Tackle this first to ensure endpoint stability.",
              urgency: "HIGH",
              estimatedHours: 3.5
            },
            {
              taskId: "1",
              taskTitle: "Complete Advanced DBMS Project Schema",
              reasoning: "High priority architectural schema item. Forms base of database model, ideal for middle energy slot.",
              urgency: "HIGH",
              estimatedHours: 6.0
            },
            {
              taskId: "2",
              taskTitle: "Revise Operating System Mutex Lectures",
              reasoning: "Revision and study item. Can be done after the primary coding milestones are closed.",
              urgency: "MEDIUM",
              estimatedHours: 4.0
            }
          ],
          estimatedFocusHours: 13.5,
          recommendations: [
            "Dedicate early morning peak cognitive block to Spring Boot Filter debugging.",
            "Schedule DBMS design after a substantial rest lunch block."
          ],
          warnings: [
            "Your workspace backlog totals 13.5 hours. Consider planning secondary items for tomorrow morning."
          ],
          recommendedFirstTask: "Optimize Spring Boot Security JWT Filters",
          explanation: "Completing critical security items reduces immediate operational risk, creating structural focus for schema development."
        }),
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(RECS_KEY, JSON.stringify(initialRecs));
    return initialRecs;
  }
  return JSON.parse(stored);
}

export function saveMockRecommendations(recs: AIRecommendation[]) {
  localStorage.setItem(RECS_KEY, JSON.stringify(recs));
}

// Generate dynamic dashboard metrics based on actual mock tasks
export function getMockDashboardStats() {
  const tasks = getMockTasks();
  const totalCount = tasks.length;
  const todoCount = tasks.filter(t => t.status === TaskStatus.TODO).length;
  const inProgressCount = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  const completedCount = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  
  const totalHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const completedHours = tasks.filter(t => t.status === TaskStatus.COMPLETED).reduce((sum, t) => sum + t.estimatedHours, 0);
  
  // Calculate completion trend (last 7 days grouped by date)
  const completionsByDate: { [key: string]: number } = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    completionsByDate[d] = 0;
  }
  
  tasks.forEach(t => {
    if (t.status === TaskStatus.COMPLETED) {
      const dateStr = t.deadline || new Date().toISOString().split("T")[0];
      if (completionsByDate[dateStr] !== undefined) {
        completionsByDate[dateStr] += 1;
      }
    }
  });

  const completionTrend = Object.keys(completionsByDate).map(date => ({
    date,
    count: completionsByDate[date]
  }));

  const activeTasks = tasks.filter(t => t.status !== TaskStatus.COMPLETED);
  const sortedActive = [...activeTasks].sort((a, b) => {
    const priorityWeight = { [TaskPriority.HIGH]: 3, [TaskPriority.MEDIUM]: 2, [TaskPriority.LOW]: 1 };
    return (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
  });

  const urgentTasksMapped = sortedActive.slice(0, 5).map(t => ({
    id: isNaN(Number(t.id)) ? 0 : Number(t.id),
    title: t.title,
    description: t.description || "",
    priority: t.priority,
    status: t.status,
    deadline: t.deadline || new Date().toISOString().split("T")[0],
    estimatedHours: t.estimatedHours
  }));

  const realHighPriorityCount = tasks.filter(t => t.priority === TaskPriority.HIGH && t.status !== TaskStatus.COMPLETED).length;

  return {
    totalTasks: totalCount,
    todoCount,
    inProgressCount,
    completedCount,
    highPriorityCount: realHighPriorityCount,
    totalEstimatedHours: totalHours,
    completedEstimatedHours: completedHours,
    completionTrend,
    urgentTasks: urgentTasksMapped,
    statusMessage: "System operational in Preview Mode."
  };
}

// Generate highly customized Gemini-style responses dynamically as serialized structured JSON
export function generateGeminiMockResponse(type: RecommendationType, payload: any): string {
  const tasks = getMockTasks().filter(t => t.status !== TaskStatus.COMPLETED);
  
  switch (type) {
    case RecommendationType.PRIORITIZATION: {
      const resultObj = {
        summary: "Optimized execution order for active tasks to maximize impact and meet upcoming deadlines.",
        priorityOrder: [
          {
            taskId: tasks[0]?.id || "1",
            taskTitle: tasks[0]?.title || "Complete Advanced DBMS Project Schema",
            reasoning: "High priority task. It forms the foundation of your application data model and must be addressed early.",
            urgency: "HIGH",
            estimatedHours: tasks[0]?.estimatedHours || 6.0
          },
          {
            taskId: tasks[1]?.id || "3",
            taskTitle: tasks[1]?.title || "Optimize Spring Boot Security JWT Filters",
            reasoning: "Critical security issue. Highly urgent to avoid open vulnerabilities in endpoints.",
            urgency: "HIGH",
            estimatedHours: tasks[1]?.estimatedHours || 3.5
          },
          {
            taskId: tasks[2]?.id || "2",
            taskTitle: tasks[2]?.title || "Revise Operating System Mutex Lectures",
            reasoning: "Standard revision item. Can be completed during low-cognitive energy windows.",
            urgency: "MEDIUM",
            estimatedHours: tasks[2]?.estimatedHours || 4.0
          }
        ],
        estimatedFocusHours: tasks.reduce((sum, t) => sum + t.estimatedHours, 0) || 13.5,
        recommendations: [
          "Dedicate the first 4 hours of the morning to high-cognition database tasks.",
          "Take 15-minute breaks between distinct context blocks to restore mental energy."
        ],
        warnings: [
          "Your active task backlog contains several hours of intensive effort. Consider splitting some tasks into smaller parts."
        ],
        recommendedFirstTask: tasks[0]?.title || "Complete Advanced DBMS Project Schema",
        explanation: "Tackle your primary technical blocks first while your energy levels are high, followed by security filtering adjustments."
      };
      return JSON.stringify(resultObj);
    }

    case RecommendationType.BREAKDOWN: {
      const taskId = payload.taskId ? payload.taskId.toString() : "";
      const targetTask = getMockTasks().find(t => t.id === taskId) || tasks[0];
      const title = targetTask ? targetTask.title : "Complex Target Project";
      const hours = targetTask ? targetTask.estimatedHours : 4;
      
      const resultObj = {
        taskId: targetTask?.id || "1",
        taskTitle: title,
        summary: `Step-by-step deconstruction of the master objective: "${title}".`,
        subtasks: [
          { id: "sub-1", title: "Identify all entity attributes and relationships", duration: "45m", reasoning: "Provides the raw requirements schema." },
          { id: "sub-2", title: "Draft the Entity-Relationship (ER) diagram", duration: "1h 15m", reasoning: "Visualizes structural relationships." },
          { id: "sub-3", title: "Apply 3NF database normalization rules", duration: "1h", reasoning: "Removes design redundancy and update issues." },
          { id: "sub-4", title: "Write SQL creation scripts", duration: "1h 30m", reasoning: "Creates physical database tables." },
          { id: "sub-5", title: "Seed tables with initial test profiles", duration: "1h", reasoning: "Allows validation of data query pathways." }
        ],
        milestones: ["ER Diagram finalized", "Schema normalized", "Creation script completed", "Initial profiles seeded"],
        blockers: ["Verify local development database server is fully running before executing seed scripts."],
        successCriteria: "Schema passes 3NF verification and compiles with zero warnings or constraint errors."
      };
      return JSON.stringify(resultObj);
    }

    case RecommendationType.FOCUS_PLAN: {
      const resultObj = {
        date: new Date().toISOString().split("T")[0],
        keyFocus: tasks[0]?.title || "Complete Advanced DBMS Project Schema",
        workloadSummary: "Focus plan covers 6.5 hours of scheduled work with Pomodoro intervals.",
        schedule: [
          { time: "09:00 - 09:30", block: "Setup Block", activity: "Review checklist and verify connections", type: "BREAK" },
          { time: "09:30 - 11:30", block: "Focus Block A", activity: tasks[0]?.title || "Complete Advanced DBMS Project Schema", type: "WORK" },
          { time: "11:30 - 11:45", block: "Breathing Break", activity: "Mindful breathing and stretching", type: "BREAK" },
          { time: "11:45 - 13:00", block: "Focus Block B", activity: tasks[1]?.title || "Optimize Spring Boot Security JWT Filters", type: "WORK" },
          { time: "13:00 - 14:00", block: "Lunch Break", activity: "Step away from work computer", type: "BREAK" },
          { time: "14:00 - 15:30", block: "Focus Block C", activity: "Review and refine coding components", type: "WORK" },
          { time: "15:30 - 15:45", block: "Afternoon Rest", activity: "Hydrate and stretch", type: "BREAK" },
          { time: "15:45 - 17:00", block: "Focus Block D", activity: tasks[2]?.title || "Revise Operating System Mutex Lectures", type: "WORK" }
        ],
        expectedCompletionTime: "17:00",
        productivityStrategy: "Work inside uninterrupted focus blocks. Close all instant messaging applications."
      };
      return JSON.stringify(resultObj);
    }

    case RecommendationType.REPLAN: {
      const reason = payload.reasonForDelay || "unplanned delays";
      const resultObj = {
        summary: "Timeline recovery adjustment roadmap to restore momentum.",
        reason: reason,
        revisedPriorities: [
          {
            taskId: tasks[1]?.id || "3",
            taskTitle: tasks[1]?.title || "Optimize Spring Boot Security JWT Filters",
            originalPriority: "MEDIUM",
            newPriority: "HIGH"
          }
        ],
        revisedSchedule: [
          { time: "09:00 - 11:30", activity: "Solve security filter issue", action: "Urgent recovery deep work" },
          { time: "11:45 - 13:00", activity: "Resume DBMS schema work", action: "Execution block" }
        ],
        workRedistribution: "Defer study or theoretical lectures until tomorrow morning to expand immediate coding time.",
        recoverySuggestions: [
          "Establish an uninterrupted 2-hour morning block.",
          "Verify the blocking error details before starting code corrections."
        ],
        explanation: "By postponing theory blocks, we recover 2.5 hours of high-energy time to secure database filter paths immediately."
      };
      return JSON.stringify(resultObj);
    }

    case RecommendationType.INSIGHT: {
      const allMock = getMockTasks();
      const completed = allMock.filter(t => t.status === TaskStatus.COMPLETED).length;
      const pending = allMock.filter(t => t.status !== TaskStatus.COMPLETED).length;
      
      const resultObj = {
        productivityScore: 85,
        strengths: [
          "Consistent resolution of high priority deliverables.",
          "High accuracy in task time estimation blocks."
        ],
        weaknesses: [
          "Scheduling major task deadlines concurrently.",
          "Omitting rest intervals between deep work blocks."
        ],
        suggestions: [
          "Include a 15-minute walking or stretching break after intense milestones.",
          "Create a 12-hour buffer ahead of high-demand tasks."
        ],
        motivation: "You've successfully completed multiple low priority items. Build on this momentum to tackle your DBMS schema modeling!"
      };
      return JSON.stringify(resultObj);
    }

    default:
      return "Unable to determine recommendation type.";
  }
}
