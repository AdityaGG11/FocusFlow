import React from "react";
import Navbar from "./Navbar";
import { User } from "../../types";
import { AlertTriangle, WifiOff } from "lucide-react";
import { PREVIEW_MODE } from "../../api/dataProvider";

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export default function Layout({ children, user, onLogout }: LayoutProps) {
  return (
    <div id="layout-root" className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#2D3748]">
      {/* Fallback Mode Informational Warning Banner */}
      {PREVIEW_MODE && (
        <div 
          id="fallback-banner" 
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-md z-[60] sticky top-0 transition-all animate-fade-in"
        >
          <WifiOff size={14} className="animate-pulse shrink-0" />
          <span>
            Preview Mode — Running entirely with simulated local data.
          </span>
        </div>
      )}

      {/* Dynamic Navigation Bar */}
      <Navbar user={user} onLogout={onLogout} />

      {/* Main App Workspace */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {children}
      </main>

      {/* Footer Details */}
      <footer className="bg-[#FFFFFF] border-t border-[#E2E8F0] py-6 mt-auto shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#718096] font-mono">
          <p>© 2026 FocusFlow AI. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5">
              Server Status: 
              {PREVIEW_MODE ? (
                <span className="text-orange-500 font-bold flex items-center gap-1">
                  ● Simulated
                </span>
              ) : (
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  ● Connected
                </span>
              )}
            </span>
            <span className="text-[#CBD5E1] hidden sm:inline">|</span>
            <span>Version: 1.0.0 (Neumorphism v2)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
