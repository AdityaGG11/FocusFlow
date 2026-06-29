import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, User, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { dataProvider } from "../api/dataProvider";

interface RegisterPageProps {
  onRegisterSuccess: (user: { name: string; email: string }) => void;
}

export default function RegisterPage({ onRegisterSuccess }: RegisterPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    dataProvider.register(name, email, password)
      .then(() => {
        // Register successful, now login automatically
        return dataProvider.login(email, password);
      })
      .then((data) => {
        const loggedUser = {
          name: data.name,
          email: data.email,
        };
        localStorage.setItem("focusflow_user", JSON.stringify(loggedUser));
        localStorage.setItem("focusflow_token", data.token);

        onRegisterSuccess(loggedUser);
        navigate("/");
      })
      .catch((err: any) => {
        setError(err.message || "An error occurred during registration.");
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center py-8 sm:py-12 animate-fade-in">
      <div className="w-full max-w-md neumorphic-raised p-8 space-y-6">
        
        {/* Logo and Greeting */}
        <div className="text-center space-y-3">
          <div className="inline-flex bg-gradient-to-tr from-orange-500 to-amber-500 p-3.5 rounded-2xl text-white shadow-lg shadow-orange-500/20 mb-1">
            <BrainCircuit size={24} className="stroke-[2.5]" />
          </div>
          <h1 className="font-display font-bold text-2xl text-[#1E293B] tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-[#718096]">
            Join FocusFlow and experience smart task prioritization.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-200 text-red-600 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs animate-fade-in">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Register form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-[#718096] mb-1.5 ml-1">
              Full Name *
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full neumorphic-input py-2.5 pl-11 pr-4 text-sm text-[#2D3748]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-[#718096] mb-1.5 ml-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
              <input
                type="email"
                required
                placeholder="e.g. you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full neumorphic-input py-2.5 pl-11 pr-4 text-sm text-[#2D3748]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-[#718096] mb-1.5 ml-1">
                Password *
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
                <input
                  type="password"
                  required
                  placeholder="Min 8 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full neumorphic-input py-2.5 pl-11 pr-4 text-sm text-[#2D3748]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-[#718096] mb-1.5 ml-1">
                Confirm *
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
                <input
                  type="password"
                  required
                  placeholder="Retype password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full neumorphic-input py-2.5 pl-11 pr-4 text-sm text-[#2D3748]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 px-4 rounded-full text-sm font-bold shadow-md shadow-orange-500/15 hover:shadow-orange-500/25 active:scale-[0.98] transition-all cursor-pointer mt-6"
          >
            <span>{isLoading ? "Creating Account..." : "Register Now"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-[#E2E8F0]">
          <p className="text-xs text-[#718096]">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 font-bold hover:underline ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
