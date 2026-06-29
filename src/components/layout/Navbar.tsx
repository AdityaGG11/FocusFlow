import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, CheckSquare, BrainCircuit, LogOut, Sparkles } from "lucide-react";

interface NavbarProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/tasks", label: "Tasks", icon: CheckSquare },
    { path: "/ai-assistant", label: "AI Assistant", icon: BrainCircuit },
  ];

  return (
    <nav 
      id="navbar" 
      className="sticky top-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 py-3.5 transition-all shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-gradient-to-tr from-orange-500 to-amber-500 p-2.5 rounded-2xl text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <BrainCircuit size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="font-display font-bold text-base tracking-tight text-[#1E293B] block leading-none">
              FocusFlow <span className="text-orange-500">AI</span>
            </span>
            <span className="text-[9px] font-mono text-[#A0AEC0] block mt-0.5 tracking-wider font-bold">
              LAST-MINUTE SAVER
            </span>
          </div>
        </Link>

        {/* Navigation Items (Authenticated only) */}
        {user && (
          <div className="hidden md:flex items-center space-x-3 bg-[#F5F7FA] p-1.5 rounded-2xl border border-[#E2E8F0]/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? "bg-[#FFFFFF] text-orange-500 shadow-sm border border-[#E2E8F0]"
                      : "text-[#4A5568] hover:text-[#1A202C] hover:bg-[#FFFFFF]/50"
                  }`}
                >
                  <Icon size={14} className={active ? "text-orange-500" : "text-[#718096]"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* User profile & controls */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-[#2D3748]">{user.name}</span>
                <span className="text-[10px] font-mono text-[#718096]">{user.email}</span>
              </div>
              <div className="h-6 w-px bg-[#E2E8F0] hidden sm:block"></div>
              
              <button
                id="btn-logout"
                onClick={onLogout}
                className="p-2 text-[#718096] hover:text-red-500 bg-[#F5F7FA] hover:bg-red-500/10 border border-[#E2E8F0] rounded-xl transition-all cursor-pointer shadow-sm"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-xs font-bold text-[#4A5568] hover:text-[#1A202C] px-3.5 py-2 hover:bg-[#F5F7FA] rounded-xl transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-orange-500/10 hover:shadow-orange-500/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
