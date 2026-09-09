import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Layers, 
  Sparkles, 
  ArrowRightCircle, 
  Eye, 
  ArrowLeftRight
} from 'lucide-react';

const SPOTLIGHT_R = 260;
const BG_CONFIGS = {
  antigravity: {
    base: "/spotlight/antigravity_earth_bg.jpg",
    reveal: "/spotlight/antigravity_earth_reveal.jpg"
  },
  nature: {
    base: "/spotlight/workstation_scenic_bg.jpg",
    reveal: "/spotlight/workstation_scenic_bg.jpg"
  }
};

function RevealLayer({ image, cursorX, cursorY }) {
  const isCursorActive = cursorX > -500 && cursorY > -500;
  
  // High-performance GPU-composited radial-gradient mask matching exact specification:
  // Stops: 0 -> 1, 0.4 -> 1, 0.6 -> 0.75, 0.75 -> 0.4, 0.88 -> 0.12, 1 -> 0
  const maskStyle = isCursorActive
    ? `radial-gradient(circle ${SPOTLIGHT_R}px at ${cursorX}px ${cursorY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.12) 88%, rgba(0,0,0,0) 100%)`
    : 'radial-gradient(circle 0px at 0px 0px, transparent, transparent)';

  return (
    <div 
      className="absolute inset-0 bg-center bg-cover bg-no-repeat pointer-events-none z-10"
      style={{
        backgroundImage: `url(${image})`,
        maskImage: maskStyle,
        WebkitMaskImage: maskStyle,
        opacity: isCursorActive ? 1 : 0,
        transition: 'opacity 0.2s ease-out'
      }}
    />
  );
}

export default function HeroSection({ onGetStarted, onSelectModality }) {
  const [activeCard, setActiveCard] = useState('single');

  // Background environment mode: 'nature' (default) or 'antigravity'
  const [bgMode, setBgMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const bg = p.get('bg');
      if (bg === 'nature' || bg === 'antigravity') return bg;
      const saved = localStorage.getItem('satquery_hero_bg');
      if (saved === 'nature' || saved === 'antigravity') return saved;
    }
    return 'nature';
  });

  const toggleBgMode = () => {
    const next = bgMode === 'antigravity' ? 'nature' : 'antigravity';
    setBgMode(next);
    localStorage.setItem('satquery_hero_bg', next);
  };

  const currentBg = BG_CONFIGS[bgMode] || BG_CONFIGS.antigravity;

  // Smooth mouse tracking with lerp for spotlight
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const loop = () => {
      const dx = mouse.current.x - smooth.current.x;
      const dy = mouse.current.y - smooth.current.y;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        smooth.current.x += dx * 0.12;
        smooth.current.y += dy * 0.12;
        setCursorPos({ x: Math.round(smooth.current.x), y: Math.round(smooth.current.y) });
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleCardClick = (modalityId) => {
    setActiveCard(modalityId);
    if (onSelectModality) {
      onSelectModality(modalityId);
    }
  };

  return (
    <section 
      id="hero-viewport" 
      className="relative w-full min-h-screen flex flex-col justify-between overflow-x-hidden select-none bg-[#3b9be6] font-sans"
      style={{ height: '100dvh' }}
    >
      
      {/* Dynamic Background matching Image 2: Pristine Daylight Blue Sky with Natural Driftwood & Spotlight Reveal */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Layer 0: Daylight Blue Sky Gradient from Image 2 */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #3298ec 0%, #5ba4e2 50%, #b7d6f1 100%)'
          }}
        />

        {/* Layer 1: Base natural/antigravity environment image with slow Ken Burns zoom */}
        <div 
          className="absolute inset-0 bg-center bg-cover bg-no-repeat hero-zoom"
          style={{ 
            backgroundImage: `url(${currentBg.base})`
          }}
        />

        {/* Layer 2: Reveal layer with soft circular cursor spotlight */}
        <RevealLayer 
          image={currentBg.reveal}
          cursorX={cursorPos.x}
          cursorY={cursorPos.y}
        />

        {/* Soft atmospheric framing for HUD cards legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Top Telemetry Header Bar (100% Fully Transparent) */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between bg-transparent shrink-0">
        {/* Top Left Professional Tech Brand Logo (Google / Claude / OpenAI aesthetic) */}
        <div className="flex items-center gap-3.5 group cursor-pointer" onClick={toggleBgMode} title={`Active environment: ${bgMode} (Click to toggle theme)`}>
          {/* Generated High-Impact Orbital Aperture Logo Emblem */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl overflow-hidden bg-slate-950 border border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.4)] backdrop-blur-md transition-all duration-300 group-hover:border-emerald-300 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] group-hover:scale-105 shrink-0">
            <img 
              src="/satquery_logo.png" 
              alt="SatQuery AI Logo" 
              className="w-full h-full object-cover scale-110"
            />
            {/* Active Status Glow Dot */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
          </div>

          {/* Logo Brand Typography */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-sans font-black text-2xl sm:text-3xl tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                SatQuery
              </span>
              <span className="font-mono font-black text-2xl sm:text-3xl tracking-wide bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">
                AI
              </span>
            </div>
            <span className="text-[9.5px] font-mono font-bold tracking-[0.25em] text-emerald-400 uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] mt-1">
              GEOSPATIAL INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Right Launch Workstation Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onGetStarted}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-slate-900/80 hover:bg-emerald-950/90 border border-emerald-400/60 hover:border-emerald-300 text-emerald-300 hover:text-white font-mono text-xs font-bold tracking-wider backdrop-blur-md transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.55)] hover:scale-105 whitespace-nowrap shrink-0"
          >
            <span>WORKSTATION</span>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        </div>
      </header>

      {/* Main Content Area: Center Hero Headline + 3 Professional Motive & Capability Boxes */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex-1 flex flex-col justify-between">
        
        {/* CENTER HERO: Elegant Dual-Font Headline + Subtitle + Action CTA */}
        <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto pt-3 sm:pt-6">
          
          {/* Subtle contrast halo behind text to guarantee readability against bright clouds and sky */}
          <div 
            className="absolute -inset-x-10 -inset-y-6 pointer-events-none rounded-[36px] -z-10"
            style={{
              background: 'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0, 0, 0, 0.48) 0%, rgba(0, 0, 0, 0.25) 45%, transparent 85%)',
              filter: 'blur(16px)'
            }}
          />

          {/* Master Headline: Playfair Display Italic + Modern Grotesk Sans with high-contrast text shadows */}
          <h1 className="leading-[0.98] mb-3 select-none">
            <span className="block font-playfair italic font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white [text-shadow:_0_2px_8px_rgba(0,0,0,0.95),_0_0_30px_rgba(16,185,129,0.3)]">
              Every satellite layer
            </span>
            <span className="block font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white uppercase [text-shadow:_0_3px_10px_rgba(0,0,0,0.95),_0_8px_32px_rgba(0,0,0,0.9)] mt-1">
              Joint Fusion Intelligence
            </span>
          </h1>

          {/* Glossy White Pill Button: GET STARTED */}
          <div className="mt-4">
            <button
              onClick={onGetStarted}
              className="group px-7 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-sans font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.45)] hover:shadow-[0_0_40px_rgba(255,255,255,0.7)] hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <span>GET STARTED</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* 3 PROFESSIONAL CAPABILITY BOXES */}
        <div className="w-full pb-2">

          {/* 3 Responsive High-Tech Spotlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            
            {/* BOX 1: Single-Image VQA (Natural Language Satellite Querying) */}
            <div 
              onClick={() => handleCardClick('single')}
              className={`p-3.5 rounded-2xl backdrop-blur-xl transition-all duration-300 cursor-pointer text-left flex flex-col justify-between shadow-xl hover:scale-[1.015] ${
                activeCard === 'single'
                  ? 'border border-cyan-400/50 bg-slate-950/40 shadow-[0_8px_32px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/30'
                  : 'border border-white/20 bg-black/30 hover:border-cyan-400/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[9px] font-mono font-bold text-cyan-300 backdrop-blur-sm shadow-sm">
                    MODE 01 • VISUAL QA
                  </span>
                  <span className="text-[9px] font-mono text-amber-300 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Agentic Trace
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm text-white mb-0.5 tracking-wide">
                  Single-Image VQA
                </h3>
                <p className="text-[11px] text-white/85 font-sans leading-snug mb-2 font-medium">
                  <span className="text-cyan-400 font-mono text-[9.5px] font-bold uppercase tracking-wider">Query:</span> "Identify major infrastructure projects in Venice"
                </p>

                {/* Real Satellite Optical & Softened Object Density Heatmap Thumbnails */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="relative flex-1 h-14 rounded-lg overflow-hidden border border-white/20 shadow group">
                    <img 
                      src="/satellite_assets/heatmap_layer_base.png?v=3" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/satellite_assets/heatmap_layer_base.jpg?v=3";
                      }}
                      alt="Real Optical Satellite City Map"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-0.5 left-1 px-1 rounded bg-black/75 text-[7px] font-mono text-slate-200 font-semibold">
                      Optical Tile
                    </span>
                  </div>

                  <span className="text-cyan-300 font-bold text-xs">→</span>

                  <div className="relative flex-1 h-14 rounded-lg overflow-hidden border border-cyan-400/30 shadow group">
                    <img 
                      src="/satellite_assets/heatmap_layer_density.jpg?v=4" 
                      alt="Real Satellite Object Density Heatmap Overlay"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-0.5 left-1 px-1 rounded bg-black/75 text-[7px] font-mono text-cyan-300 font-semibold">
                      Density Heatmap
                    </span>
                  </div>
                </div>
              </div>

              {/* 3-step Pipeline Chips */}
              <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-1 font-mono text-[8.5px] text-white/80">
                <div className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-center shrink-0 font-medium">
                  Classification
                </div>
                <span className="text-white/50 font-bold shrink-0">→</span>
                <div className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-center shrink-0 font-medium">
                  Model Select
                </div>
                <span className="text-cyan-300 font-bold shrink-0">→</span>
                <div className="px-2.5 py-0.5 rounded-full bg-cyan-500/25 border border-cyan-400/40 text-cyan-200 text-center shrink-0 font-bold shadow-sm">
                  Grounded Output
                </div>
              </div>
            </div>

            {/* BOX 2: Bi-Temporal Change (Automated Change Detection Across Dates) */}
            <div 
              onClick={() => handleCardClick('bitemporal')}
              className={`p-3.5 rounded-2xl backdrop-blur-xl transition-all duration-300 cursor-pointer text-left flex flex-col justify-between shadow-xl hover:scale-[1.015] ${
                activeCard === 'bitemporal'
                  ? 'border border-emerald-400/50 bg-slate-950/40 shadow-[0_8px_32px_rgba(16,185,129,0.2)] ring-1 ring-emerald-400/30'
                  : 'border border-white/20 bg-black/30 hover:border-emerald-400/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[9px] font-mono font-bold text-emerald-300 backdrop-blur-sm shadow-sm">
                    MODE 02 • TIME-SERIES
                  </span>
                  <span className="text-[9px] font-mono text-emerald-300 font-bold">
                    Automated Delta
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm text-white mb-0.5 tracking-wide">
                  Bi-Temporal Change
                </h3>
                <p className="text-[11px] text-white/85 font-sans leading-snug mb-2 font-medium">
                  <span className="text-emerald-400 font-mono text-[9.5px] font-bold uppercase tracking-wider">Motive:</span> Detect sprawl & deforestation between satellite passes
                </p>

                {/* Real Satellite Before & After Comparison */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-1 h-14 rounded-lg overflow-hidden border border-white/20 shadow">
                    <img 
                      src="/satellite_assets/change_before.jpg" 
                      alt="Real Satellite City Before"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-0.5 left-1 px-1 py-0.2 rounded bg-black/75 text-[7px] font-mono text-slate-200 font-semibold">
                      2021 (Before)
                    </span>
                  </div>

                  <div className="text-emerald-400 font-bold text-xs shrink-0 flex flex-col items-center">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
                  </div>

                  <div className="relative flex-1 h-14 rounded-lg overflow-hidden border border-rose-500/40 shadow">
                    <img 
                      src="/satellite_assets/change_after.jpg" 
                      alt="Real Satellite City After with Red Sprawl Mask"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-0.5 left-1 px-1 py-0.2 rounded bg-rose-950/80 border border-rose-500/40 text-[7px] font-mono text-rose-200 font-semibold">
                      2024 (After)
                    </span>
                  </div>
                </div>
              </div>

              {/* Result Summary */}
              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-emerald-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Significant Urban Sprawl (4.5 km²)</span>
                </span>
                <span className="font-mono text-[9px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/40 font-bold shadow-sm">
                  Δ 98.4%
                </span>
              </div>
            </div>

            {/* BOX 3: Optical-SAR Multimodal Fusion (All-Weather Cloud-Penetrating Classification) */}
            <div 
              onClick={() => handleCardClick('crossmodal')}
              className={`p-3.5 rounded-2xl backdrop-blur-xl transition-all duration-300 cursor-pointer text-left flex flex-col justify-between shadow-xl hover:scale-[1.015] ${
                activeCard === 'crossmodal'
                  ? 'border border-amber-400/50 bg-slate-950/40 shadow-[0_8px_32px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/30'
                  : 'border border-white/20 bg-black/30 hover:border-amber-400/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[9px] font-mono font-bold text-amber-300 backdrop-blur-sm shadow-sm">
                    MODE 03 • RADAR FUSION
                  </span>
                  <span className="text-[9px] font-mono text-amber-300 font-bold">
                    All-Weather (SAR)
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm text-white mb-0.5 tracking-wide">
                  Optical-SAR Fusion
                </h3>
                <p className="text-[11px] text-white/85 font-sans leading-snug mb-2 font-medium">
                  <span className="text-amber-300 font-mono text-[9.5px] font-bold uppercase tracking-wider">Motive:</span> Penetrate clouds & night with radar co-registration
                </p>

                {/* Real LULC Classified Segmentation Banner (Softened) */}
                <div className="relative w-full h-14 rounded-lg overflow-hidden border border-amber-400/30 shadow mb-2">
                  <img 
                    src="/satellite_assets/lulc_segmented_map.jpg?v=4" 
                    alt="Real Land-Use Land-Cover Classification Map"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-0.5 left-1 px-1 rounded bg-black/75 text-[7px] font-mono text-amber-300 font-semibold">
                    LULC Thematic Multi-Class Raster
                  </span>
                </div>
              </div>

              {/* Result Summary */}
              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-amber-200 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>High-res land-cover joint analysis</span>
                </span>
                <span className="font-mono text-[9px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/40 font-bold shadow-sm">
                  12 Classes
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
