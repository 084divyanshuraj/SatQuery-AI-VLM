import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Clock, 
  User, 
  History, 
  Trash2,
  ChevronRight,
  LogOut
} from 'lucide-react';

export default function MissionHub({ 
  currentUser, 
  onLaunchWorkstation, 
  onScrollToWorkstation,
  onLogout, 
  onViewPortal,
  activeSessionId,
  onSelectSession,
  refreshTrigger
}) {
  const canvasRef = useRef(null);

  // Live real-time clock
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Distinct Satellite Constellation & Orbital Radar Sweep Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Orbital Nodes (Satellite constellation)
    const nodes = [
      { x: 0.2, y: 0.3, label: "SENTINEL-2A (MSI)", radius: 3.5, angle: 0, speed: 0.003, orbitR: 110, color: '#10B981' },
      { x: 0.5, y: 0.45, label: "CARTOSAT-3 (PAN)", radius: 4.5, angle: Math.PI / 2, speed: 0.004, orbitR: 160, color: '#8B5CF6' },
      { x: 0.8, y: 0.25, label: "SENTINEL-1B (SAR)", radius: 3.5, angle: Math.PI, speed: 0.0025, orbitR: 130, color: '#F43F5E' },
      { x: 0.35, y: 0.75, label: "RISAT-1A (C-BAND)", radius: 3.5, angle: Math.PI * 1.5, speed: 0.0035, orbitR: 120, color: '#F59E0B' },
      { x: 0.7, y: 0.7, label: "LANDSAT-9 (OLI-2)", radius: 3.5, angle: 0.5, speed: 0.002, orbitR: 170, color: '#10B981' }
    ];

    // Background Stars / Data Grid Points
    const gridPoints = [];
    for (let i = 0; i < 35; i++) {
      gridPoints.push({
        x: Math.random(),
        y: Math.random(),
        alpha: Math.random() * 0.4 + 0.1,
        fadeSpeed: (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1)
      });
    }

    let radarAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Draw subtle coordinate grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 70;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw starry data dots
      gridPoints.forEach(p => {
        p.alpha += p.fadeSpeed;
        if (p.alpha > 0.5) { p.alpha = 0.5; p.fadeSpeed = -Math.abs(p.fadeSpeed); }
        if (p.alpha < 0.05) { p.alpha = 0.05; p.fadeSpeed = Math.abs(p.fadeSpeed); }

        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha * 0.7})`;
        ctx.fill();
      });

      // Center radar pulse sweep
      const centerX = w * 0.55;
      const centerY = h * 0.48;
      const maxRadius = Math.min(w, h) * 0.45;

      // Concentric orbital distance rings
      [0.25, 0.5, 0.75, 1.0].forEach(factor => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius * factor, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Radar sweep cone
      radarAngle += 0.008;
      const sweepGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      sweepGradient.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
      sweepGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, radarAngle, radarAngle + 0.3);
      ctx.closePath();
      ctx.fillStyle = sweepGradient;
      ctx.fill();
      ctx.restore();

      // Connect satellite constellation nodes
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1X = nodes[i].x * w + Math.cos(nodes[i].angle) * (nodes[i].orbitR * 0.25);
          const n1Y = nodes[i].y * h + Math.sin(nodes[i].angle) * (nodes[i].orbitR * 0.25);
          const n2X = nodes[j].x * w + Math.cos(nodes[j].angle) * (nodes[j].orbitR * 0.25);
          const n2Y = nodes[j].y * h + Math.sin(nodes[j].angle) * (nodes[j].orbitR * 0.25);

          const dist = Math.hypot(n2X - n1X, n2Y - n1Y);
          if (dist < 340) {
            ctx.beginPath();
            ctx.moveTo(n1X, n1Y);
            ctx.lineTo(n2X, n2Y);
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]);

      // Draw constellation nodes & labels
      nodes.forEach(node => {
        node.angle += node.speed;
        const curX = node.x * w + Math.cos(node.angle) * (node.orbitR * 0.25);
        const curY = node.y * h + Math.sin(node.angle) * (node.orbitR * 0.25);

        ctx.beginPath();
        ctx.arc(curX, curY, node.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}25`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(curX, curY, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        ctx.font = '8.5px monospace';
        ctx.fillStyle = 'rgba(247, 191, 222, 0.75)';
        ctx.fillText(node.label, curX + 8, curY + 3);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // =========================================================================
  // DYNAMIC PER-USER SESSIONS (SQLite Backend Database)
  // =========================================================================
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const userId = currentUser?.id || currentUser?.email || 'analyst-default';

  const BACKEND_HTTP = import.meta.env.VITE_BACKEND_URL || "http://localhost:7001";

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const res = await fetch(`${BACKEND_HTTP}/api/history/sessions?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
        if (data.length > 0 && !activeSessionId && onSelectSession) {
          onSelectSession(data[0].id);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch sessions from database:", err);
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [userId, refreshTrigger]);

  const handleStartNewWorkspace = async () => {
    try {
      const res = await fetch(`${BACKEND_HTTP}/api/history/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          title: 'New Workspace',
          modality: 'single'
        })
      });
      if (res.ok) {
        const newSession = await res.json();
        setSessions(prev => [newSession, ...prev]);
        if (onSelectSession) onSelectSession(newSession.id);
        if (onLaunchWorkstation) onLaunchWorkstation('single');
        if (onScrollToWorkstation) onScrollToWorkstation();
      }
    } catch (err) {
      console.error("Error creating session:", err);
      if (onLaunchWorkstation) onLaunchWorkstation('single');
      if (onScrollToWorkstation) onScrollToWorkstation();
    }
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await fetch(`${BACKEND_HTTP}/api/history/sessions/${sessionId}?user_id=${encodeURIComponent(userId)}`, {
        method: 'DELETE'
      });
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSessionId === sessionId && onSelectSession) {
        const remaining = sessions.filter(s => s.id !== sessionId);
        if (remaining.length > 0) {
          onSelectSession(remaining[0].id);
        } else {
          onSelectSession(null);
        }
      }
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'AS';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative w-full min-h-screen bg-[#08090C] text-white font-sans overflow-hidden flex flex-col select-none">
      
      {/* Background Canvas: Satellite Constellation & Radar Matrix (Preserved & Enhanced) */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" 
      />

      {/* Top Header Bar (Enlarged & High-Visibility) */}
      <header className="relative z-20 h-16 sm:h-18 px-4 sm:px-7 border-b border-white/10 bg-[#12131C]/90 backdrop-blur-xl flex items-center justify-between shrink-0 shadow-lg">
        
        {/* Left: SatQuery Logo */}
        <div className="flex items-center gap-3">
          <div 
            onClick={onViewPortal}
            title="Return to SatQuery AI Portal"
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#08090C] border border-[#8B5CF6]/60 p-1 flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.4)] group-hover:border-[#EC4899] transition-all">
              <img 
                src="/satquery_logo.png" 
                alt="SatQuery AI Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-slate-100 transition-colors drop-shadow-sm">SatQuery</span>
              <span className="font-mono font-black text-lg sm:text-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#10B981] bg-clip-text text-transparent">AI</span>
            </div>
          </div>
        </div>

        {/* Center: Live Orbit Telemetry Ticker */}
        <div className="hidden md:flex items-center gap-3 text-xs sm:text-sm font-mono text-slate-300">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08090C] border border-white/10 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="font-bold text-slate-200 tabular-nums tracking-wide">{currentTime || '00:00:00'} UTC</span>
          </div>
        </div>

        {/* Right: User Profile & Logout */}
        <div className="flex items-center gap-3">

          {/* User Profile Pill Widget */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#8B5CF6] via-[#EC4899] to-[#10B981] p-[2px] flex items-center justify-center shadow-[0_0_14px_rgba(139,92,246,0.3)] shrink-0">
              <div className="w-full h-full rounded-full bg-[#08090C] flex items-center justify-center text-xs sm:text-sm font-black text-[#8B5CF6]">
                {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
              </div>
            </div>

            <div className="hidden lg:flex flex-col text-left leading-none">
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate max-w-[140px]">
                {currentUser?.name || 'Dr. Vikram S. Rao'}
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-[#10B981] truncate max-w-[140px] mt-1 font-semibold">
                {currentUser?.rank || 'Level-4 Analyst'}
              </span>
            </div>
          </div>
        </div>

      </header>

      {/* Main Grid: Sidebar ("Recents" & "Output") + Central Workspace */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR: RECENTS / HISTORY                                           */}
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR: CHATGPT-STYLE SESSIONS HISTORY (Matching Image 1)           */}
        {/* ========================================================================= */}
        <aside className="w-full lg:w-64 xl:w-72 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#08090C] p-3 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sm:h-[calc(100vh-4.5rem)] overflow-hidden">
          
          {/* Top: Start New Workspace Button */}
          <div className="shrink-0 space-y-3">
            <button
              onClick={handleStartNewWorkspace}
              className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F43F5E] hover:opacity-95 text-white font-sans font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_25px_rgba(244,63,94,0.55)] active:scale-98 cursor-pointer group"
            >
              <Plus className="w-4 h-4 text-white stroke-[3] group-hover:rotate-90 transition-transform" />
              <span>START NEW WORKSPACE</span>
            </button>

            {/* Recents Section Title Header */}
            <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              <div className="flex items-center gap-1.5">
                <History className="w-3 h-3 text-[#8B5CF6]" />
                <span>RECENTS / HISTORY</span>
              </div>
              <span className="text-[9px] text-[#10B981] font-mono">
                {sessions.length}
              </span>
            </div>
          </div>

          {/* Middle: Clean ChatGPT-Style Scrollable Text Sessions List (Matching Image 1) */}
          <div className="flex-1 overflow-y-auto space-y-0.5 my-2 pr-1 custom-scrollbar min-h-0">
            {loadingSessions && sessions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 font-mono">
                Loading history...
              </div>
            ) : sessions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 font-sans">
                No past sessions yet. Click "Start New Workspace" above to begin.
              </div>
            ) : (
              sessions.map((item) => {
                const isActive = activeSessionId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onSelectSession) onSelectSession(item.id);
                      if (onLaunchWorkstation) onLaunchWorkstation(item.modality || 'single');
                      if (onScrollToWorkstation) onScrollToWorkstation();
                    }}
                    title={item.title}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] transition-all cursor-pointer select-none ${
                      isActive 
                        ? 'bg-white/[0.12] text-white font-medium shadow-sm' 
                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2 font-sans tracking-normal leading-normal">
                      {item.title || 'New Workspace'}
                    </span>
                    <button
                      onClick={(e) => handleDeleteSession(e, item.id)}
                      title="Delete workspace session"
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 text-slate-400 hover:bg-white/10 rounded transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom: Clean User Profile Account Card (Matching Image 1) */}
          <div className="pt-2.5 border-t border-white/10 shrink-0 mt-auto">
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.06] transition-colors group cursor-pointer">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Circular Initial Avatar Badge (Matching Image 1) */}
                <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold text-xs tracking-wider shrink-0 shadow-sm">
                  {getUserInitials(currentUser?.name || 'asad')}
                </div>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-[13px] font-bold text-white truncate leading-tight">
                    {currentUser?.name || 'asad'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono leading-tight truncate mt-0.5">
                    {currentUser?.rank || 'Go'}
                  </span>
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* CENTER / RIGHT WORKSPACE AREA: FULL-SECTION CINEMATIC VIDEO (main.mp4)   */}
        {/* ========================================================================= */}
        <main className="flex-1 relative overflow-hidden flex flex-col justify-between z-10">
          
          {/* Background Video: Spanning the ENTIRE Section in Native Horizontal Widescreen */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <video
              src="/main_horizontal.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center opacity-95 transition-opacity duration-700"
            />

            {/* Subtle gentle vignette overlays to maintain high video opacity while ensuring text clarity */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#08090C]/50 via-[#08090C]/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090C]/50 via-transparent to-[#08090C]/30 pointer-events-none" />
          </div>

          {/* Foreground Hero Content: Clean Typography directly over the Video */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-14 flex-1 flex flex-col justify-center max-w-2xl">
            <div className="space-y-5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                Welcome to <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#10B981] bg-clip-text text-transparent">SatQuery Command</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                AI-powered Geospatial Intelligence and Satellite Analytics workstation. Ingest multispectral Sentinel-2 MSI and Sentinel-1 SAR rasters, evaluate NDVI indices, and track bi-temporal planetary change.
              </p>

              {/* Quick Action Badges / Workstation Launch */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onLaunchWorkstation('single');
                    if (onScrollToWorkstation) onScrollToWorkstation();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F43F5E] hover:opacity-95 text-white font-sans font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_25px_rgba(244,63,94,0.55)] active:scale-98 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Open Geospatial Canvas</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer note for clean layout balance */}
          <div className="relative z-10 text-center text-[11px] font-mono text-slate-400 py-3 bg-gradient-to-t from-[#08090C] to-transparent">
            ISRO SAC NODE • High-Throughput Earth Observation Inference Suite
          </div>

        </main>

      </div>

    </div>
  );
}
