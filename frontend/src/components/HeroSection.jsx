import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Layers, 
  Sparkles, 
  ArrowRightCircle, 
  Eye, 
  ArrowLeftRight,
  Lock,
  User
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

export default function HeroSection({ currentUser, isAuthenticated, onLoginClick, onLogoutClick, onGetStarted, onSelectModality }) {
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
      className="relative w-full min-h-screen flex flex-col justify-between overflow-x-hidden select-none bg-[#08090C] font-sans"
      style={{ height: '100dvh' }}
    >
      
      {/* DUAL BACKGROUND: Black base + Left Half Video Loop + Right Side Rotating Earth Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
        
        {/* LEFT HALF (50% width): Video Loop with gradient blend to black center */}
        <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full overflow-hidden">
          <video 
            src="/hero-video.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-80"
          />
          {/* Subtle gradient vignette to blend video seamlessly into black background */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>

        {/* RIGHT HALF (50% width): Rotating Earth Sphere Animation */}
        <div className="hidden lg:flex absolute top-0 right-0 w-1/2 h-full items-center justify-center pointer-events-none">
          {/* Outer Orbital Ring 1 */}
          <div className="absolute w-[460px] h-[460px] rounded-full border border-[#8B5CF6]/40 border-dashed animate-[spin_35s_linear_infinite]" />
          
          {/* Outer Orbital Ring 2 */}
          <div className="absolute w-[380px] h-[380px] rounded-full border border-[#10B981]/50 animate-[spin_20s_linear_infinite_reverse]" />

          {/* Glowing Radial Halo behind Earth */}
          <div 
            className="absolute w-80 h-80 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 75%)',
              filter: 'blur(20px)'
            }}
          />

          {/* 3D Rotating Earth Sphere Container */}
          <div className="relative w-80 h-80 rounded-full overflow-hidden border-2 border-[#8B5CF6]/80 shadow-[0_0_60px_rgba(139,92,246,0.55)] pointer-events-none">
            {/* 100% Zero-Gap Infinite Continuous Rotating Earth Surface Texture */}
            <div className="absolute top-0 left-0 h-full w-[200%] flex animate-[seamlessPan_22s_linear_infinite]">
              <img 
                src="/spotlight/antigravity_earth_bg.jpg?v=map" 
                alt="Earth Texture Segment 1" 
                className="w-1/2 h-full object-cover shrink-0"
              />
              <img 
                src="/spotlight/antigravity_earth_bg.jpg?v=map" 
                alt="Earth Texture Segment 2" 
                className="w-1/2 h-full object-cover shrink-0"
              />
            </div>
            
            {/* Earth Night Atmospheric Shadow & Specular Gloss */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 35% 35%, transparent 25%, rgba(8, 9, 12, 0.65) 65%, rgba(8, 9, 12, 0.95) 100%)'
              }}
            />

            {/* Glowing Atmosphere Rim */}
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-[#10B981]/70 pointer-events-none" />
          </div>


        </div>

        {/* Global Dark Vignette Overlay for Crisp Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70 pointer-events-none" />
      </div>


      {/* Top Telemetry Header Bar (100% Fully Transparent) */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between bg-transparent shrink-0">
        {/* Top Left Professional Tech Brand Logo */}
        <div className="flex items-center gap-3.5 group cursor-pointer" title="SatQuery AI Portal">
          {/* Orbital Aperture Logo Emblem */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl overflow-hidden bg-[#08090C] border border-[#8B5CF6]/80 shadow-[0_0_20px_rgba(139,92,246,0.4)] backdrop-blur-md transition-all duration-300 group-hover:border-[#10B981] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] group-hover:scale-105 shrink-0">
            <img 
              src="/satquery_logo.png" 
              alt="SatQuery AI Logo" 
              className="w-full h-full object-cover scale-110"
            />
          </div>

          {/* Logo Brand Typography */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-sans font-black text-2xl sm:text-3xl tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                SatQuery
              </span>
              <span className="font-mono font-black text-2xl sm:text-3xl tracking-wide bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#10B981] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]">
                AI
              </span>
            </div>
            <span className="text-[9.5px] font-mono font-bold tracking-[0.25em] text-[#10B981] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] mt-1">
              GEOSPATIAL INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Right Nav Action Buttons */}
        <div className="flex items-center gap-2.5">
          {!isAuthenticated ? (
            <button
              onClick={onLoginClick}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-[#12131C]/90 hover:bg-[#1A1B26] border border-[#8B5CF6]/70 hover:border-[#10B981] text-white font-mono text-xs font-bold tracking-wider backdrop-blur-md transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.55)] hover:scale-105 whitespace-nowrap shrink-0"
            >
              <Lock className="w-4 h-4 text-[#10B981]" />
              <span>LOGIN / REGISTER</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onLoginClick}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F43F5E] hover:opacity-95 text-white font-mono text-xs font-black tracking-wider backdrop-blur-md transition-all cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-105 whitespace-nowrap shrink-0"
              >
                <span>ENTER WORKSTATION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onLogoutClick}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-[#12131C]/90 hover:bg-rose-950/80 border border-white/15 hover:border-rose-500/60 text-slate-200 hover:text-rose-200 font-mono text-xs font-bold tracking-wider backdrop-blur-md transition-all cursor-pointer shadow-sm hover:scale-105 whitespace-nowrap shrink-0"
              >
                <User className="w-3.5 h-3.5 text-slate-300" />
                <span>LOGOUT</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area: Center Hero Headline + Action CTA */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 flex flex-col items-center justify-center">
        
        {/* CENTER HERO: Elegant Dual-Font Headline + Action CTA */}
        <div className="relative flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Master Headline */}
          <h1 className="leading-[0.98] mb-4 select-none">
            <span className="block font-sans italic font-light tracking-wide text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white [text-shadow:_0_2px_12px_rgba(0,0,0,0.95),_0_0_35px_rgba(139,92,246,0.4)]">
              Every satellite layer
            </span>
            <span className="block font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight bg-gradient-to-r from-white via-[#C084FC] to-[#34D399] bg-clip-text text-transparent uppercase [text-shadow:_0_3px_12px_rgba(0,0,0,0.95)] mt-1">
              Joint Fusion Intelligence
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200/90 max-w-2xl mx-auto mb-6 font-sans font-normal leading-relaxed drop-shadow-md">
            Sovereign Multi-Modal Geospatial Foundation AI for High-Throughput Spectral Inference, Automated LULC Segmentation, and All-Weather Radar Co-Registration.
          </p>

          {/* Action CTAs: GET STARTED & EXPLORE MODELS */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onGetStarted}
              className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F43F5E] hover:opacity-95 text-white font-sans font-black text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:shadow-[0_0_40px_rgba(244,63,94,0.6)] hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <span>GET STARTED</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href="#models-showcase"
              className="px-6 py-3.5 rounded-full bg-[#12131C]/90 hover:bg-[#1A1B26] border border-[#8B5CF6]/60 hover:border-[#10B981] text-white font-sans font-semibold text-xs tracking-wider uppercase transition-all duration-300 backdrop-blur-md flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              <span>EXPLORE AI MODELS</span>
              <span className="text-[#10B981] animate-bounce">↓</span>
            </a>
          </div>

        </div>

      </div>

    </section>
  );
}
