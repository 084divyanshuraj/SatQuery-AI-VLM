import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Clock, 
  LogOut, 
  User, 
  History, 
  ChevronRight
} from 'lucide-react';

export default function MissionHub({ 
  currentUser, 
  onLaunchWorkstation, 
  onScrollToWorkstation,
  onLogout, 
  onViewPortal 
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

  // History Missions (Matching Obsidian & Aurora Palette)
  const recentMissions = [
    {
      id: 'history-1',
      title: 'Venice Port Maritime Expansion',
      modalityId: 'single',
      modalityTag: 'MODE 01 • VQA',
      date: 'Today, 11:42 AM',
      location: 'Venice Lagoon, Italy',
      thumbnail: '/satellite_assets/heatmap_layer_density.jpg',
      badgeColor: 'border-[#10B981]/50 text-[#10B981] bg-[#10B981]/10',
      borderGlow: 'hover:border-[#10B981] hover:shadow-[0_0_18px_rgba(16,185,129,0.22)]'
    },
    {
      id: 'history-2',
      title: 'Amazon Deforestation Delta',
      modalityId: 'bitemporal',
      modalityTag: 'MODE 02 • BI-TEMPORAL',
      date: 'Yesterday, 17:15 PM',
      location: 'Rondônia, Brazil',
      thumbnail: '/satellite_assets/change_after.jpg',
      badgeColor: 'border-[#F43F5E]/50 text-[#F43F5E] bg-[#F43F5E]/10',
      borderGlow: 'hover:border-[#F43F5E] hover:shadow-[0_0_18px_rgba(244,63,94,0.22)]'
    },
    {
      id: 'history-3',
      title: 'Mumbai Monsoon Cloud Penetration',
      modalityId: 'crossmodal',
      modalityTag: 'MODE 03 • RADAR FUSION',
      date: '08 Sep, 09:30 AM',
      location: 'Mumbai Coastal Delta, India',
      thumbnail: '/satellite_assets/lulc_segmented_map.jpg',
      badgeColor: 'border-[#8B5CF6]/50 text-[#8B5CF6] bg-[#8B5CF6]/10',
      borderGlow: 'hover:border-[#8B5CF6] hover:shadow-[0_0_18px_rgba(139,92,246,0.22)]'
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#08090C] text-white font-sans overflow-hidden flex flex-col select-none">
      
      {/* Background Canvas: Satellite Constellation & Radar Matrix (Preserved & Enhanced) */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" 
      />

      {/* Top Header Bar */}
      <header className="relative z-20 h-13 px-4 sm:px-6 border-b border-white/10 bg-[#12131C]/90 backdrop-blur-xl flex items-center justify-between shrink-0">
        
        {/* Left: SatQuery Logo */}
        <div className="flex items-center gap-2.5">
          <div 
            onClick={onViewPortal}
            title="Return to SatQuery AI Portal"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#08090C] border border-[#8B5CF6]/60 p-0.5 flex items-center justify-center shadow-[0_0_14px_rgba(139,92,246,0.35)] group-hover:border-[#EC4899] transition-all">
              <img 
                src="/satquery_logo.png" 
                alt="SatQuery AI Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center gap-1 leading-none">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-slate-100 transition-colors">SatQuery</span>
              <span className="font-mono font-black text-base bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#10B981] bg-clip-text text-transparent">AI</span>
            </div>
          </div>
        </div>

        {/* Center: Live Orbit Telemetry Ticker */}
        <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-slate-300">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#08090C] border border-white/10">
            <Clock className="w-3 h-3 text-[#10B981]" />
            <span className="font-bold text-slate-200 tabular-nums">{currentTime || '00:00:00'} UTC</span>
          </div>
        </div>

        {/* Right: User Profile & Logout */}
        <div className="flex items-center gap-2.5">

          {/* User Profile Pill Widget */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8B5CF6] via-[#EC4899] to-[#10B981] p-[1.5px] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#08090C] flex items-center justify-center text-[11px] font-bold text-[#8B5CF6]">
                {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
              </div>
            </div>

            <div className="hidden lg:flex flex-col text-left leading-none">
              <span className="text-[11px] font-bold text-white truncate max-w-[120px]">
                {currentUser?.name || 'Dr. Vikram S. Rao'}
              </span>
              <span className="text-[9px] font-mono text-[#10B981] truncate max-w-[120px] mt-0.5 font-medium">
                {currentUser?.rank || 'Level-4 Analyst'}
              </span>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg bg-[#08090C] hover:bg-rose-950/80 border border-white/10 hover:border-rose-500/50 text-slate-300 hover:text-rose-200 transition-all cursor-pointer ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </header>

      {/* Main Grid: Sidebar ("Recents" & "Output") + Central Workspace */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR: RECENTS / HISTORY                                           */}
        {/* ========================================================================= */}
        <aside className="w-full lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#12131C]/95 backdrop-blur-xl p-3.5 sm:p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          
          <div className="space-y-3">
            {/* Primary Action Button ("Output / Launch") with Vibrant Violet to Coral Gradient */}
            <button
              onClick={() => {
                onLaunchWorkstation('single');
                if (onScrollToWorkstation) onScrollToWorkstation();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F43F5E] hover:opacity-95 text-white font-sans font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.55)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
            >
              <Plus className="w-4 h-4 text-white stroke-[3] group-hover:rotate-90 transition-transform" />
              <span>START NEW WORKSPACE</span>
            </button>

            {/* Recents Section Header */}
            <div className="flex items-center justify-between px-1 pt-1">
              <span className="text-[11px] font-mono font-bold tracking-widest text-slate-300 uppercase flex items-center gap-1.5">
                <History className="w-3 h-3 text-[#8B5CF6]" />
                <span>RECENTS / HISTORY</span>
              </span>
            </div>

            {/* History Items List */}
            <div className="space-y-2">
              {recentMissions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onLaunchWorkstation(item.modalityId);
                    if (onScrollToWorkstation) onScrollToWorkstation();
                  }}
                  className={`group relative p-2 rounded-xl bg-[#08090C] hover:bg-[#1A1B26] border border-white/10 ${item.borderGlow} transition-all cursor-pointer flex items-center gap-2.5 shadow-sm`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-bold border ${item.badgeColor}`}>
                        {item.modalityTag}
                      </span>
                      <span className="text-[8.5px] font-mono text-slate-300">{item.date}</span>
                    </div>

                    <h4 className="text-[11.5px] font-bold text-white truncate group-hover:text-[#10B981] transition-colors leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[9.5px] text-slate-300 font-sans truncate">
                      {item.location}
                    </p>
                  </div>

                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#8B5CF6] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>

            {/* Quick Helper */}
            <div className="p-2.5 rounded-lg bg-[#08090C] border border-white/10 text-[10px] font-sans text-slate-300 leading-tight">
              Click any past session or scroll down to view and interact with the full Geospatial Workstation canvas.
            </div>

          </div>

          {/* User Status Card at Bottom of Sidebar */}
          <div className="pt-3 border-t border-white/10">
            <div className="p-2.5 rounded-xl bg-[#08090C] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#12131C] border border-[#8B5CF6]/50 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-[#8B5CF6]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white leading-none mb-0.5 truncate max-w-[120px]">
                    {currentUser?.name || 'Dr. Vikram S. Rao'}
                  </div>
                  <div className="text-[9px] font-mono text-[#10B981] leading-none">
                    ONLINE • SAC AUTHENTICATED
                  </div>
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Log Out"
                className="text-[10px] font-mono text-[#F43F5E] hover:text-white hover:underline cursor-pointer font-semibold"
              >
                Logout
              </button>
            </div>
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* CENTER WORKSPACE AREA: CLEAN ORBITAL RADAR VIEW                           */}
        {/* ========================================================================= */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto flex flex-col justify-between">
          
          {/* Welcome Heading with High-Contrast Linear Gradient */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-2">
              Welcome to <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#10B981] bg-clip-text text-transparent">SatQuery Command</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-2xl">
              AI-powered Geospatial Intelligence and Satellite Analytics workstation. Ingest multispectral Sentinel-2 MSI and Sentinel-1 SAR rasters, evaluate NDVI indices, and track bi-temporal planetary change.
            </p>
          </div>

          {/* Clean Constellation Viewport */}
          <div className="my-auto" />

          {/* Footer note for clean layout balance */}
          <div className="text-center text-[11px] font-mono text-slate-400">
            ISRO SAC NODE • High-Throughput Earth Observation Inference Suite
          </div>

        </main>

      </div>

    </div>
  );
}
