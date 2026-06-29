import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import AIAssistantPage from "./pages/AIAssistantPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user session exists in local storage
  useEffect(() => {
    const cachedUser = localStorage.getItem("focusflow_user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (loggedInUser: { name: string; email: string }) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("focusflow_user");
    localStorage.removeItem("focusflow_token");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="font-mono text-xs text-[#6B7280]">Initializing FocusFlow Workspace...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          {/* Public Access Routes */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" replace /> : <RegisterPage onRegisterSuccess={handleLoginSuccess} />} 
          />

          {/* Protected Application Routes */}
          <Route 
            path="/" 
            element={user ? <DashboardPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/tasks" 
            element={user ? <TasksPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/ai-assistant" 
            element={user ? <AIAssistantPage /> : <Navigate to="/login" replace />} 
          />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
