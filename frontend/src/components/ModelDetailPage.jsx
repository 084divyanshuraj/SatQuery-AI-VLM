import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Eye, 
  Radar, 
  CheckCircle2, 
  Zap, 
  Database, 
  Globe2, 
  Compass, 
  Terminal, 
  Search, 
  ArrowLeftRight,
  Maximize2
} from 'lucide-react';

const MODEL_DATA = {
  vqa: {
    id: 'vqa',
    modeBadge: 'MODE 01 • VISUAL QUESTION ANSWERING',
    codeName: 'SatVLM-7B Geospatial VLM',
    version: 'v2.6.4 (TensorRT In-Orbit)',
    tagline: 'Natural Language Satellite Querying with Agentic Spatial Grounding',
    accentColor: 'cyan',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    borderColor: 'border-cyan-500/40',
    glowColor: 'shadow-[0_0_35px_rgba(6,182,212,0.3)]',
    
    // Mission & Vision
    mission: 'Empower civilian analysts, disaster command, and defense intelligence to query petabyte-scale satellite imagery using conversational natural language without requiring deep GIS expertise.',
    vision: 'Bridge sovereign aerospace sensor data with vision-language foundational models, providing instantaneous semantic object localization, density heatmaps, and zero-shot reasoning for the ISRO ecosystem.',
    
    // What it does
    capabilities: [
      { title: 'Zero-Shot Infrastructure Detection', desc: 'Identifies ports, bridges, runways, and urban corridors from high-res optical tiles.' },
      { title: 'Agentic Heatmap Generation', desc: 'Produces calibrated pixel density masks highlighting exact spatial distributions.' },
      { title: 'Spectral Band Ingestion', desc: 'Accepts RGB, NIR (Band 8), and RedEdge bands for multi-spectral context reasoning.' },
      { title: 'Sub-second Latency', desc: 'Accelerated via TensorRT with an average response time of under 380ms per query.' }
    ],
    
    specs: {
      sensors: 'Sentinel-2 (MSI), Cartosat-2/3, Landsat-9 OLI-2',
      groundResolution: '10m - 0.5m GSD',
      outputType: 'Grounded Bounding Boxes, Density GeoTIFF, Structured JSON Telemetry',
      quantization: 'FP16 / INT8 TensorRT Engine'
    },

    // How it works (Step-by-Step Architecture)
    pipelineSteps: [
      { step: '01', name: 'Optical Tile Ingestion', desc: 'Raw satellite scene orthorectified and clipped to the requested AOI bounding box with top-of-atmosphere atmospheric reflectance correction.' },
      { step: '02', name: 'Vision-Language Tokenization', desc: 'Natural language query embedded with specialized Geospatial Tokenizer and aligned with multi-scale Vision Transformer (ViT-H/14) patch embeddings.' },
      { step: '03', name: 'Spatial Cross-Attention Core', desc: 'Cross-attention layers correlate textual queries with geographic features, isolating infrastructure clusters from background natural terrain.' },
      { step: '04', name: 'Grounded Mask & Telemetry Output', desc: 'Generates bounding coordinates, object density heatmaps, and confidence scores rendered onto the GIS workstation viewport.' }
    ],

    // Interactive Demo Visuals
    sampleQuery: 'Identify major maritime infrastructure and transport waterways in Venice lagoon.',
    opticalImage: '/satellite_assets/heatmap_layer_base.png',
    resultImage: '/satellite_assets/heatmap_layer_density.jpg',
    resultLabel: 'Grounded Object Density Heatmap Overlay',
    sampleOutputMetrics: [
      { label: 'Identified Objects', value: '42 Marine Structures' },
      { label: 'Ground Confidence', value: '96.8%' },
      { label: 'Inference Latency', value: '342 ms' }
    ]
  },

  bitemporal: {
    id: 'bitemporal',
    modeBadge: 'MODE 02 • TIME-SERIES CHANGE DETECTION',
    codeName: 'TemporalDelta-Net',
    version: 'v3.1.0 (Siamese-UNet++',
    tagline: 'Automated Multi-Pass Delta Segmentation & Deforestation Tracking',
    accentColor: 'emerald',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    borderColor: 'border-emerald-500/40',
    glowColor: 'shadow-[0_0_35px_rgba(16,185,129,0.3)]',
    
    // Mission & Vision
    mission: 'Automate the detection of rapid environmental shifts, illegal deforestation, unauthorized border encroachments, and urban sprawl across chronological satellite revisit intervals.',
    vision: 'Provide sovereign planetary monitoring that instantly detects landscape alterations between chronological passes without requiring manual visual inspection by human photo-interpreters.',
    
    // What it does
    capabilities: [
      { title: 'Pixel-Level Binary & Semantic Delta', desc: 'Calculates structural differences while ignoring seasonal cloud and sun-angle variations.' },
      { title: 'Hectare & Area Quantization', desc: 'Computes exact square kilometer displacement and sprawl area metrics automatically.' },
      { title: 'Revisit Invariance', desc: 'Co-registers multi-angle acquisitions to prevent false positives from parallax distortions.' },
      { title: 'Ecological Health Indices', desc: 'Integrates NDVI vegetation health assessment with change heatmaps.' }
    ],
    
    specs: {
      sensors: 'Sentinel-2 (T1 & T2 passes), Landsat Chronological Archive',
      groundResolution: '10m GSD Native',
      outputType: 'Binary Change Mask, Sprawl Polygon Vector, Area Delta Summary (km²)',
      quantization: 'FP16 PyTorch / ONNX Runtime'
    },

    // How it works
    pipelineSteps: [
      { step: '01', name: 'Bi-Temporal Co-Registration', desc: 'Historical image (T1) and recent acquisition (T2) are aligned to sub-pixel accuracy using Phase Correlation and feature keypoint matching.' },
      { step: '02', name: 'Siamese Spectral Encoding', desc: 'Identical weight-shared convolutional encoders extract deep hierarchical feature maps from both timestamps independently.' },
      { step: '03', name: 'Differential Attention Fusion', desc: 'Cross-temporal attention modules compare feature vectors at each spatial location to detect genuine structural land-use changes.' },
      { step: '04', name: 'Area Metric & Vector Export', desc: 'A decoder network outputs binary change segmentation with red anomaly highlights and geometric polygon coordinates for GIS export.' }
    ],

    // Interactive Demo Visuals
    sampleQuery: 'Detect urban sprawl and new construction development between 2021 and 2024 passes.',
    opticalImage: '/satellite_assets/change_before.jpg',
    resultImage: '/satellite_assets/change_after.jpg',
    resultLabel: '2024 Classified Pass with Red Urban Sprawl Highlight',
    sampleOutputMetrics: [
      { label: 'Detected Sprawl Area', value: '4.52 km²' },
      { label: 'Delta Confidence', value: '98.4%' },
      { label: 'Processing Speed', value: '280 ms / km²' }
    ]
  },

  crossmodal: {
    id: 'crossmodal',
    modeBadge: 'MODE 03 • OPTICAL-SAR MULTIMODAL FUSION',
    codeName: 'SAR-OpticFusion-v2',
    version: 'v2.8.1 (Radar-Optical Co-Register)',
    tagline: 'All-Weather Cloud-Penetrating Classification & 12-Class LULC Mapping',
    accentColor: 'amber',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    borderColor: 'border-amber-500/40',
    glowColor: 'shadow-[0_0_35px_rgba(245,158,11,0.3)]',
    
    // Mission & Vision
    mission: 'Overcome persistent monsoon cloud cover and nocturnal blindness in tropical regions by fusing Synthetic Aperture Radar (SAR) with high-resolution optical imagery.',
    vision: 'Achieve uninterrupted 24/7 geospatial situational awareness by combining the surface roughness and dielectric sensitivity of Sentinel-1 radar with the spectral richness of Sentinel-2 optical data.',
    
    // What it does
    capabilities: [
      { title: 'Cloud & Fog Penetration', desc: 'Uses Synthetic Aperture Radar C-band microwaves to see through thick cloud cover and rainfall.' },
      { title: '12-Class Thematic LULC Raster', desc: 'Simultaneously classifies dense forest, water bodies, agriculture, barren land, and urban density.' },
      { title: 'Dual-Polarization Ingestion', desc: 'Fuses VV (vertical) and VH (cross-polarization) radar backscatter for structural fidelity.' },
      { title: 'Day & Night Operations', desc: 'Maintains tactical mapping readiness regardless of solar illumination conditions.' }
    ],
    
    specs: {
      sensors: 'Sentinel-1 C-Band SAR (GRD) + Sentinel-2 Multi-Spectral (RGB+NIR)',
      groundResolution: '10m GSD Joint Co-registered',
      outputType: '12-Class Thematic GeoTIFF, Radar Backscatter Map, Confidence Surface',
      quantization: 'FP16 PyTorch / TensorRT'
    },

    // How it works
    pipelineSteps: [
      { step: '01', name: 'SAR Range-Doppler Calibration', desc: 'Sentinel-1 radar backscatter is calibrated (sigma nought), speckle-filtered with Lee filter, and terrain-corrected using Copernicus DEM.' },
      { step: '02', name: 'Multi-Modal Co-Registration', desc: 'Optical RGB bands and SAR VV/VH polarization channels are projected onto a shared geospatial grid at 10m Ground Sampling Distance.' },
      { step: '03', name: 'Cross-Modal Attention Transformer', desc: 'Attention layers weight optical spectral signatures where clear, and seamlessly fall back to SAR structural texture where clouds obscure ground.' },
      { step: '04', name: 'Thematic LULC Segmentation', desc: 'Generates a 12-class discrete land-use land-cover raster showing water, dense forest, wetlands, and built-up areas.' }
    ],

    // Interactive Demo Visuals
    sampleQuery: 'Perform all-weather land-use classification over cloud-covered delta terrain.',
    opticalImage: '/sample_sentinel2.png',
    resultImage: '/satellite_assets/lulc_segmented_map.jpg',
    resultLabel: 'Fused 12-Class Thematic LULC Classification Map',
    sampleOutputMetrics: [
      { label: 'Cloud Penetration', value: '100% (Radar Assisted)' },
      { label: 'LULC Classes', value: '12 Discrete Classes' },
      { label: 'Overall Accuracy', value: '94.2% F1-Score' }
    ]
  }
};

export default function ModelDetailPage({ modelId = 'vqa', onBack, onLaunchInWorkstation }) {
  const model = MODEL_DATA[modelId] || MODEL_DATA.vqa;
  const [activeTab, setActiveTab] = useState('pipeline');
  const [isComparing, setIsComparing] = useState(false);

  return (
    <div className="min-h-screen bg-[#08090C] text-white font-sans selection:bg-[#8B5CF6]/30 selection:text-white">
      
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-[#12131C]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#08090C] hover:bg-[#1A1B26] border border-white/10 hover:border-[#8B5CF6] text-xs font-semibold text-white transition-all cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#C084FC]" />
            <span>Back to Models Showcase</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onLaunchInWorkstation(model.id)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F43F5E] hover:opacity-95 text-white font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] cursor-pointer"
            >
              <span>Launch in Workstation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        
        {/* Model Hero Banner */}
        <div className="relative rounded-3xl p-6 sm:p-10 bg-[#12131C]/90 border border-white/10 backdrop-blur-2xl overflow-hidden mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full border border-[#8B5CF6]/40 bg-[#08090C] text-xs font-mono font-bold text-[#C084FC]">
                {model.modeBadge}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#08090C] border border-white/10 text-xs font-mono text-slate-300">
                {model.version}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
              {model.codeName}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-6">
              {model.tagline}
            </p>

            {/* Quick Specs Pill Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#08090C] border border-white/10">
                <span className="text-slate-400 block mb-1 text-[10px] uppercase">Native Sensors</span>
                <span className="text-white font-semibold">{model.specs.sensors}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#08090C] border border-white/10">
                <span className="text-slate-400 block mb-1 text-[10px] uppercase">Ground Resolution</span>
                <span className="text-[#34D399] font-semibold">{model.specs.groundResolution}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#08090C] border border-white/10">
                <span className="text-slate-400 block mb-1 text-[10px] uppercase">Engine Quantization</span>
                <span className="text-white font-semibold">{model.specs.quantization}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#08090C] border border-white/10">
                <span className="text-slate-400 block mb-1 text-[10px] uppercase">Output Raster</span>
                <span className="text-[#F43F5E] font-semibold truncate block" title={model.specs.outputType}>{model.specs.outputType}</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2-Column Section: Mission & Vision + Core Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Mission & Vision Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#12131C]/90 border border-white/10 shadow-xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08090C] border border-[#8B5CF6]/40 text-xs font-mono text-[#C084FC] font-bold mb-4">
                <Compass className="w-3.5 h-3.5 text-[#C084FC]" />
                <span>MISSION & VISION • EARTH OBSERVATION AI</span>
              </div>

              <h2 className="text-2xl font-extrabold text-white mb-4">
                Strategic Geospatial Purpose
              </h2>

              <div className="space-y-4 text-sm text-slate-200 leading-relaxed font-sans">
                <div className="p-4 rounded-2xl bg-[#08090C] border border-white/10">
                  <h3 className="text-xs font-mono font-bold text-[#C084FC] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                    <span>The Mission</span>
                  </h3>
                  <p>{model.mission}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#08090C] border border-white/10">
                  <h3 className="text-xs font-mono font-bold text-[#FDA4AF] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F43F5E]" />
                    <span>The Vision</span>
                  </h3>
                  <p>{model.vision}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
              Designed for Space Applications Centre (SAC-ISRO) High-Throughput Pipelines.
            </div>
          </div>

          {/* Capabilities ("Kya Karta Hai") */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#12131C]/90 border border-white/10 backdrop-blur-xl shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08090C] border border-[#10B981]/40 text-xs font-mono text-[#34D399] font-bold mb-4">
              <Zap className="w-3.5 h-3.5 text-[#34D399]" />
              <span>CORE CAPABILITIES & FEATURES</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-4">
              What This Model Does
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {model.capabilities.map((cap, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#08090C] border border-white/10 hover:border-[#10B981] transition-all">
                  <div className="flex items-center gap-2 text-[#34D399] font-bold text-xs font-mono mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>{cap.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {cap.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-[#08090C] border border-white/10 text-xs text-slate-300 font-mono flex items-center justify-between">
              <span>Sensor Fusion Ready: Multi-Spectral + InSAR</span>
              <span className="font-bold text-[#34D399]">100% Automated</span>
            </div>
          </div>

        </div>

        {/* Step-by-Step Architecture Pipeline ("Kaise Karta Hai") */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#12131C]/90 border border-white/10 backdrop-blur-xl shadow-2xl mb-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08090C] border border-[#8B5CF6]/40 text-xs font-mono text-[#C084FC] font-bold mb-3">
              <Cpu className="w-3.5 h-3.5 text-[#C084FC]" />
              <span>END-TO-END TECHNICAL ARCHITECTURE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How the Deep-Learning Pipeline Operates
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              From raw telemetry ingestion to calibrated spatial raster masks in 4 streamlined stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {model.pipelineSteps.map((step, idx) => (
              <div 
                key={idx}
                className="relative p-5 rounded-2xl bg-[#08090C] border border-white/10 hover:border-[#8B5CF6] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-black text-[#C084FC] bg-[#12131C] px-2 py-0.5 rounded-lg border border-white/10">
                      STAGE {step.step}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-[#8B5CF6] transition-colors" />
                  </div>

                  <h3 className="font-bold text-sm text-white mb-2 group-hover:text-[#34D399] transition-colors">
                    {step.name}
                  </h3>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Latency: ~70ms</span>
                  <span className="text-[#34D399]">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real Example Visual Showcase */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#12131C]/90 border border-white/10 backdrop-blur-xl shadow-2xl mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08090C] border border-[#F43F5E]/40 text-xs font-mono text-[#FDA4AF] font-bold mb-2">
                <Layers className="w-3.5 h-3.5 text-[#F43F5E]" />
                <span>INFERENCE DEMONSTRATION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Real Satellite Visual Output Showcase
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Actual inference results computed over benchmark datasets.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#08090C] border border-white/10 text-xs font-mono text-slate-300 max-w-md">
              <span className="text-[#C084FC] font-bold block mb-1">PROMPT / QUERY TRACE:</span>
              <p className="italic font-sans text-white">"{model.sampleQuery}"</p>
            </div>
          </div>

          {/* Interactive Dual Image Comparison Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Input Satellite Tile */}
            <div className="flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#08090C] shadow-lg">
              <div className="px-4 py-2.5 bg-[#12131C] border-b border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold">INPUT SATELLITE TILE (RAW SPECTRAL)</span>
                <span className="text-slate-400 text-[10px]">Sentinel-2 MSI 10m</span>
              </div>
              <div className="relative h-64 sm:h-80 w-full bg-[#08090C] overflow-hidden group">
                <img 
                  src={model.opticalImage} 
                  alt="Raw Satellite Input Tile" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/80 text-[10px] font-mono text-slate-300">
                  Native Surface Reflectance
                </span>
              </div>
            </div>

            {/* AI Grounded / Segmented Output */}
            <div className="flex flex-col rounded-2xl overflow-hidden border border-[#8B5CF6]/40 bg-[#08090C] shadow-lg">
              <div className="px-4 py-2.5 bg-[#12131C] border-b border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-[#FDA4AF] font-bold">{model.resultLabel.toUpperCase()}</span>
                <span className="text-[#34D399] text-[10px] font-bold">AI INFERRED</span>
              </div>
              <div className="relative h-64 sm:h-80 w-full bg-[#08090C] overflow-hidden group">
                <img 
                  src={model.resultImage} 
                  alt="AI Grounded Result Tile" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-[#12131C]/90 border border-[#8B5CF6]/50 text-[10px] font-mono text-[#C084FC] font-bold">
                  {model.resultLabel}
                </span>
              </div>
            </div>

          </div>

          {/* Model Metrics Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
            {model.sampleOutputMetrics.map((met, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#08090C] border border-white/10 text-center">
                <span className="text-xs text-slate-400 block mb-1 font-mono uppercase">{met.label}</span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono">{met.value}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Call to Action: Launch Workstation with Aurora Linear Gradient */}
        <div className="text-center p-10 rounded-3xl bg-[#12131C]/90 border border-white/10 backdrop-blur-xl shadow-2xl mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Ready to test {model.codeName} on live imagery?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6 font-sans">
            Launch directly into the high-throughput geospatial workstation with pre-loaded coordinates and interactive AI chat inference.
          </p>

          <button
            onClick={() => onLaunchInWorkstation(model.id)}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F43F5E] hover:opacity-95 text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(139,92,246,0.45)] hover:shadow-[0_0_45px_rgba(139,92,246,0.7)] hover:scale-105 cursor-pointer"
          >
            <span>Launch {model.codeName} in Workstation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>

    </div>
  );
}
