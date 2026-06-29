import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { dataProvider } from "../api/dataProvider";

interface LoginPageProps {
  onLoginSuccess: (user: { name: string; email: string }) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (window.location.search.includes("expired=true")) {
      setSessionExpired(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    dataProvider.login(email, password)
      .then((data) => {
        const userObj = {
          name: data.name,
          email: data.email,
        };
        localStorage.setItem("focusflow_user", JSON.stringify(userObj));
        localStorage.setItem("focusflow_token", data.token);
        onLoginSuccess(userObj);
        navigate("/");
      })
      .catch((err: any) => {
        setError(err.message || "Invalid email or password credentials.");
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center py-8 sm:py-12 animate-fade-in">
      <div className="w-full max-w-md neumorphic-raised p-8 space-y-6">
        
        {/* Logo and Greeting */}
        <div className="text-center space-y-3">
          <div className="inline-flex bg-gradient-to-tr from-orange-500 to-amber-500 p-3.5 rounded-2xl text-white shadow-lg shadow-orange-500/20 mb-1">
            <BrainCircuit size={24} className="stroke-[2.5]" />
          </div>
          <h1 className="font-display font-bold text-2xl text-[#1E293B] tracking-tight">
            Sign In to FocusFlow
          </h1>
          <p className="text-xs text-[#718096]">
            Let Gemini organize, recover, and plan your schedules.
          </p>
        </div>
        {sessionExpired && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs animate-fade-in">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-500" />
            <span className="font-medium">Your security session has expired. Please sign in again to access the dashboard.</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-200 text-red-600 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs animate-fade-in">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-[#718096] mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
              <input
                type="email"
                required
                placeholder="e.g. you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full neumorphic-input py-3 pl-11 pr-4 text-sm text-[#2D3748]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-[#718096] mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full neumorphic-input py-3 pl-11 pr-4 text-sm text-[#2D3748]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 px-4 rounded-full text-sm font-bold shadow-md shadow-orange-500/15 hover:shadow-orange-500/25 active:scale-[0.98] transition-all cursor-pointer mt-6"
          >
            <span>{isLoading ? "Signing In..." : "Continue"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-[#E2E8F0]">
          <p className="text-xs text-[#718096]">
            Don't have an account yet?{" "}
            <Link to="/register" className="text-orange-500 font-bold hover:underline ml-1">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
