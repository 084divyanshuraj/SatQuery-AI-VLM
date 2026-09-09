import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FastForward } from 'lucide-react';

/**
 * ISRO Cinematic Earth-Observation Satellite Workflow Sequence
 * Realistic, restrained, scientific satellite ground-station mission initialization.
 * 
 * Timeline:
 * 0.0 - 2.0s: Earth orbit horizon & ISRO mission telemetry opening
 * 2.0 - 4.5s: Authentic ISRO EOS-04 satellite enters from left orbit
 * 4.2 - 6.2s: Precision remote-sensing scanning swath locks onto Earth surface
 * 6.0 - 7.5s: Multispectral satellite image expands from scanned AOI
 * 7.5 - 8.8s: Natural language query typing ("Find water areas")
 * 8.8 - 10.2s: AI spectral scan sweep & water segmentation highlight
 * 10.2 - 11.5s: Extracted water mask separates into dedicated result panel
 * 11.5 - 13.2s: Technical telemetry output on right side completes
 * 13.2s: Smooth transition to main SatQuery AI workstation
 */
export default function IsroLoadingSequence({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  const handleFinish = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsExiting(true);
    onComplete?.();
  }, [onComplete]);

  // Handle keyboard skip (ESC or Space) & prefers-reduced-motion
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete?.();
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish, onComplete]);

  // High-precision requestAnimationFrame animation clock
  useEffect(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const freeze = params?.get('freeze_intro') === '1';

    if (freeze) {
      setElapsed(12.0); // Freeze at completed inspection state
      return;
    }

    const updateClock = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const seconds = (timestamp - startTimeRef.current) / 1000;
      setElapsed(seconds);

      if (seconds < 13.2) {
        rafRef.current = requestAnimationFrame(updateClock);
      } else {
        handleFinish();
      }
    };

    rafRef.current = requestAnimationFrame(updateClock);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleFinish]);

  // Derived animation states
  const isSatelliteVisible = elapsed >= 1.8;
  const isBeamActive = elapsed >= 4.0 && elapsed < 7.2;
  const isFootprintActive = elapsed >= 4.4 && elapsed < 7.5;
  const isImageEmerging = elapsed >= 5.8;
  const isQueryActive = elapsed >= 7.2;
  const isScanSweepActive = elapsed >= 8.5 && elapsed < 10.5;
  const isSegmentedActive = elapsed >= 9.2;
  const isWaterExtractedActive = elapsed >= 10.2;
  const isFinalStatsActive = elapsed >= 11.2;

  // Natural language query typing calculation
  const targetQuery = "Find water areas";
  let queryTypedText = "";
  if (elapsed >= 7.3) {
    const typeProgress = Math.min(1, (elapsed - 7.3) / 1.3);
    const charsToShow = Math.floor(typeProgress * targetQuery.length);
    queryTypedText = targetQuery.slice(0, charsToShow);
  }

  // Satellite position interpolation (Smooth orbital entry from left)
  // Enters at t=1.8s, settles into observation station by t=4.0s
  const satProgress = Math.max(0, Math.min(1, (elapsed - 1.8) / 2.2));
  // Smooth cubic ease-out
  const satEase = 1 - Math.pow(1 - satProgress, 3);
  const satX = -320 + satEase * 380; // from -320px to +60px
  const satY = 110 + satEase * 30;   // subtle orbital drift

  // AI scan sweep progress across satellite image (0% to 100%)
  const sweepProgress = isScanSweepActive 
    ? Math.min(100, Math.max(0, ((elapsed - 8.5) / 1.5) * 100))
    : (elapsed >= 10.0 ? 100 : 0);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black text-slate-100 overflow-hidden select-none transition-opacity duration-500 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ willChange: 'opacity' }}
    >
      {/* ============================================================ */}
      {/* 1. BACKGROUND: PHOTOREALISTIC EARTH HORIZON VIEWPORT         */}
      {/* ============================================================ */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Deep space background */}
        <div className="absolute inset-0 bg-black" />

        {/* Photorealistic curved Earth horizon from orbit */}
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: 'url(/satellite_assets/isro_earth_orbit_horizon.jpg)',
            transform: `scale(${1 + elapsed * 0.008}) translateY(${Math.min(20, elapsed * 1.5)}px)`,
          }}
        />

        {/* Atmospheric limb glow enhancement */}
        <div
          className="absolute inset-x-0 bottom-[10%] h-[42%] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 95% 45% at 65% 100%, rgba(56, 189, 248, 0.32) 0%, rgba(14, 165, 233, 0.12) 45%, transparent 75%)',
            opacity: Math.min(1, 0.6 + elapsed * 0.04)
          }}
        />

        {/* Orbital Sunrise Light Flare */}
        <div
          className="absolute top-[24%] right-[8%] w-[45vw] h-[45vw] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(254, 215, 170, 0.45) 0%, rgba(249, 115, 22, 0.22) 30%, rgba(14, 136, 211, 0.08) 58%, transparent 75%)',
            filter: 'blur(36px)',
            opacity: Math.min(1, 0.7 + elapsed * 0.02)
          }}
        />

        {/* Subtle SVG orbital trajectory arc */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <defs>
            <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          <path
            d="M -100,580 Q 720,290 1680,510"
            fill="none"
            stroke="url(#orbitGrad)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />
        </svg>

        {/* Vignette edge blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/75 pointer-events-none" />
      </div>



      {/* High-Visibility Dedicated Floating Skip Button in Right Downwards Corner */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[120] pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleFinish();
          }}
          className="group px-4 py-2 rounded-full border border-emerald-400/60 bg-black/80 hover:bg-emerald-950/70 text-white hover:text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.35)] hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] hover:border-emerald-300 flex items-center gap-2.5 hover:scale-105 active:scale-95"
          title="Skip animation and go directly to landing page (Esc)"
        >
          <span>SKIP ANIMATION</span>
          <span className="text-[10px] text-emerald-300 font-medium border border-emerald-400/50 rounded px-1.5 py-0.5 bg-emerald-500/20">
            ESC
          </span>
          <FastForward className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* ============================================================ */}
      {/* 3. INITIAL ISRO LOGO (Center at start, dissolves by t=2.5s)   */}
      {/* ============================================================ */}
      <div 
        className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none transition-all duration-700 ease-out"
        style={{
          opacity: elapsed < 2.0 ? 1 : Math.max(0, 1 - (elapsed - 2.0) * 1.5),
          transform: `scale(${elapsed < 2.0 ? 1 : Math.max(0.75, 1 - (elapsed - 2.0) * 0.25)}) translateY(${elapsed < 2.0 ? 0 : -30}px)`
        }}
      >
        <div className="relative mb-3 p-3.5 rounded-2xl bg-black/60 border border-white/20 backdrop-blur-md shadow-2xl">
          <img
            src="/satellite_assets/isro_logo.svg"
            alt="Indian Space Research Organisation"
            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_0_24px_rgba(244,114,22,0.45)]"
          />
        </div>
        <h2 className="text-sm md:text-base font-medium tracking-[0.25em] text-white/95 drop-shadow-md">
          भारतीय अंतरिक्ष अनुसंधान संगठन
        </h2>
        <h1 className="text-xs md:text-sm font-mono tracking-[0.35em] text-cyan-200/95 uppercase font-semibold mt-1 drop-shadow-sm">
          INDIAN SPACE RESEARCH ORGANISATION
        </h1>
        <div className="flex items-center gap-2 mt-2 font-mono text-[9px] text-white/60 tracking-widest uppercase">
          <span>EARTH OBSERVATION & REMOTE SENSING PROGRAMME</span>
          <span className="text-white/30">•</span>
          <span className="text-emerald-400 font-semibold">GEO-FOUNDATION AI</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. REALISTIC ISRO EARTH-OBSERVATION SATELLITE (Left Orbit)    */}
      {/* ============================================================ */}
      {isSatelliteVisible && (
        <div 
          className="absolute z-20 pointer-events-none transition-all duration-75 ease-out"
          style={{
            left: `${satX}px`,
            top: `${satY}px`,
            width: '280px',
            opacity: Math.min(1, satProgress * 1.5)
          }}
        >
          {/* Satellite Vehicle Graphics */}
          <div className="relative">
            <img 
              src="/satellite_assets/isro_satellite_craft.png" 
              alt="ISRO EOS-04 Earth Observation Spacecraft"
              className="w-full object-contain filter drop-shadow-[0_10px_35px_rgba(0,0,0,0.85)] drop-shadow-[0_0_20px_rgba(56,189,248,0.2)]"
            />

            {/* Satellite ID telemetry badge */}
            <div className="absolute -bottom-2 left-6 px-2 py-0.5 rounded bg-black/75 border border-cyan-500/40 backdrop-blur-md text-[8.5px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>EOS-04 • REMOTE SENSING PAYLOAD</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. CONTROLLED SCANNING BEAM & GROUND FOOTPRINT               */}
      {/* ============================================================ */}
      {isBeamActive && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="scanBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#0ea5e9" stopOpacity="0.45" />
              <stop offset="85%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id="targetHalo">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#0ea5e9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Diagonally projected Remote Sensing Swath */}
          <polygon
            points={`${satX + 130},${satY + 160} ${satX + 160},${satY + 175} 560,620 460,605`}
            fill="url(#scanBeamGrad)"
            className="animate-pulse"
            style={{ opacity: 0.65 }}
          />

          {/* Center focal laser beam line */}
          <line
            x1={satX + 145}
            y1={satY + 170}
            x2="510"
            y2="612"
            stroke="#67e8f9"
            strokeWidth="1.8"
            strokeDasharray="4 3"
            className="animate-pulse"
          />
        </svg>
      )}

      {/* Surface Scan Footprint Target (India / AOI) */}
      {isFootprintActive && (
        <div 
          className="absolute z-20 pointer-events-none"
          style={{ left: '510px', top: '612px', transform: 'translate(-50%, -50%)' }}
        >
          {/* Concentric radar pulse rings */}
          <div className="relative flex items-center justify-center">
            <span className="absolute w-16 h-16 rounded-full border border-cyan-400/80 animate-ping" />
            <span className="absolute w-28 h-28 rounded-full border border-cyan-400/40 animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_16px_#22d3ee]" />

            {/* Target telemetry label */}
            <div className="absolute left-8 top-1 whitespace-nowrap px-2.5 py-1 rounded bg-black/85 border border-cyan-400/60 backdrop-blur-md text-[9px] font-mono text-cyan-200 shadow-xl space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>AREA OF INTEREST LOCKED</span>
              </div>
              <p className="text-[8px] text-white/60">SWATH: 16.5193° N, 80.6480° E • 10m GSD</p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. LARGE SATELLITE IMAGE + QUERY BOX + WATER SEGMENTATION     */}
      {/* ============================================================ */}
      {isImageEmerging && (
        <div 
          className="absolute inset-0 z-30 flex items-center justify-center p-4 md:p-6 pointer-events-none"
          style={{
            transform: `scale(${Math.min(1, 0.7 + (elapsed - 5.8) * 0.3)})`,
            opacity: Math.min(1, (elapsed - 5.8) * 1.8),
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out'
          }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 max-w-6xl w-full justify-center">
            
            {/* ---------------------------------------------------- */}
            {/* LEFT / CENTER: SOURCE SATELLITE IMAGE PANEL          */}
            {/* ---------------------------------------------------- */}
            <div className="flex flex-col items-center w-full max-w-xl">
              <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-slate-950/80 shadow-[0_12px_45px_rgba(0,0,0,0.85)] w-full aspect-video pointer-events-auto">
                
                {/* Base Satellite Orthophoto */}
                <img
                  src="/satellite_assets/sentinel_aoi_raw.jpg"
                  alt="Raw Sentinel-2 Multispectral Imagery"
                  className="w-full h-full object-cover"
                />

                {/* Segmented Layer (Revealed by AI scan sweep) */}
                {isSegmentedActive && (
                  <img
                    src="/satellite_assets/sentinel_water_segmented.jpg"
                    alt="Multispectral Water Segmentation Highlight"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out"
                    style={{
                      opacity: isSegmentedActive ? 0.92 : 0,
                    }}
                  />
                )}

                {/* AI Laser Scan Sweep Line */}
                {isScanSweepActive && (
                  <div 
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] pointer-events-none"
                    style={{ top: `${sweepProgress}%` }}
                  >
                    <div className="absolute -top-3 right-3 px-2 py-0.5 rounded bg-black/80 border border-cyan-400 text-[8px] font-mono text-cyan-300">
                      NEURAL SWEEP: {Math.round(sweepProgress)}%
                    </div>
                  </div>
                )}

                {/* High-Tech Corner Crosshairs */}
                <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-black/75 backdrop-blur-md border border-white/20 text-[9px] font-mono text-white/90 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>SATELLITE: EOS-06 / RISAT-1A</span>
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-black/75 backdrop-blur-md border border-white/20 text-[9px] font-mono text-cyan-300">
                  MULTISPECTRAL • 10m/px
                </div>
                <div className="absolute bottom-2.5 left-2.5 px-2 py-1 rounded bg-black/75 backdrop-blur-md border border-white/20 text-[8.5px] font-mono text-white/70">
                  AOI: 16.5193° N, 80.6480° E
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-black/75 backdrop-blur-md border border-white/20 text-[8.5px] font-mono text-amber-300 font-semibold">
                  {isSegmentedActive ? "SEGMENTATION: COMPLETE" : "DATA INGESTED"}
                </div>
              </div>

              {/* Natural Language Query Box underneath Satellite Image */}
              {isQueryActive && (
                <div 
                  className="w-full mt-2.5 px-4 py-2.5 rounded-xl bg-slate-950/85 backdrop-blur-xl border border-white/20 shadow-xl flex items-center justify-between text-xs font-mono transition-all duration-300"
                  style={{
                    opacity: Math.min(1, (elapsed - 7.2) * 2),
                    transform: `translateY(${Math.max(0, (1 - (elapsed - 7.2)) * 10)}px)`
                  }}
                >
                  <div className="flex items-center gap-2 text-white/90">
                    <span className="text-cyan-400 font-bold">QUERY:</span>
                    <span className="text-white font-medium tracking-wide">
                      "{queryTypedText}"
                    </span>
                    {elapsed < 8.8 && (
                      <span className="w-2 h-4 bg-cyan-400 animate-pulse inline-block" />
                    )}
                  </div>

                  {elapsed >= 8.6 && (
                    <div className="flex items-center gap-1.5 text-[10px] text-cyan-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      <span>Analyzing satellite imagery...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* RIGHT: WATER EXTRACTION PANEL + TECHNICAL TELEMETRY  */}
            {/* ---------------------------------------------------- */}
            {isWaterExtractedActive && (
              <div 
                className="flex flex-col gap-2.5 w-full max-w-sm transition-all duration-500 ease-out pointer-events-auto"
                style={{
                  opacity: Math.min(1, (elapsed - 10.2) * 1.5),
                  transform: `translateX(${Math.max(0, (1 - (elapsed - 10.2) * 1.2) * 40)}px)`
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-300 uppercase">
                      EXTRACTED HYDROLOGY LAYER
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 font-semibold">
                    GROUNDED
                  </span>
                </div>

                {/* Extracted Water Mask Graphic */}
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950/90 shadow-2xl p-2 flex items-center justify-center">
                  <div 
                    className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.15) 0%, transparent 80%), repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.05) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.05) 20px)'
                    }}
                  >
                    <img 
                      src="/satellite_assets/sentinel_water_extracted.png" 
                      alt="Isolated Water Mask"
                      className="w-full h-full object-contain filter drop-shadow-[0_0_12px_#06b6d4]"
                    />
                    
                    {/* Measurement Overlay */}
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-cyan-400/40 text-[8.5px] font-mono text-cyan-300">
                      AREA: 4.82 km²
                    </div>
                  </div>
                </div>

                {/* 3-4 Short Technical Output Telemetry Lines */}
                {isFinalStatsActive && (
                  <div 
                    className="p-3.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/20 shadow-xl space-y-2 font-mono text-[9.5px] transition-all duration-300"
                    style={{
                      opacity: Math.min(1, (elapsed - 11.2) * 2)
                    }}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                      <span className="text-white/60">WATER BODIES DETECTED</span>
                      <span className="text-white font-bold">Area: 4.82 km²</span>
                    </div>

                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                      <span className="text-white/60">PRIMARY CLASS</span>
                      <span className="text-cyan-300 font-semibold">Surface Water</span>
                    </div>

                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                      <span className="text-white/60">CONFIDENCE</span>
                      <span className="text-emerald-400 font-bold">94.2%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/60">MODEL</span>
                      <span className="text-amber-300 font-semibold">Multispectral Segmentation</span>
                    </div>

                    {/* Final Status */}
                    <div className="pt-1 text-center">
                      <span className="inline-flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        ANALYSIS COMPLETE • ENTERING WORKSTATION
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}


    </div>
  );
}
