import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Plus,
  Search,
  Trash2,
  Edit3,
  CheckCircle2,
  Calendar,
  HelpCircle,
  X,
  AlertCircle,
} from "lucide-react";
import { Task, TaskPriority, TaskStatus } from "../types";
import { dataProvider } from "../api/dataProvider";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("DEADLINE_ASC");

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState<TaskPriority>(
    TaskPriority.MEDIUM,
  );
  const [formDeadline, setFormDeadline] = useState("");
  const [formHours, setFormHours] = useState<number>(2);
  const [editingTaskId, setEditingTaskId] = useState<string | number | null>(
    null,
  );

  // Fetch Tasks
  const fetchTasks = () => {
    setLoading(true);
    dataProvider
      .getTasks()
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        console.error("Failed to load tasks:", err);
        setError("Unable to load tasks from the server. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDeadline) return;

    setError("");
    const requestData = {
      title: formTitle,
      description: formDesc,
      priority: formPriority,
      status: TaskStatus.TODO,
      deadline: formDeadline,
      estimatedHours: Number(formHours),
    };

    if (editingTaskId) {
      const taskToUpdate = tasks.find((t) => t.id === editingTaskId);
      const updatedData = {
        ...requestData,
        status: taskToUpdate?.status || TaskStatus.TODO,
      };

      dataProvider
        .updateTask(editingTaskId.toString(), updatedData)
        .then(() => {
          fetchTasks();
          closeFormModal();
        })
        .catch((err) => {
          setError(err.message || "Failed to update task.");
        });
    } else {
      dataProvider
        .createTask(requestData)
        .then(() => {
          fetchTasks();
          closeFormModal();
        })
        .catch((err) => {
          setError(err.message || "Failed to create task.");
        });
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setFormTitle(task.title);
    setFormDesc(task.description || "");
    setFormPriority(task.priority);
    setFormDeadline(task.deadline);
    setFormHours(task.estimatedHours);
    setIsModalOpen(true);
  };

  const closeFormModal = () => {
    setIsModalOpen(false);
    setEditingTaskId(null);
    setFormTitle("");
    setFormDesc("");
    setFormPriority(TaskPriority.MEDIUM);
    setFormDeadline("");
    setFormHours(2);
    setError("");
  };

  const handleDelete = (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    dataProvider
      .deleteTask(id.toString())
      .then(() => {
        fetchTasks();
      })
      .catch((err) => {
        console.error("Failed to delete task:", err);
        alert(err.message || "Failed to delete task.");
      });
  };

  const handleStatusChange = (id: string | number, newStatus: TaskStatus) => {
    const taskToUpdate = tasks.find((t) => t.id === id);
    if (!taskToUpdate) return;

    const updatedData = {
      title: taskToUpdate.title,
      description: taskToUpdate.description,
      priority: taskToUpdate.priority,
      status: newStatus,
      deadline: taskToUpdate.deadline,
      estimatedHours: taskToUpdate.estimatedHours,
    };

    dataProvider
      .updateTask(id.toString(), updatedData)
      .then(() => {
        fetchTasks();
      })
      .catch((err) => {
        console.error("Failed to update status:", err);
        alert(err.message || "Failed to change task status.");
      });
  };

  // Filter and Sort execution locally
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "ALL" || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === "DEADLINE_ASC") {
        return a.deadline.localeCompare(b.deadline);
      }
      if (sortBy === "DEADLINE_DESC") {
        return b.deadline.localeCompare(a.deadline);
      }
      if (sortBy === "PRIORITY_DESC") {
        const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (sortBy === "CREATED_DESC") {
        return b.createdAt.localeCompare(a.createdAt);
      }
      return 0;
    });

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1E293B] tracking-tight flex items-center gap-2.5">
            <CheckSquare className="text-orange-500 stroke-[2.5]" size={28} />
            <span>Task Board</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#718096] mt-1 font-medium">
            Real-time visual companion to coordinate, track, and manage targets.
          </p>
        </div>

        <button
          id="btn-add-task"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-3 rounded-full text-xs font-bold transition-all shadow-md shadow-orange-500/10 active:scale-95 cursor-pointer"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Control panel (Search & Filter) */}
      <div className="neumorphic-raised bg-white p-5 flex flex-col md:flex-row gap-4 items-center">
        {/* Search input */}
        <div className="relative w-full md:flex-grow">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0]"
          />
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full neumorphic-input py-2.5 pl-11 pr-4 text-xs text-[#2D3748]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status filter */}
          <div className="flex items-center space-x-2 bg-[#F5F7FA] border border-[#E2E8F0]/80 px-3.5 py-2.5 rounded-xl text-xs font-semibold">
            <span className="text-[#718096] font-mono text-[10px]">
              STATUS:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[#2D3748] outline-none cursor-pointer font-bold font-sans text-xs"
            >
              <option value="ALL">All</option>
              <option value="TODO">To-Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex items-center space-x-2 bg-[#F5F7FA] border border-[#E2E8F0]/80 px-3.5 py-2.5 rounded-xl text-xs font-semibold">
            <span className="text-[#718096] font-mono text-[10px]">
              PRIORITY:
            </span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-[#2D3748] outline-none cursor-pointer font-bold font-sans text-xs"
            >
              <option value="ALL">All</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Sorter */}
          <div className="flex items-center space-x-2 bg-[#F5F7FA] border border-[#E2E8F0]/80 px-3.5 py-2.5 rounded-xl text-xs font-semibold">
            <span className="text-[#718096] font-mono text-[10px]">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[#2D3748] outline-none cursor-pointer font-bold font-sans text-xs"
            >
              <option value="DEADLINE_ASC">Deadline (Soonest)</option>
              <option value="DEADLINE_DESC">Deadline (Furthest)</option>
              <option value="PRIORITY_DESC">Priority (High-to-Low)</option>
              <option value="CREATED_DESC">Date Created</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-[#718096] animate-pulse">
            Refreshing board telemetry...
          </p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="neumorphic-raised bg-white py-16 text-center max-w-2xl mx-auto space-y-4">
          <HelpCircle size={44} className="text-[#CBD5E1] mx-auto" />
          <h3 className="font-bold text-base text-[#1E293B]">
            No tasks found on this configuration
          </h3>
          <p className="text-xs text-[#718096] max-w-sm mx-auto font-medium">
            Try resetting your search query or filters, or create a brand-new
            task to populate your workspace.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`neumorphic-raised neumorphic-raised-hover bg-white p-5 flex flex-col justify-between transition-all duration-300 border-l-[6px] ${
                task.status === TaskStatus.COMPLETED
                  ? "border-l-emerald-400 border-t border-b border-r border-[#E2E8F0]"
                  : task.priority === TaskPriority.HIGH
                    ? "border-l-red-400 border-t border-b border-r border-[#E2E8F0]"
                    : task.priority === TaskPriority.MEDIUM
                      ? "border-l-amber-400 border-t border-b border-r border-[#E2E8F0]"
                      : "border-l-blue-400 border-t border-b border-r border-[#E2E8F0]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  {/* Priority Tag */}
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border tracking-wider ${
                      task.priority === TaskPriority.HIGH
                        ? "bg-red-50 text-red-600 border-red-100"
                        : task.priority === TaskPriority.MEDIUM
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-blue-50 text-blue-600 border-blue-100"
                    }`}
                  >
                    {task.priority}
                  </span>

                  {/* Deadline text badge */}
                  <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-[#718096]">
                    <Calendar size={13} className="text-orange-500" />
                    <span>{task.deadline}</span>
                  </div>
                </div>

                {/* Title and Description */}
                <h3
                  className={`font-bold text-[#1E293B] text-sm mt-3.5 leading-snug ${task.status === TaskStatus.COMPLETED ? "line-through text-[#94A3B8]" : ""}`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-xs text-[#718096] mt-2 line-clamp-3 leading-relaxed font-medium">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Footer controllers */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between mt-5 pt-4 border-t border-[#E2E8F0] gap-4">
                {/* Segmented Controller Style State Action Toggle */}
                <div className="flex items-center space-x-1 bg-[#F5F7FA] border border-[#E2E8F0] p-1 rounded-full text-[10px] font-bold">
                  <button
                    onClick={() => handleStatusChange(task.id, TaskStatus.TODO)}
                    className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                      task.status === TaskStatus.TODO
                        ? "bg-white text-orange-600 shadow-sm border border-[#E2E8F0]"
                        : "text-[#718096] hover:text-[#2D3748]"
                    }`}
                  >
                    To-Do
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(task.id, TaskStatus.IN_PROGRESS)
                    }
                    className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                      task.status === TaskStatus.IN_PROGRESS
                        ? "bg-white text-orange-600 shadow-sm border border-[#E2E8F0]"
                        : "text-[#718096] hover:text-[#2D3748]"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(task.id, TaskStatus.COMPLETED)
                    }
                    className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                      task.status === TaskStatus.COMPLETED
                        ? "bg-white text-emerald-600 shadow-sm border border-[#E2E8F0]"
                        : "text-[#718096] hover:text-[#2D3748]"
                    }`}
                  >
                    Done
                  </button>
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(task)}
                    className="p-2 text-[#718096] hover:text-orange-500 bg-[#F5F7FA] hover:bg-orange-50 border border-[#E2E8F0] rounded-xl transition-all cursor-pointer shadow-sm"
                    title="Edit Task"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 text-[#718096] hover:text-red-500 bg-[#F5F7FA] hover:bg-red-50 border border-[#E2E8F0] rounded-xl transition-all cursor-pointer shadow-sm"
                    title="Delete Task"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Creation / Editing Modal (React Overlay) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#E2E8F0] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden transform transition-all">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 bg-[#F8FAFC]">
              <h2 className="font-display font-bold text-[#1E293B] text-base">
                {editingTaskId ? "Edit Task Details" : "Add New Task Target"}
              </h2>
              <button
                onClick={closeFormModal}
                className="p-1.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F5F7FA] text-[#718096] transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs animate-fade-in">
                <AlertCircle
                  size={16}
                  className="shrink-0 mt-0.5 text-red-500"
                />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateOrUpdate} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-[#718096] mb-1.5 ml-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Advanced Database Schema"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full neumorphic-input py-2.5 px-3.5 text-xs text-[#2D3748]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-[#718096] mb-1.5 ml-1">
                  Description
                </label>
                <textarea
                  placeholder="Provide context or core instructions for this work..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={3}
                  className="w-full neumorphic-input py-2.5 px-3.5 text-xs text-[#2D3748] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#718096] mb-1.5 ml-1">
                    Priority *
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) =>
                      setFormPriority(e.target.value as TaskPriority)
                    }
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-xs text-[#2D3748] outline-none focus:border-orange-500/50 transition-all cursor-pointer font-bold font-sans"
                  >
                    <option value={TaskPriority.LOW}>Low</option>
                    <option value={TaskPriority.MEDIUM}>Medium</option>
                    <option value={TaskPriority.HIGH}>High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#718096] mb-1.5 ml-1">
                    Est. Effort (Hours) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formHours}
                    onChange={(e) => setFormHours(Number(e.target.value))}
                    className="w-full neumorphic-input py-2.5 px-3.5 text-xs text-[#2D3748]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-[#718096] mb-1.5 ml-1">
                  Deadline *
                </label>
                <input
                  type="date"
                  required
                  value={formDeadline}
                  onChange={(e) => setFormDeadline(e.target.value)}
                  className="w-full neumorphic-input py-2.5 px-3.5 text-xs text-[#2D3748] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="px-4.5 py-2.5 text-xs font-bold text-[#718096] hover:text-[#1A202C] hover:bg-[#F5F7FA] rounded-full transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md shadow-orange-500/10 active:scale-95 cursor-pointer"
                >
                  {editingTaskId ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
