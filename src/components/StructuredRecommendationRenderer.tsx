import React, { useState } from "react";
import { 
  Sparkles, 
  ListOrdered, 
  Workflow, 
  CalendarRange, 
  TrendingUp, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  HelpCircle
} from "lucide-react";
import { RecommendationType } from "../types";

interface StructuredRecommendationRendererProps {
  response: string;
  type: RecommendationType;
}

export default function StructuredRecommendationRenderer({ response, type }: StructuredRecommendationRendererProps) {
  let data: any = null;
  let isJson = false;

  try {
    if (response) {
      const cleanText = response.trim();
      data = JSON.parse(cleanText);
      isJson = true;
    }
  } catch (e) {
    // Graceful fallback to markdown
    isJson = false;
  }

  if (!isJson || !data) {
    return <MarkdownRenderer text={response} />;
  }

  switch (type) {
    case RecommendationType.PRIORITIZATION:
      return <PrioritizationView data={data} />;
    case RecommendationType.BREAKDOWN:
      return <BreakdownView data={data} />;
    case RecommendationType.FOCUS_PLAN:
      return <FocusPlanView data={data} />;
    case RecommendationType.REPLAN:
      return <ReplanView data={data} />;
    case RecommendationType.INSIGHT:
      return <InsightsView data={data} />;
    default:
      return <MarkdownRenderer text={response} />;
  }
}

/* ==========================================================================
   1. PRIORITIZATION VIEW
   ========================================================================== */
function PrioritizationView({ data }: { data: any }) {
  return (
    <div className="space-y-6 text-left">
      {/* Summary Card */}
      {data.summary && (
        <div className="bg-[#F8FAFC] border-l-4 border-orange-500 p-4 rounded-r-2xl shadow-sm">
          <p className="text-xs font-semibold text-[#1E293B] leading-relaxed">
            {data.summary}
          </p>
        </div>
      )}

      {/* Recommended First Task Highlight */}
      {data.recommendedFirstTask && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-4.5">
          <div className="flex items-center gap-2 mb-2 text-orange-700 font-bold text-xs uppercase tracking-wider">
            <Sparkles size={14} className="animate-pulse" />
            <span>Recommended First Action</span>
          </div>
          <h4 className="font-display font-bold text-sm text-[#1E293B]">
            {data.recommendedFirstTask}
          </h4>
          {data.explanation && (
            <p className="text-[11px] text-[#556375] mt-1.5 font-medium leading-relaxed">
              {data.explanation}
            </p>
          )}
        </div>
      )}

      {/* Suggested Sequence Timeline */}
      {data.priorityOrder && data.priorityOrder.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-sans font-bold text-xs text-[#4A5568] uppercase tracking-wider mb-2 flex items-center gap-2">
            <ListOrdered size={14} className="text-orange-500" />
            <span>Optimal Execution Order</span>
          </h3>
          <div className="space-y-3 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
            {data.priorityOrder.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-4 relative">
                {/* Step Circle */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-[#CBD5E1] text-xs font-extrabold text-[#1E293B] shrink-0 z-10 shadow-sm">
                  {idx + 1}
                </div>
                {/* Step Card */}
                <div className="flex-grow bg-white border border-[#E2E8F0] rounded-2xl p-4 hover:border-orange-200 transition-colors duration-150">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="font-display font-bold text-xs sm:text-sm text-[#1E293B] hover:text-orange-600">
                      {item.taskTitle || "Untitled Task"}
                    </h4>
                    {item.urgency && (
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                        item.urgency.toLowerCase() === "high" || item.urgency.toLowerCase() === "critical"
                          ? "bg-red-50 border-red-100 text-red-600"
                          : "bg-blue-50 border-blue-100 text-blue-600"
                      }`}>
                        {item.urgency}
                      </span>
                    )}
                  </div>
                  {item.reasoning && (
                    <p className="text-[11px] text-[#718096] leading-relaxed font-medium">
                      {item.reasoning}
                    </p>
                  )}
                  {item.estimatedHours && (
                    <div className="flex items-center gap-1.5 mt-2.5 text-[10px] font-mono text-slate-500 font-bold">
                      <Clock size={12} />
                      <span>{item.estimatedHours} Hours Estimated</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings & Recommendations Section */}
      {(data.warnings?.length > 0 || data.recommendations?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {data.recommendations && data.recommendations.length > 0 && (
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>Coach Strategy</span>
              </h4>
              <ul className="space-y-1.5 list-none">
                {data.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="text-[11px] text-emerald-900 leading-relaxed font-medium flex items-start gap-1.5">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.warnings && data.warnings.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-amber-600" />
                <span>Risks & Bottlenecks</span>
              </h4>
              <ul className="space-y-1.5 list-none">
                {data.warnings.map((warn: string, idx: number) => (
                  <li key={idx} className="text-[11px] text-amber-900 leading-relaxed font-medium flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   2. GRANULAR TASK BREAKDOWN VIEW
   ========================================================================== */
function BreakdownView({ data }: { data: any }) {
  const [completedSubtasks, setCompletedSubtasks] = useState<{ [key: string]: boolean }>({});

  const toggleSubtask = (id: string) => {
    setCompletedSubtasks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const completedCount = Object.values(completedSubtasks).filter(Boolean).length;
  const totalSubtasks = data.subtasks?.length || 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedCount / totalSubtasks) * 100) : 0;

  return (
    <div className="space-y-6 text-left">
      {/* Summary Banner */}
      {data.summary && (
        <div className="bg-[#EBF1FA]/50 border border-[#CBD9E9] rounded-2xl p-4.5">
          <h3 className="font-display font-bold text-[#1E293B] text-xs sm:text-sm">
            {data.taskTitle || "Deconstructed Task Target"}
          </h3>
          <p className="text-[11px] text-[#4A5568] mt-1 font-medium leading-relaxed">
            {data.summary}
          </p>
        </div>
      )}

      {/* Progress Track */}
      {totalSubtasks > 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4">
          <div className="flex justify-between items-center text-[11px] font-bold text-[#1E293B] mb-1.5">
            <span className="flex items-center gap-1.5">
              <CheckSquare size={13} className="text-orange-500" />
              <span>Interactive Step Progress</span>
            </span>
            <span>{completedCount}/{totalSubtasks} Completed ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Subtasks Checklist */}
      {data.subtasks && data.subtasks.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="font-sans font-bold text-xs text-[#4A5568] uppercase tracking-wider mb-2 flex items-center gap-2">
            <Workflow size={14} className="text-orange-500" />
            <span>Actionable Micro-Steps</span>
          </h4>
          <div className="space-y-2.5">
            {data.subtasks.map((sub: any, idx: number) => {
              const subId = sub.id || `subtask-${idx}`;
              const isDone = !!completedSubtasks[subId];
              return (
                <div 
                  key={subId} 
                  onClick={() => toggleSubtask(subId)}
                  className={`border rounded-2xl p-3.5 flex items-start gap-3.5 cursor-pointer transition-all duration-150 ${
                    isDone 
                      ? "bg-emerald-50/20 border-emerald-100/70" 
                      : "bg-white border-[#E2E8F0] hover:border-orange-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => {}} // toggled via parent div click
                    className="mt-0.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer h-4 w-4"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-sans text-xs font-bold leading-relaxed transition-all ${
                        isDone ? "line-through text-[#94A3B8]" : "text-[#1E293B]"
                      }`}>
                        {sub.title || "Untitled Step"}
                      </span>
                      {sub.duration && (
                        <span className="text-[9px] font-mono font-bold bg-slate-50 border border-slate-100 text-slate-500 px-2 py-0.5 rounded-full shrink-0">
                          {sub.duration}
                        </span>
                      )}
                    </div>
                    {sub.reasoning && (
                      <p className={`text-[10px] mt-1 leading-relaxed font-medium ${
                        isDone ? "text-slate-400" : "text-[#718096]"
                      }`}>
                        {sub.reasoning}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Success Criteria & Blockers */}
      {(data.blockers?.length > 0 || data.successCriteria) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.blockers && data.blockers.length > 0 && (
            <div className="bg-red-50/40 border border-red-100 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-red-600" />
                <span>Known Blockers</span>
              </h4>
              <ul className="space-y-1.5 list-none">
                {data.blockers.map((block: string, idx: number) => (
                  <li key={idx} className="text-[11px] text-red-900 leading-relaxed font-medium flex items-start gap-1.5">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{block}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.successCriteria && (
            <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>Completion Standard</span>
              </h4>
              <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">
                {data.successCriteria}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   3. DAILY FOCUS PLAN VIEW
   ========================================================================== */
function FocusPlanView({ data }: { data: any }) {
  return (
    <div className="space-y-6 text-left">
      {/* Key Objective Card */}
      {data.keyFocus && (
        <div className="bg-[#EBF1FA]/50 border border-[#CBD9E9] rounded-2xl p-4 flex items-center gap-3.5">
          <div className="bg-orange-500 p-2.5 rounded-xl text-white shadow-sm shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-orange-600">Daily Prime Focus Goal</span>
            <h4 className="font-display font-bold text-xs sm:text-sm text-[#1E293B]">
              {data.keyFocus}
            </h4>
          </div>
        </div>
      )}

      {/* Schedule Blocks Timeline */}
      {data.schedule && data.schedule.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-sans font-bold text-xs text-[#4A5568] uppercase tracking-wider mb-2 flex items-center gap-2">
            <CalendarRange size={14} className="text-orange-500" />
            <span>Optimal Hourly Timeline ({data.date || "Today"})</span>
          </h3>
          <div className="space-y-2.5">
            {data.schedule.map((item: any, idx: number) => {
              const isWork = item.type?.toLowerCase() === "work";
              return (
                <div 
                  key={idx}
                  className={`border rounded-2xl p-3.5 flex items-center gap-4 transition-colors duration-150 ${
                    isWork 
                      ? "bg-white border-[#E2E8F0] hover:border-orange-100" 
                      : "bg-slate-50/50 border-[#E2E8F0]/80 border-dashed"
                  }`}
                >
                  {/* Time Badge */}
                  <div className="w-24 shrink-0">
                    <span className="text-xs font-mono font-extrabold text-[#1E293B] bg-slate-100 border border-slate-200/60 px-2 py-1 rounded-lg">
                      {item.time || "00:00"}
                    </span>
                  </div>
                  {/* Event Details */}
                  <div className="flex-grow min-w-0">
                    <h4 className="font-sans text-xs font-bold text-[#1E293B] truncate">
                      {item.block || "Scheduled Activity"}
                    </h4>
                    {item.activity && (
                      <p className="text-[11px] text-[#718096] mt-0.5 truncate font-medium">
                        {item.activity}
                      </p>
                    )}
                  </div>
                  {/* Type Status */}
                  <div className="shrink-0">
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                      isWork 
                        ? "bg-orange-50 border-orange-100 text-orange-600"
                        : "bg-emerald-50 border-emerald-100 text-emerald-600"
                    }`}>
                      {item.type || "BREAK"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Strategies & Summaries */}
      {(data.productivityStrategy || data.workloadSummary) && (
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4.5 space-y-3">
          {data.workloadSummary && (
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#718096]">Workload Estimate</span>
              <p className="text-xs text-[#2D3748] mt-0.5 font-bold">{data.workloadSummary}</p>
            </div>
          )}
          {data.productivityStrategy && (
            <div className="border-t border-[#E2E8F0] pt-2.5">
              <span className="text-[10px] font-mono font-bold uppercase text-orange-600">Productivity Guardrails</span>
              <p className="text-[11px] text-[#4A5568] leading-relaxed mt-1 font-medium">{data.productivityStrategy}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   4. SCHEDULE RECOVERY / REPLAN VIEW
   ========================================================================== */
function ReplanView({ data }: { data: any }) {
  return (
    <div className="space-y-6 text-left">
      {/* Recovery Diagnostic Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-4.5">
        <div className="flex items-center gap-1.5 text-purple-700 font-bold text-xs uppercase tracking-wider mb-1.5">
          <RefreshCw size={14} className="animate-spin-slow" />
          <span>Intelligent Recovery Diagnostics</span>
        </div>
        {data.reason && (
          <p className="text-xs font-bold text-[#1E293B]">
            Obstacle Diagnosed: <span className="text-purple-600 font-extrabold">"{data.reason}"</span>
          </p>
        )}
        {data.summary && (
          <p className="text-[11px] text-[#556375] mt-1 font-medium leading-relaxed">
            {data.summary}
          </p>
        )}
      </div>

      {/* Revised Schedule Blocks */}
      {data.revisedSchedule && data.revisedSchedule.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-sans font-bold text-xs text-[#4A5568] uppercase tracking-wider mb-2 flex items-center gap-2">
            <RefreshCw size={14} className="text-purple-500" />
            <span>Updated Schedule Blocks</span>
          </h3>
          <div className="space-y-2.5">
            {data.revisedSchedule.map((item: any, idx: number) => (
              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 flex items-center gap-4 hover:border-purple-200 transition-colors duration-150">
                <div className="w-24 shrink-0">
                  <span className="text-xs font-mono font-extrabold text-[#1E293B] bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg">
                    {item.time || "00:00"}
                  </span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-sans text-xs font-bold text-[#1E293B]">
                    {item.activity || "Scheduled Recovery Activity"}
                  </h4>
                  {item.action && (
                    <p className="text-[11px] text-purple-600 font-extrabold mt-0.5">
                      Action: {item.action}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revised Priorities Comparison */}
      {data.revisedPriorities && data.revisedPriorities.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-sans font-bold text-xs text-[#4A5568] uppercase tracking-wider flex items-center gap-1.5">
            <span>Revised Urgency Weightings</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.revisedPriorities.map((item: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border border-[#E2E8F0]/80 rounded-2xl p-3.5 flex flex-col justify-between">
                <h5 className="font-sans font-bold text-xs text-[#1E293B] leading-snug">
                  {item.taskTitle}
                </h5>
                <div className="flex items-center gap-2.5 mt-2.5 text-[10px] font-mono font-bold">
                  <span className="text-slate-400 uppercase">{item.originalPriority || "Medium"}</span>
                  <ArrowRight size={12} className="text-purple-500" />
                  <span className="text-purple-600 uppercase font-extrabold bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                    {item.newPriority || "High"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Redistribution & recovery tips */}
      {(data.workRedistribution || data.recoverySuggestions?.length > 0) && (
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4.5 space-y-3">
          {data.workRedistribution && (
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-purple-600">Work Redistribution strategy</span>
              <p className="text-[11px] text-[#4A5568] leading-relaxed mt-0.5 font-medium">{data.workRedistribution}</p>
            </div>
          )}
          {data.recoverySuggestions && data.recoverySuggestions.length > 0 && (
            <div className="border-t border-[#E2E8F0] pt-2.5">
              <span className="text-[10px] font-mono font-bold uppercase text-[#718096]">Recovery Roadmaps</span>
              <ul className="space-y-1.5 list-none mt-1">
                {data.recoverySuggestions.map((sug: string, idx: number) => (
                  <li key={idx} className="text-[11px] text-[#4A5568] leading-relaxed font-medium flex items-start gap-1.5">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   5. PRODUCTIVITY INSIGHTS VIEW
   ========================================================================== */
function InsightsView({ data }: { data: any }) {
  const score = data.productivityScore || 80;
  
  return (
    <div className="space-y-6 text-left">
      {/* Productivity Score Ring */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-orange-100/60 rounded-2xl p-4.5 flex flex-col sm:flex-row items-center gap-6">
        {/* Circle Graphic */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle 
              cx="48" cy="48" r="40" 
              className="stroke-slate-100" 
              strokeWidth="8" fill="transparent" 
            />
            <circle 
              cx="48" cy="48" r="40" 
              className="stroke-rose-500" 
              strokeWidth="8" fill="transparent" 
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * score) / 100}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute font-display font-black text-[#1E293B] text-xl">
            {score}%
          </span>
        </div>
        {/* Motivation/Score Label */}
        <div className="text-center sm:text-left space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-rose-600">Performance Quotient</span>
          <h4 className="font-display font-extrabold text-sm sm:text-base text-[#1E293B]">
            Productive Output: {score >= 85 ? "Excellent Efficiency" : "Optimizable Velocity"}
          </h4>
          {data.motivation && (
            <p className="text-[11px] text-[#556375] font-medium leading-relaxed italic">
              "{data.motivation}"
            </p>
          )}
        </div>
      </div>

      {/* Strengths vs Areas of Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.strengths && data.strengths.length > 0 && (
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>Key Strengths</span>
            </h4>
            <ul className="space-y-1.5 list-none">
              {data.strengths.map((st: string, idx: number) => (
                <li key={idx} className="text-[11px] text-emerald-900 leading-relaxed font-medium flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.weaknesses && data.weaknesses.length > 0 && (
          <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle size={13} className="text-rose-600" />
              <span>Weaknesses / Slippage Points</span>
            </h4>
            <ul className="space-y-1.5 list-none">
              {data.weaknesses.map((wk: string, idx: number) => (
                <li key={idx} className="text-[11px] text-rose-900 leading-relaxed font-medium flex items-start gap-1.5">
                  <span className="text-rose-500 mt-0.5">•</span>
                  <span>{wk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Customized Strategic Advice */}
      {data.suggestions && data.suggestions.length > 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4.5 space-y-2">
          <h4 className="font-sans font-bold text-xs text-[#1E293B] uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={14} className="text-rose-500" />
            <span>Targeted Strategic Solutions</span>
          </h4>
          <ul className="space-y-1.5 list-none">
            {data.suggestions.map((sug: string, idx: number) => (
              <li key={idx} className="text-[11px] text-[#4A5568] leading-relaxed font-medium flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">•</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   GENERIC MARKDOWN FALLBACK RENDERER
   ========================================================================== */
function MarkdownRenderer({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="text-xs font-bold text-orange-600 mt-4 mb-2 tracking-tight">
              {trimmed.substring(4)}
            </h3>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="text-sm font-bold text-[#1E293B] mt-5 mb-2 border-b border-[#E2E8F0] pb-1">
              {trimmed.substring(3)}
            </h2>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={index} className="text-base font-bold text-[#1E293B] mt-6 mb-3">
              {trimmed.substring(2)}
            </h1>
          );
        }
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
          const content = trimmed.substring(2);
          return (
            <li key={index} className="ml-4 list-disc text-xs text-[#4A5568] mt-1.5 leading-relaxed font-medium">
              {renderBoldText(content)}
            </li>
          );
        }
        if (
          trimmed.startsWith("1. ") || 
          trimmed.startsWith("2. ") || 
          trimmed.startsWith("3. ") || 
          trimmed.startsWith("4. ") || 
          trimmed.startsWith("5. ") || 
          trimmed.startsWith("6. ") || 
          trimmed.startsWith("7. ") || 
          trimmed.startsWith("8. ")
        ) {
          const content = trimmed.substring(3);
          return (
            <li key={index} className="ml-4 list-decimal text-xs text-[#4A5568] mt-1.5 leading-relaxed font-medium">
              {renderBoldText(content)}
            </li>
          );
        }
        if (!trimmed) {
          return <div key={index} className="h-2" />;
        }
        return (
          <p key={index} className="text-xs text-[#2D3748] leading-relaxed font-medium">
            {renderBoldText(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderBoldText(text: string) {
  const parts = text.split("**");
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-bold text-[#1E293B]">{part}</strong>;
    }
    return part;
  });
}
