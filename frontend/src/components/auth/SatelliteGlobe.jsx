import React from 'react';

export default function SatelliteGlobe({ isScanning, scanText, isSuccess, expanding }) {
  // If not scanning and not success, we shouldn't block clicks underneath, but pointer-events-none handles this.
  
  return (
    <div className={`absolute inset-0 z-10 flex items-center justify-center transition-all duration-1000 ${expanding ? 'scale-[8] opacity-0' : 'scale-100 opacity-100'} pointer-events-none`}>
      {/* Globe Container */}
      <div className={`relative transition-all duration-1000 ${isScanning || isSuccess ? 'w-80 h-80 opacity-100' : 'w-48 h-48 opacity-0 scale-50'}`}>
        
        {/* Globe Base */}
        <div className="absolute inset-0 rounded-full border border-emerald-500/40 bg-[#020617]/60 backdrop-blur-sm overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.3)]">
          
          {/* Latitude / Longitude Grid lines using CSS background */}
          <div className="absolute inset-0 rounded-full bg-[linear-gradient(to_right,#10b98133_1px,transparent_1px),linear-gradient(to_bottom,#10b98133_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-60 mix-blend-screen" />

          {/* Simple SVG Continents Silhouette (Mocked using radial patterns for lightness) */}
          <div className="absolute inset-0 rounded-full opacity-30 bg-[radial-gradient(ellipse_at_center,_#10b981_0%,_transparent_70%)] blur-lg mix-blend-screen animate-pulse" />
          
          {/* Scanning Beam */}
          {isScanning && !isSuccess && (
            <div className="absolute top-0 bottom-0 w-full animate-scan-sweep origin-left">
              <div className="w-1 h-full bg-cyan-400 shadow-[0_0_20px_#22d3ee] blur-[1px]" />
              <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-cyan-400/20 to-transparent" />
            </div>
          )}
        </div>

        {/* Outer Orbital Rings */}
        <div className="absolute -inset-6 rounded-full border border-emerald-500/20 border-dashed animate-[spin_20s_linear_infinite]" />
        <div className="absolute -inset-12 rounded-full border border-cyan-500/10 border-dotted animate-[spin_30s_linear_infinite_reverse]" />

        {/* HUD Data Output */}
        <div className={`absolute -right-24 sm:-right-32 top-1/4 flex flex-col gap-2 font-mono text-[9px] sm:text-[10px] text-cyan-400 tracking-wider transition-opacity duration-500 ${isScanning || isSuccess ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
            <span>LAT 28.6139 N</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '200ms'}} />
            <span>LON 77.2090 E</span>
          </div>
          <div className="mt-2 text-emerald-400 opacity-80">
            {isSuccess ? "ORBITAL LINK: ACTIVE" : "REMOTE SENSING: ONLINE"}
          </div>
        </div>

        {/* Center Success Status */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 delay-300 ${isSuccess && !expanding ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
          <div className="px-4 py-2 bg-emerald-950/90 border border-emerald-400/60 rounded-lg shadow-[0_0_40px_rgba(16,185,129,0.6)] backdrop-blur-md">
            <span className="text-emerald-300 font-mono font-black text-sm sm:text-base tracking-widest drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
              ACCESS GRANTED
            </span>
          </div>
          <span className="mt-3 text-[9px] sm:text-[10px] font-mono text-emerald-400/90 tracking-[0.2em] uppercase drop-shadow-md">
            Geospatial Intelligence System Online
          </span>
        </div>

        {/* Center Scanning Status */}
        {isScanning && !isSuccess && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/80 px-3 py-1.5 rounded border border-cyan-500/40 backdrop-blur-sm">
            <span className="text-[9px] sm:text-[10px] font-mono text-cyan-300 tracking-[0.15em] animate-pulse">
              {scanText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
