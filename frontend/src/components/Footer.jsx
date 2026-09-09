import React from 'react';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Shield, 
  ExternalLink, 
  Globe, 
  Cpu, 
  Layers, 
  ArrowUp,
  Sparkles,
  Radio
} from 'lucide-react';

export default function Footer({ onSelectModel, onScrollToTop }) {
  const scrollToTop = () => {
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative w-full bg-[#08090C] border-t border-white/10 text-slate-300 font-sans overflow-hidden">
      
      {/* Ambient Top Highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/60 via-[#EC4899]/60 via-[#10B981]/60 to-transparent" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 pb-6 border-b border-white/10">
          
          {/* Column 1: Brand & Mission (Col 1-4) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#12131C] border border-[#8B5CF6]/60 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <img 
                  src="/satquery_logo.png" 
                  alt="SatQuery AI Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg tracking-tight text-white">SatQuery</span>
                <span className="font-mono font-black text-lg bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#10B981] bg-clip-text text-transparent">AI</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans pr-4">
              Sovereign Multi-Modal Geospatial Foundation AI platform for high-throughput spectral inference, automated LULC segmentation, and all-weather radar co-registration.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12131C] border border-[#10B981]/40 text-[10px] font-mono text-[#10B981]">
              <Radio className="w-3 h-3 text-[#10B981] animate-pulse" />
              <span>ISRO • SAC AHMEDABAD PROTOCOL ACTIVE</span>
            </div>
          </div>

          {/* Column 2: Platform Models (Col 5-6) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Foundation Models
            </h4>
            <ul className="space-y-1.5 text-xs font-sans">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectModel && onSelectModel('vqa')}
                  className="text-slate-300 hover:text-[#10B981] transition-colors cursor-pointer text-left"
                >
                  Single-Image VQA
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectModel && onSelectModel('bitemporal')}
                  className="text-slate-300 hover:text-[#F43F5E] transition-colors cursor-pointer text-left"
                >
                  Bi-Temporal Change
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectModel && onSelectModel('crossmodal')}
                  className="text-slate-300 hover:text-[#8B5CF6] transition-colors cursor-pointer text-left"
                >
                  Optical-SAR Fusion
                </button>
              </li>
              <li>
                <span className="text-slate-400">NDVI Vegetation Health</span>
              </li>
              <li>
                <span className="text-slate-400">12-Class Thematic LULC</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Documentation & Links (Col 7-8) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Resources & Protocols
            </h4>
            <ul className="space-y-1.5 text-xs font-sans text-slate-300">
              <li className="flex items-center gap-1.5 hover:text-[#10B981] transition-colors cursor-pointer">
                <span>Earth Observation Technical Specs</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#10B981] transition-colors cursor-pointer">
                <span>Sentinel-1/2 Preprocessing Pipeline</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#10B981] transition-colors cursor-pointer">
                <span>TensorRT Inference Engine Specs</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#10B981] transition-colors cursor-pointer">
                <span>FastAPI Geospatial REST Endpoints</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#10B981] transition-colors cursor-pointer">
                <span>Bhuvan & Copernicus Data Governance</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Headquarters (Col 9-12) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Contact & Headquarters
            </h4>

            <div className="space-y-2 text-xs text-slate-300 font-sans">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                <span>
                  Space Applications Centre (SAC), ISRO<br />
                  Jodhpur Tekra, Ambawadi Vistar P.O.,<br />
                  Ahmedabad, Gujarat – 380015, India
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#10B981] shrink-0" />
                <a 
                  href="mailto:support@satquery.isro.gov.in" 
                  className="hover:text-[#10B981] transition-colors text-white"
                >
                  support@satquery.isro.gov.in
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F43F5E] shrink-0" />
                <span>+91 (079) 2691-0101 / Ext. 26167</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright + Telemetry Status */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          
          {/* Copyright notice */}
          <div className="text-center sm:text-left">
            <p>© 2026 <strong className="text-white font-semibold">SatQuery AI</strong>. Sovereign Multi-Modal Geospatial Intelligence. All Rights Reserved.</p>
          </div>

          {/* Telemetry pill and Back to Top button */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12131C] border border-[#10B981]/50 text-[10px] text-[#10B981]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>ORBITAL TELEMETRY 100% NOMINAL</span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-full bg-[#12131C] hover:bg-[#1A1B26] border border-white/10 hover:border-[#8B5CF6] text-white transition-all cursor-pointer group"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-[#8B5CF6]" />
            </button>
          </div>

        </div>

      </div>

    </footer>
  );
}
