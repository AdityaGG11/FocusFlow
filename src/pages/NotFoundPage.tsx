import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4 animate-fade-in bg-[#F5F7FA]">
      <div className="neumorphic-raised max-w-md p-10 space-y-6 border border-white/80">
        <div className="inline-flex neumorphic-pressed p-5 rounded-full text-orange-500">
          <HelpCircle size={48} className="stroke-[1.5] animate-bounce-slow" />
        </div>
        
        <div className="space-y-3">
          <h1 className="font-display font-extrabold text-5xl text-[#1E293B] tracking-tight">
            404
          </h1>
          <h2 className="font-sans font-bold text-lg text-[#334155]">
            Workspace Screen Not Found
          </h2>
          <p className="text-xs text-[#64748B] leading-relaxed max-w-sm">
            The path you are looking for might have been archived, renamed, or is currently unavailable in this release candidate.
          </p>
        </div>

        <div className="pt-6 border-t border-[#E2E8F0] flex justify-center">
          <Link
            to="/"
            className="neumorphic-btn px-6 py-3 text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
