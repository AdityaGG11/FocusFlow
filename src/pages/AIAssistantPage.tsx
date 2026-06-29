import React, { useState, useEffect } from "react";
import { 
  BrainCircuit, 
  Sparkles, 
  ListOrdered, 
  Workflow, 
  CalendarRange, 
  TrendingUp, 
  RefreshCw, 
  HelpCircle,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  Info
} from "lucide-react";
import { Task, AIRecommendation, RecommendationType, TaskStatus } from "../types";
import { dataProvider } from "../api/dataProvider";
import StructuredRecommendationRenderer from "../components/StructuredRecommendationRenderer";

export default function AIAssistantPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState<RecommendationType>(RecommendationType.PRIORITIZATION);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Custom user parameters
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [reasonForDelay, setReasonForDelay] = useState<string>("");

  // Fetch tasks and recommendations on mount
  useEffect(() => {
    fetchTasks();
    fetchRecommendations();
  }, []);

  const fetchTasks = () => {
    dataProvider.getTasks()
      .then((data) => {
        const fetchedTasks = data || [];
        setTasks(fetchedTasks);
        
        // Pick first pending task as default selected task for breakdown
        const pending = fetchedTasks.filter((t: Task) => t.status !== TaskStatus.COMPLETED);
        if (pending.length > 0) {
          setSelectedTaskId(pending[0].id.toString());
        }
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
      });
  };

  const fetchRecommendations = () => {
    dataProvider.getAIRecommendations()
      .then((data) => {
        setRecommendations(data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch database recommendations, falling back to local cache:", err);
        const storedRecs = localStorage.getItem("focusflow_recommendations");
        if (storedRecs) {
          setRecommendations(JSON.parse(storedRecs));
        }
      });
  };

  const getActiveRecommendation = () => {
    return recommendations.find((r) => r.recommendationType === activeTab);
  };

  const handleAIAction = async (type: RecommendationType) => {
    setIsLoading(true);
    setError("");
    
    let endpoint = "";
    let payload = {};

    switch (type) {
      case RecommendationType.PRIORITIZATION:
        endpoint = "/ai/prioritize";
        payload = { customPrompt: customPrompt.trim() };
        break;
      case RecommendationType.BREAKDOWN:
        if (!selectedTaskId) {
          setError("Please select a task to breakdown first.");
          setIsLoading(false);
          return;
        }
        endpoint = "/ai/breakdown";
        payload = { 
          taskId: Number(selectedTaskId), 
          customPrompt: customPrompt.trim() 
        };
        break;
      case RecommendationType.FOCUS_PLAN:
        endpoint = "/ai/focus-plan";
        payload = { customPrompt: customPrompt.trim() };
        break;
      case RecommendationType.REPLAN:
        endpoint = "/ai/replan";
        payload = { 
          reasonForDelay: reasonForDelay.trim() || "Unforeseen delays",
          affectedTaskIds: [] 
        };
        break;
      case RecommendationType.INSIGHT:
        endpoint = "/ai/insights";
        payload = {};
        break;
    }

    // Call dynamic backend Gemini endpoints with extended timeout
    dataProvider.generateAI(endpoint, payload)
      .then((newRec) => {
        // Update recommendations list state
        const updatedRecs = [newRec, ...recommendations.filter(r => r.recommendationType !== type)];
        setRecommendations(updatedRecs);
        
        // Cache to local storage as fallback
        localStorage.setItem("focusflow_recommendations", JSON.stringify(updatedRecs));
        
        // Reset inputs
        setCustomPrompt("");
        setReasonForDelay("");
      })
      .catch((err) => {
        console.error("AI service request failed:", err);
        setError(err.message || "Gemini service encountered an issue. Please verify your GEMINI_API_KEY in Secrets.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionCards = [
    {
      type: RecommendationType.PRIORITIZATION,
      title: "Intelligent Task Prioritization",
      desc: "Determine execution order and priority reasoning across all active tasks.",
      icon: ListOrdered,
      color: "text-orange-600 bg-orange-50 border-orange-100/50"
    },
    {
      type: RecommendationType.BREAKDOWN,
      title: "Granular Task Breakdown",
      desc: "Decompose any complex task into simple, actionable steps.",
      icon: Workflow,
      color: "text-blue-600 bg-blue-50 border-blue-100/50"
    },
    {
      type: RecommendationType.FOCUS_PLAN,
      title: "Daily Focus Planner",
      desc: "Generate a realistic workspace schedule tailored to your capacity.",
      icon: CalendarRange,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100/50"
    },
    {
      type: RecommendationType.REPLAN,
      title: "Schedule Recovery",
      desc: "Adjust and replan automatically to overcome delayed work.",
      icon: RefreshCw,
      color: "text-purple-600 bg-purple-50 border-purple-100/50"
    },
    {
      type: RecommendationType.INSIGHT,
      title: "Productivity Insights",
      desc: "Analyze task data to identify work habits, strengths, and bottlenecks.",
      icon: TrendingUp,
      color: "text-rose-600 bg-rose-50 border-rose-100/50"
    }
  ];

  const activeRec = getActiveRecommendation();
  const pendingTasks = tasks.filter(t => t.status !== TaskStatus.COMPLETED);

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in">
      {/* Page Heading */}
      <div className="flex items-center space-x-3.5">
        <div className="bg-orange-50 p-3 rounded-2xl text-orange-600 border border-orange-100/50">
          <BrainCircuit size={28} className="stroke-[2.5]" />
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1E293B] tracking-tight">
            AI Assistant Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#718096] mt-1 font-medium">
            Tap into Google Gemini's cognitive layer to schedule, recover, and plan your workflows dynamically.
          </p>
        </div>
      </div>

      {/* Primary Layout Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: AI Operations selection panel */}
        <div className="lg:col-span-5 space-y-4">
          {actionCards.map((card) => {
            const Icon = card.icon;
            const active = activeTab === card.type;
            return (
              <button
                key={card.type}
                onClick={() => {
                  setActiveTab(card.type);
                  setError("");
                }}
                className={`w-full text-left p-4.5 rounded-2xl transition-all flex items-start gap-4 cursor-pointer duration-200 ${
                  active 
                    ? "bg-[#EBF1FA]/80 border border-[#CBD9E9] shadow-[inset_3px_3px_6px_rgba(165,175,190,0.3),inset_-3px_-3px_6px_#ffffff]" 
                    : "neumorphic-raised bg-white border border-[#E2E8F0]/85 hover:bg-[#F8FAFC]"
                }`}
              >
                <div className={`p-3 rounded-xl border ${card.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-grow">
                  <h3 className={`font-sans font-bold text-xs sm:text-sm ${active ? "text-orange-600" : "text-[#1E293B]"}`}>
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-[#718096] mt-1 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>
                <ChevronRight size={16} className={`mt-2 transition-transform ${active ? "text-orange-600 translate-x-1" : "text-[#CBD5E1]"}`} />
              </button>
            );
          })}
        </div>

        {/* Right column: Interactive Execution panel */}
        <div className="lg:col-span-7 bg-white neumorphic-raised p-6 min-h-[500px] flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-orange-500" />
                <h2 className="font-display font-bold text-base text-[#1E293B]">
                  {actionCards.find(c => c.type === activeTab)?.title}
                </h2>
              </div>
              <span className="text-[10px] font-mono text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full uppercase font-bold">
                LIVE GEMINI
              </span>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs animate-fade-in">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Context Inputs customized based on operation type */}
            <div className="space-y-4">
              {activeTab === RecommendationType.BREAKDOWN && (
                <div className="bg-[#F8FAFC]/70 border border-[#E2E8F0] p-4.5 rounded-2xl space-y-2.5 animate-fade-in">
                  <label className="block text-[10px] font-mono font-bold uppercase text-orange-600 ml-0.5">
                    Select Target Task for Breakdown:
                  </label>
                  <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] text-xs text-[#2D3748] py-2.5 px-3 rounded-xl outline-none cursor-pointer font-bold font-sans"
                  >
                    {pendingTasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title} ({task.estimatedHours}h)
                      </option>
                    ))}
                    {pendingTasks.length === 0 && (
                      <option value="">No active tasks available</option>
                    )}
                  </select>
                </div>
              )}

              {activeTab === RecommendationType.REPLAN && (
                <div className="bg-[#F8FAFC]/70 border border-[#E2E8F0] p-4.5 rounded-2xl space-y-2.5 animate-fade-in">
                  <label className="block text-[10px] font-mono font-bold uppercase text-purple-600 ml-0.5">
                    Why are you off-schedule? (Obstacle / Reason):
                  </label>
                  <input
                    type="text"
                    value={reasonForDelay}
                    onChange={(e) => setReasonForDelay(e.target.value)}
                    placeholder="e.g. Spent extra time resolving severe backend bug, or got sick"
                    className="w-full neumorphic-input py-2.5 px-3.5 text-xs text-[#2D3748]"
                  />
                </div>
              )}

              {/* General custom prompts option for other tools */}
              {activeTab !== RecommendationType.REPLAN && activeTab !== RecommendationType.INSIGHT && (
                <div className="bg-[#F8FAFC]/70 border border-[#E2E8F0] p-4.5 rounded-2xl space-y-2.5 animate-fade-in">
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#718096] flex items-center gap-1.5 ml-0.5">
                    <Info size={12} className="text-orange-500" />
                    <span>Focus constraints or custom preferences (Optional):</span>
                  </label>
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Schedule heavy coding tasks for mornings, or keep blocks short"
                    className="w-full neumorphic-input py-2.5 px-3.5 text-xs text-[#2D3748]"
                  />
                </div>
              )}
            </div>

            {/* AI Response Block */}
            {isLoading ? (
              <div className="space-y-4 py-8 animate-pulse text-center">
                <div className="h-6 bg-slate-100 rounded-lg w-1/3 mx-auto"></div>
                <div className="space-y-2 max-w-md mx-auto">
                  <div className="h-4 bg-slate-100 rounded-lg w-full"></div>
                  <div className="h-4 bg-slate-100 rounded-lg w-5/6 mx-auto"></div>
                  <div className="h-4 bg-slate-100 rounded-lg w-4/5 mx-auto"></div>
                </div>
                <div className="h-24 bg-slate-50 border border-slate-100 rounded-2xl w-full"></div>
                <p className="text-[11px] font-mono font-bold text-orange-500 animate-bounce mt-4">
                  Gemini AI is analyzing workspace datasets and constructing optimal roadmaps...
                </p>
              </div>
            ) : activeRec ? (
              <div className="neumorphic-pressed p-5 text-xs leading-relaxed font-sans space-y-4 overflow-y-auto max-h-[500px] text-[#2D3748]">
                <StructuredRecommendationRenderer response={activeRec.response} type={activeRec.recommendationType} />
              </div>
            ) : (
              <div className="text-center py-16 text-[#718096] space-y-4">
                <HelpCircle size={44} className="mx-auto text-[#CBD5E1]" />
                <p className="text-xs max-w-sm mx-auto font-medium leading-relaxed">
                  No recommendation history generated yet for this capability. Click the trigger below to consult Gemini.
                </p>
              </div>
            )}
          </div>

          {/* Trigger button */}
          <div className="pt-6 border-t border-[#E2E8F0] mt-6 flex justify-end">
            <button
              onClick={() => handleAIAction(activeTab)}
              disabled={isLoading || (activeTab === RecommendationType.BREAKDOWN && !selectedTaskId)}
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-3 rounded-full text-xs font-bold transition-all shadow-md shadow-orange-500/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{isLoading ? "Consulting Mind of Gemini..." : "Generate Gemini Response"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
