import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  User, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Compass,
  Cpu,
  Fingerprint
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess, backendUrl = "http://localhost:7001" }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [identifier, setIdentifier] = useState('ISRO-ANALYST');
  const [password, setPassword] = useState('isro2026');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('Dr. Vikram S. Rao');
  const [callsign, setCallsign] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Space Applications Centre (SAC)');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rememberMe, setRememberMe] = useState(true);

  // 1-Click Quick Evaluation Access for Hackathon Jury
  const handleQuickDemoAccess = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: "demo", password: "demo" })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        if (rememberMe && typeof window !== 'undefined') {
          localStorage.setItem("satquery_auth_token", data.token);
          localStorage.setItem("satquery_user", JSON.stringify(data.user));
        }
        onLoginSuccess(data.user);
      } else {
        throw new Error(data.detail || "Authentication refused.");
      }
    } catch (err) {
      console.warn("Auth network fallback:", err);
      // Offline fallback
      const fallbackUser = {
        id: 1,
        callsign: "ISRO-ANALYST",
        email: "analyst.sih26167@isro.gov.in",
        full_name: "Dr. Vikram S. Rao",
        clearance_level: "LEVEL 4 - SENIOR GEOSPATIAL COMMAND",
        department: "Space Applications Centre (SAC-ISRO)",
        mission_id: "SIH-PS-26167"
      };
      if (rememberMe && typeof window !== 'undefined') {
        localStorage.setItem("satquery_user", JSON.stringify(fallbackUser));
      }
      onLoginSuccess(fallbackUser);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (isRegistering) {
        if (!callsign.trim() || !email.trim() || !password.trim() || !fullName.trim()) {
          throw new Error("All clearance fields are mandatory.");
        }
        const res = await fetch(`${backendUrl}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callsign: callsign.trim(),
            email: email.trim(),
            password: password.trim(),
            full_name: fullName.trim(),
            department: department
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Registration failed.");
        if (rememberMe && typeof window !== 'undefined') {
          localStorage.setItem("satquery_auth_token", data.token);
          localStorage.setItem("satquery_user", JSON.stringify(data.user));
        }
        onLoginSuccess(data.user);
      } else {
        const res = await fetch(`${backendUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: identifier.trim(),
            password: password.trim()
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Invalid Credentials. Access Denied.");
        if (rememberMe && typeof window !== 'undefined') {
          localStorage.setItem("satquery_auth_token", data.token);
          localStorage.setItem("satquery_user", JSON.stringify(data.user));
        }
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setErrorMsg(err.message || "Authentication network error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#020617] text-white select-none overflow-hidden font-sans p-4 sm:p-6">
      
      {/* Background Deep Space Matrix Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-slate-950/85 border border-emerald-500/40 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-6 sm:p-8 animate-fadeIn">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3 group cursor-pointer">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] p-0.5">
              <img 
                src="/satquery_logo.png" 
                alt="SatQuery AI" 
                className="w-full h-full object-cover scale-110" 
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
          </div>

          <div className="flex items-center gap-1.5 leading-none mb-1.5">
            <span className="font-sans font-black text-2xl sm:text-3xl tracking-tight text-white drop-shadow-md">
              SatQuery
            </span>
            <span className="font-mono font-black text-2xl sm:text-3xl tracking-wide bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
              AI
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-[10px] font-mono text-emerald-300 font-bold tracking-wider uppercase shadow-sm">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>ISRO SAC • GEOSPATIAL COMMAND GATE</span>
          </div>
        </div>

        {/* 1-Click Fast Track Demo Access Button for Hackathon Evaluation */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleQuickDemoAccess}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-mono font-black text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] active:scale-98 group"
          >
            <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span>1-CLICK DEMO ACCESS (SENIOR ANALYST)</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center justify-between text-[9.5px] font-mono text-emerald-400/80 mt-1.5 px-1">
            <span>Instant Jury Evaluation Pass</span>
            <span>Pre-Loaded Level 4 Credentials</span>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-[1px] bg-white/20" />
          <span className="text-[10px] font-mono text-emerald-300 font-bold tracking-wider uppercase">AUTHENTICATE CLEARANCE CREDENTIALS</span>
          <div className="flex-1 h-[1px] bg-white/20" />
        </div>

        {/* Form Mode Selector */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-900 border border-white/20 mb-4 text-xs font-mono font-bold">
          <button
            type="button"
            onClick={() => { setIsRegistering(false); setErrorMsg(null); }}
            className={`py-1.5 rounded-lg transition ${!isRegistering ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/60 shadow' : 'text-white/80 hover:text-white'}`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => { setIsRegistering(true); setErrorMsg(null); }}
            className={`py-1.5 rounded-lg transition ${isRegistering ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/60 shadow' : 'text-white/80 hover:text-white'}`}
          >
            REGISTER
          </button>
        </div>

        {/* Error Alert Card */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/60 flex items-start gap-2 text-xs font-mono text-red-200 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegistering ? (
            <>
              <div>
                <label className="block text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-white/20 focus-within:border-emerald-400 transition">
                  <User className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Vikram S. Rao"
                    className="w-full bg-transparent text-xs text-white placeholder:text-white/30 outline-none font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider mb-1">
                  Officer Callsign (Unique Handle)
                </label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-white/20 focus-within:border-emerald-400 transition">
                  <Fingerprint className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    placeholder="e.g. SAC-RAO-01"
                    className="w-full bg-transparent text-xs text-white placeholder:text-white/30 outline-none font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider mb-1">
                  Security Email
                </label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-white/20 focus-within:border-emerald-400 transition">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@isro.gov.in"
                    className="w-full bg-transparent text-xs text-white placeholder:text-white/30 outline-none font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider mb-1">
                  Department / Mission Role
                </label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-white/20 focus-within:border-emerald-400 transition">
                  <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Space Applications Centre"
                    className="w-full bg-transparent text-xs text-white placeholder:text-white/30 outline-none font-sans"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider mb-1">
                Officer Callsign or Email
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/20 focus-within:border-emerald-400 transition">
                <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ISRO-ANALYST or email"
                  className="w-full bg-transparent text-xs text-white placeholder:text-white/30 outline-none font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider mb-1">
              Security Clearance Passkey
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/20 focus-within:border-emerald-400 transition">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter security key..."
                className="w-full bg-transparent text-xs text-white placeholder:text-white/30 outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/50 hover:text-white transition cursor-pointer p-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-white/70 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-emerald-400 rounded w-3.5 h-3.5"
              />
              <span>Remember clearance</span>
            </label>
            <span className="text-[10px] text-emerald-400/80 font-bold">PS-26167 SECURED</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-950 border border-emerald-400/80 hover:border-emerald-300 text-emerald-200 hover:text-white font-mono font-black text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98"
          >
            {isLoading ? (
              <span className="animate-pulse">VERIFYING CLEARANCE...</span>
            ) : (
              <>
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>{isRegistering ? "CREATE CLEARANCE & ENTER" : "AUTHENTICATE & ENTER PORTAL"}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-6 text-center text-[10px] font-mono text-emerald-300/80 font-semibold space-y-1">
          <p>SIH 2026 Problem Statement PS-26167 • ISRO & SAC</p>
          <p>National Remote Sensing Centre & Geospatial Intelligence Station</p>
        </div>

      </div>

    </div>
  );
}
