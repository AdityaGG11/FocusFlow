import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  BrainCircuit, 
  Sparkles, 
  ArrowUpRight, 
  Calendar, 
  HelpCircle 
} from "lucide-react";
import { dataProvider } from "../api/dataProvider";
import { AIRecommendation, RecommendationType } from "../types";
import StructuredRecommendationRenderer from "../components/StructuredRecommendationRenderer";

interface DashboardData {
  totalTasks: number;
  todoCount: number;
  inProgressCount: number;
  completedCount: number;
  highPriorityCount: number;
  totalEstimatedHours: number;
  urgentTasks: Array<{
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    deadline: string;
    estimatedHours: number;
  }>;
  statusMessage: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real dashboard stats from the database (or fallback mock)
    dataProvider.getDashboardStats()
      .then((stats) => {
        setData(stats);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard data:", err);
      })
      .finally(() => {
        setLoading(false);
      });

    // Load recommendations from backend
    dataProvider.getAIRecommendations()
      .then((dbRecs) => {
        if (dbRecs && dbRecs.length > 0) {
          setRecommendations(dbRecs);
        } else {
          loadFallbackRecommendations();
        }
      })
      .catch((err) => {
        console.error("Failed to fetch database recommendations, loading fallback:", err);
        loadFallbackRecommendations();
      });
  }, []);

  const loadFallbackRecommendations = () => {
    const storedRecs = localStorage.getItem("focusflow_recommendations");
    if (storedRecs) {
      setRecommendations(JSON.parse(storedRecs));
    } else {
      const defaultRecs: AIRecommendation[] = [
        {
          id: "rec-1",
          recommendationType: RecommendationType.PRIORITIZATION,
          response: "### **Focus Plan Recommended**:\n\n1. **Review your task board** to start scheduling targets.\n2. **Select high-priority items** first to build focus momentum.\n3. Celebrate each completion to sustain velocity!",
          createdAt: new Date().toISOString()
        }
      ];
      setRecommendations(defaultRecs);
      localStorage.setItem("focusflow_recommendations", JSON.stringify(defaultRecs));
    }
  };

  const pendingCount = data ? (data.todoCount + data.inProgressCount) : 0;
  const completedCount = data ? data.completedCount : 0;
  const highPriorityCount = data ? data.highPriorityCount : 0;

  if (loading) {
    return (
      <div className="space-y-8 sm:space-y-10 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-3">
            <div className="h-7 w-48 bg-slate-200 rounded-xl"></div>
            <div className="h-4 w-72 bg-slate-200 rounded-lg"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 bg-slate-200 rounded-full"></div>
            <div className="h-10 w-28 bg-slate-200 rounded-full"></div>
          </div>
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="neumorphic-raised bg-white p-6 flex items-center space-x-4">
              <div className="h-14 w-14 bg-slate-200 rounded-2xl shrink-0"></div>
              <div className="space-y-2.5 w-full">
                <div className="h-3 w-16 bg-slate-100 rounded"></div>
                <div className="h-6 w-12 bg-slate-200 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="neumorphic-raised bg-white p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="h-5 w-36 bg-slate-200 rounded"></div>
                <div className="h-3 w-12 bg-slate-100 rounded"></div>
              </div>
              {[1, 2].map((x) => (
                <div key={x} className="border border-slate-100 rounded-2xl p-4 space-y-2">
                  <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
                  <div className="h-3 w-full bg-slate-100 rounded"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="neumorphic-raised bg-white p-6 space-y-4">
              <div className="border-b border-slate-100 pb-4">
                <div className="h-5 w-40 bg-slate-200 rounded"></div>
              </div>
              <div className="h-40 bg-slate-100 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in">
      
      {/* Dynamic Welcome Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1E293B]">
            Welcome back, Achiever
          </h1>
          <p className="text-[#718096] text-xs sm:text-sm mt-1 max-w-xl font-medium">
            {data?.statusMessage || `You have ${pendingCount} pending tasks to crush today. Let's make some headway!`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/ai-assistant"
            className="flex items-center space-x-2 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-orange-600 px-5 py-3 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <BrainCircuit size={14} className="text-orange-500" />
            <span>Consult Gemini</span>
          </Link>
          <Link
            to="/tasks"
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-3 rounded-full text-xs font-bold transition-all shadow-md shadow-orange-500/10 active:scale-95"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>Add Task</span>
          </Link>
        </div>
      </div>

      {/* Numerical Stats - Soft Neumorphic Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Pending Stat */}
        <div className="neumorphic-raised neumorphic-raised-hover bg-white p-6 flex items-center space-x-4">
          <div className="bg-orange-50 p-4 rounded-2xl text-orange-600 border border-orange-100/50">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#718096] uppercase tracking-wider block font-bold">Pending Tasks</span>
            <span className="font-display text-2xl font-bold text-[#1E293B] block mt-1">
              {pendingCount}
            </span>
          </div>
        </div>

        {/* Completed Stat */}
        <div className="neumorphic-raised neumorphic-raised-hover bg-white p-6 flex items-center space-x-4">
          <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 border border-emerald-100/50">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#718096] uppercase tracking-wider block font-bold">Completed Tasks</span>
            <span className="font-display text-2xl font-bold text-[#1E293B] block mt-1">
              {completedCount}
            </span>
          </div>
        </div>

        {/* High Priority Stat */}
        <div className="neumorphic-raised neumorphic-raised-hover bg-white p-6 flex items-center space-x-4 sm:col-span-2 lg:col-span-1">
          <div className={`p-4 rounded-2xl border ${highPriorityCount > 0 ? "bg-red-50 text-red-600 border-red-100/50" : "bg-slate-50 text-[#718096] border-slate-100/50"}`}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#718096] uppercase tracking-wider block font-bold">High Priority</span>
            <span className={`font-display text-2xl font-bold block mt-1 ${highPriorityCount > 0 ? "text-red-600" : "text-[#1E293B]"}`}>
              {highPriorityCount}
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: High-Priority Tasks & Today's Plan */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Urgent Tasks Panel */}
          <div className="neumorphic-raised bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-4">
              <h2 className="font-display font-bold text-base text-[#1E293B] flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-500" />
                <span>Urgent Active Tasks</span>
              </h2>
              <Link to="/tasks" className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 hover:underline">
                <span>View all</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>

            {!data || data.urgentTasks.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <CheckCircle2 size={32} className="text-emerald-500/30 mx-auto" />
                <p className="text-xs text-[#718096] font-medium">Zero outstanding active tasks. Splendid!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.urgentTasks.map((task) => (
                  <div key={task.id} className="bg-[#F8FAFC]/70 border border-[#E2E8F0] hover:border-orange-500/35 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-sm duration-200">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-sans font-semibold text-sm text-[#2D3748]">{task.title}</h3>
                        <p className="text-xs text-[#718096] mt-1 line-clamp-1">{task.description}</p>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        task.priority === "HIGH" ? "bg-red-50 text-red-600 border border-red-100" :
                        task.priority === "MEDIUM" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                        "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#E2E8F0] text-xs text-[#718096]">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar size={12} className="text-orange-500" />
                        <span className="font-mono text-[11px]">{task.deadline}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[11px] font-medium">{task.estimatedHours} hrs</span>
                      <span>•</span>
                      <span className="font-mono uppercase text-[10px] font-bold text-orange-600">{task.status.replace("_", " ")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Core Daily Focus Plan */}
          <div className="neumorphic-raised bg-white p-6">
            <h2 className="font-display font-bold text-base text-[#1E293B] flex items-center gap-2 border-b border-[#E2E8F0] pb-4 mb-4">
              <Calendar size={18} className="text-orange-500" />
              <span>Today's Focus Plan</span>
            </h2>
            <div className="space-y-4">
              <p className="text-xs text-[#718096] leading-relaxed font-medium">
                We've combined your databases, deadlines, and priorities to organize an optimized routine. Need personalized breakdowns or focus recommendations? Consult Gemini in the assistant tab.
              </p>
              
              {/* Highlight card for current main task */}
              {data && data.urgentTasks.length > 0 ? (
                <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-600 block">PRIMARY TARGET</span>
                  <h4 className="text-sm font-bold text-[#1E293B] mt-1">{data.urgentTasks[0].title}</h4>
                  <p className="text-xs text-[#718096] mt-1.5 leading-relaxed">{data.urgentTasks[0].description}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-orange-100 text-xs">
                    <span className="text-[#4A5568] font-medium">Est. Duration: <strong className="font-mono text-orange-600 font-bold">{data.urgentTasks[0].estimatedHours}h</strong></span>
                    <span className="bg-orange-500 text-white px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold">
                      {data.urgentTasks[0].status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-[#718096] font-medium">No active tasks to display in the Focus Plan.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: AI Panel */}
        <div className="lg:col-span-5">
          <div className="neumorphic-raised bg-white p-6 flex flex-col min-h-[400px]">
            <div className="flex items-center gap-2 text-orange-500 border-b border-[#E2E8F0] pb-4 mb-4">
              <Sparkles size={18} />
              <h2 className="font-display font-bold text-base text-[#1E293B]">Gemini Intelligence</h2>
            </div>

            {recommendations.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center py-12 text-center text-[#718096] space-y-3">
                <HelpCircle size={32} className="stroke-[1.5] text-[#A0AEC0]" />
                <p className="text-xs font-medium">No active recommendations. Head over to the AI Assistant to generate insights.</p>
              </div>
            ) : (
              <div className="flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase font-bold tracking-wider border border-orange-100">
                      {recommendations[0].recommendationType.replace("_", " ")}
                    </span>
                    <span className="text-[10px] font-mono text-[#A0AEC0] font-bold">
                      {new Date(recommendations[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {/* Neumorphic inset text response */}
                  <div className="neumorphic-pressed p-4 rounded-2xl text-xs text-[#2D3748] leading-relaxed font-sans space-y-2 overflow-y-auto max-h-[350px]">
                    <StructuredRecommendationRenderer response={recommendations[0].response} type={recommendations[0].recommendationType} />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0]">
                  <Link
                    to="/ai-assistant"
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold py-3 rounded-full transition-all shadow-md shadow-orange-500/10 active:scale-95"
                  >
                    <span>Open AI Companion Dashboard</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
