import React from 'react';
import { 
  ArrowRight, 
  ArrowLeftRight, 
  Sparkles, 
  Cpu, 
  Layers, 
  Activity, 
  Eye, 
  Radar, 
  ShieldCheck, 
  Binary
} from 'lucide-react';

export default function ModelShowcase({ onSelectModel }) {
  return (
    <section 
      id="models-showcase" 
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#08090C] border-t border-white/10 overflow-hidden text-white font-sans"
    >
      {/* Dynamic Ambient Glows (Amethyst Violet & Cyber Emerald) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/12 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F43F5E]/06 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12131C] border border-[#8B5CF6]/40 text-[#C084FC] font-mono text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
            <span>ORBITAL FOUNDATION ENGINES • MULTI-MODAL AI</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Multi-Modal Satellite <span className="bg-gradient-to-r from-white via-[#C084FC] to-[#34D399] bg-clip-text text-transparent">Intelligence Suite</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Click on any model below to explore its complete <strong>Mission & Vision</strong>, underlying deep-learning architecture, step-by-step pipeline, and real high-resolution satellite inference demonstrations.
          </p>
        </div>

        {/* 3 Model Cards Row-Wise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* ========================================================================= */}
          {/* CARD 1: Single-Image VQA (Visual Question Answering)                     */}
          {/* ========================================================================= */}
          <div 
            onClick={() => onSelectModel('vqa')}
            className="group relative flex flex-col justify-between p-6 rounded-3xl bg-[#12131C]/90 border border-white/10 hover:border-[#8B5CF6] backdrop-blur-2xl transition-all duration-300 cursor-pointer shadow-[0_4px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_35px_rgba(139,92,246,0.25)] hover:-translate-y-1.5 overflow-hidden"
          >
            {/* Hover Accent Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#10B981] opacity-70 group-hover:opacity-100 transition-opacity" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[10px] font-mono font-bold text-[#C084FC] shadow-sm">
                  MODE 01 • VISUAL QA
                </span>
                <span className="text-[10px] font-mono text-[#34D399] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  Agentic Trace
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-[#C084FC] transition-colors">
                Single-Image VQA
              </h3>
              <p className="text-xs text-slate-300 font-sans mb-3 leading-relaxed">
                <span className="text-[#34D399] font-mono text-[10px] font-bold uppercase tracking-wider">QUERY:</span> "Identify major infrastructure projects in Venice"
              </p>

              {/* Satellite Thumbnails */}
              <div className="flex items-center justify-between gap-2.5 mb-4">
                <div className="relative flex-1 h-20 rounded-xl overflow-hidden border border-white/10 shadow">
                  <img 
                    src="/satellite_assets/heatmap_layer_base.png?v=3" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/satellite_assets/heatmap_layer_base.jpg?v=3";
                    }}
                    alt="Optical Satellite Map"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono text-slate-200 font-semibold">
                    Optical Tile
                  </span>
                </div>

                <span className="text-[#C084FC] font-bold text-sm shrink-0">→</span>

                <div className="relative flex-1 h-20 rounded-xl overflow-hidden border border-[#8B5CF6]/40 shadow">
                  <img 
                    src="/satellite_assets/heatmap_layer_density.jpg?v=4" 
                    alt="Density Heatmap Overlay"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono text-[#C084FC] font-semibold">
                    Density Heatmap
                  </span>
                </div>
              </div>

              {/* Pipeline Chips */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-1 font-mono text-[9px] text-slate-300 mb-4">
                <div className="px-2 py-0.5 rounded-full bg-[#08090C] border border-white/10 text-center font-medium text-white">
                  Classification
                </div>
                <span className="text-[#C084FC] font-bold">→</span>
                <div className="px-2 py-0.5 rounded-full bg-[#08090C] border border-white/10 text-center font-medium text-white">
                  Model Select
                </div>
                <span className="text-[#34D399] font-bold">→</span>
                <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#10B981] text-white text-center font-bold">
                  Grounded Output
                </div>
              </div>
            </div>

            {/* Bottom CTA Indicator */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#C084FC] group-hover:text-white">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Explore Model Deep-Dive</span>
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>

          </div>

          {/* ========================================================================= */}
          {/* CARD 2: Bi-Temporal Change Detection (Time-Series Delta)                  */}
          {/* ========================================================================= */}
          <div 
            onClick={() => onSelectModel('bitemporal')}
            className="group relative flex flex-col justify-between p-6 rounded-3xl bg-[#12131C]/90 border border-white/10 hover:border-[#F43F5E] backdrop-blur-2xl transition-all duration-300 cursor-pointer shadow-[0_4px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_35px_rgba(244,63,94,0.25)] hover:-translate-y-1.5 overflow-hidden"
          >
            {/* Hover Accent Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F43F5E] to-[#F59E0B] opacity-70 group-hover:opacity-100 transition-opacity" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-[#F43F5E]/15 border border-[#F43F5E]/40 text-[10px] font-mono font-bold text-[#FDA4AF] shadow-sm">
                  MODE 02 • TIME-SERIES
                </span>
                <span className="text-[10px] font-mono text-[#FDA4AF] font-bold">
                  Automated Delta
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-[#FDA4AF] transition-colors">
                Bi-Temporal Change
              </h3>
              <p className="text-xs text-slate-300 font-sans mb-3 leading-relaxed">
                <span className="text-[#FDA4AF] font-mono text-[10px] font-bold uppercase tracking-wider">MOTIVE:</span> Detect sprawl & deforestation between satellite passes
              </p>

              {/* Satellite Thumbnails */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="relative flex-1 h-20 rounded-xl overflow-hidden border border-white/10 shadow">
                  <img 
                    src="/satellite_assets/change_before.jpg" 
                    alt="Satellite City 2021"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute top-1 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono text-slate-200 font-semibold">
                    2021 (Before)
                  </span>
                </div>

                <div className="text-[#FDA4AF] font-bold text-xs shrink-0 px-1">
                  <ArrowLeftRight className="w-4 h-4 text-[#FDA4AF]" />
                </div>

                <div className="relative flex-1 h-20 rounded-xl overflow-hidden border border-[#F43F5E]/40 shadow">
                  <img 
                    src="/satellite_assets/change_after.jpg" 
                    alt="Satellite City 2024 with Red Sprawl"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute top-1 left-1.5 px-1.5 py-0.5 rounded bg-[#08090C]/90 border border-white/10 text-[8px] font-mono text-white font-semibold">
                    2024 (After)
                  </span>
                </div>
              </div>

              {/* Delta Summary Chip */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white font-semibold mb-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F43F5E] animate-pulse" />
                  <span>Urban Sprawl (4.5 km²)</span>
                </span>
                <span className="font-mono text-[10px] text-white bg-gradient-to-r from-[#F43F5E] to-[#F59E0B] px-2.5 py-0.5 rounded-full font-bold shadow-sm">
                  Δ 98.4%
                </span>
              </div>
            </div>

            {/* Bottom CTA Indicator */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#FDA4AF] group-hover:text-white">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Explore Model Deep-Dive</span>
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>

          </div>

          {/* ========================================================================= */}
          {/* CARD 3: Optical-SAR Multimodal Fusion (All-Weather Classification)       */}
          {/* ========================================================================= */}
          <div 
            onClick={() => onSelectModel('crossmodal')}
            className="group relative flex flex-col justify-between p-6 rounded-3xl bg-[#12131C]/90 border border-white/10 hover:border-[#10B981] backdrop-blur-2xl transition-all duration-300 cursor-pointer shadow-[0_4px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_35px_rgba(16,185,129,0.25)] hover:-translate-y-1.5 overflow-hidden"
          >
            {/* Hover Accent Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10B981] via-[#8B5CF6] to-[#F43F5E] opacity-70 group-hover:opacity-100 transition-opacity" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-[10px] font-mono font-bold text-[#34D399] shadow-sm">
                  MODE 03 • RADAR FUSION
                </span>
                <span className="text-[10px] font-mono text-[#34D399] font-bold">
                  All-Weather (SAR)
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-[#34D399] transition-colors">
                Optical-SAR Fusion
              </h3>
              <p className="text-xs text-slate-300 font-sans mb-3 leading-relaxed">
                <span className="text-[#34D399] font-mono text-[10px] font-bold uppercase tracking-wider">MOTIVE:</span> Penetrate clouds & night with radar co-registration
              </p>

              {/* LULC Classified Segmentation Banner */}
              <div className="relative w-full h-20 rounded-xl overflow-hidden border border-white/10 shadow mb-4">
                <img 
                  src="/satellite_assets/lulc_segmented_map.jpg?v=4" 
                  alt="Land-Use Land-Cover Classification Map"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono text-white font-semibold">
                  LULC Thematic Multi-Class Raster
                </span>
              </div>

              {/* Classes Chip */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white font-semibold mb-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span>Joint Land-Cover Analysis</span>
                </span>
                <span className="font-mono text-[10px] text-white bg-gradient-to-r from-[#10B981] to-[#8B5CF6] px-2.5 py-0.5 rounded-full font-bold shadow-sm">
                  12 Classes
                </span>
              </div>
            </div>

            {/* Bottom CTA Indicator */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#34D399] group-hover:text-white">
              <span className="flex items-center gap-1.5">
                <Radar className="w-3.5 h-3.5" />
                <span>Explore Model Deep-Dive</span>
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
