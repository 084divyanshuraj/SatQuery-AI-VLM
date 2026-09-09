# DESIGN.md - SatQuery AI Global Design System & UI/UX Specification
**Smart India Hackathon (SIH PS-26167) — Geospatial Intelligence & Multimodal Satellite Analytics Workstation**

---

## 1. Design Vision & Aesthetic Philosophy

SatQuery AI is engineered with a **Deep Space Tactical Command & ISRO Scientific Workstation** aesthetic. It bridges complex satellite telemetry and deep learning remote sensing inference with an ultra-polished, frictionless, and intuitive visual language.

### Core Principles
1. **Aesthetic Authority**: Deep Space Navy (`#030712`, `#070e1e`), Obsidian Glass, Cyber Cyan, HUD Saffron/Amber, and Sensor Emerald.
2. **Zero Clutter, High Signal**: Every pixel conveys actionable intelligence. Monospaced numerals for geographic coordinates, spectral bands, and telemetry metrics.
3. **Locked-Viewport Ergonomics**: Zero outer page scrolling in the workstation; locked `100vh` 3-pane layout with independent panel scroll zones (`overflow-y-auto`).
4. **Tactical Precision**: Saffron target reticles, corner bracket crosshairs, pulsing telemetry badges, and scanline grid overlays.
5. **No Default Browser Elements**: Never use default browser alerts, standard dropdowns, or white modals. Everything uses high-tech HUD cards and custom micro-interactions.

---

## 2. Complete Design Tokens

### 2.1 Color Palette

```css
:root {
  /* Surface & Background Hierarchy */
  --bg-space-void: #020617;          /* Tailwind: slate-950 (Deepest Void) */
  --bg-space-navy: #070e1e;          /* Tailored Space Navy Command */
  --bg-space-surface: #0f172a;       /* Tailwind: slate-900 (Panel Background) */
  --bg-space-card: rgba(15, 23, 42, 0.75); /* Frosted HUD Glass */
  --bg-space-glass: rgba(8, 14, 30, 0.65); /* Specular Glass Tint */

  /* Borders & Specular Grid */
  --border-subtle: rgba(51, 65, 85, 0.6);   /* Tailwind: slate-700/60 */
  --border-active: rgba(16, 185, 129, 0.5); /* Emerald Active State */
  --border-saffron: rgba(245, 158, 11, 0.8); /* Amber Saffron Grounding */
  --border-cyan: rgba(56, 189, 248, 0.5);   /* Cyber Cyan Specular */

  /* Functional Accents */
  --accent-emerald: #10b981;  /* Model Confidence & Primary Action */
  --accent-saffron: #f59e0b;  /* Grounding Bounding Box & Active Target */
  --accent-cyan: #38bdf8;     /* Sensor Modality & Spectral Indices */
  --accent-rose: #f43f5e;     /* Critical Inundation & Alert Cards */
  --accent-purple: #a855f7;   /* BigEarthNet Cross-Modal Latent Vectors */

  /* Typography Colors */
  --text-primary: #f8fafc;    /* Crisp White (Headings & Primary Data) */
  --text-secondary: #cbd5e1;  /* High-legibility Slate 300 (Body) */
  --text-muted: #64748b;      /* Slate 500 (Labels, Keys, Timestamp) */
  --text-emerald: #34d399;    /* Positive Deltas & Validation Passes */
  --text-saffron: #fbbf24;    /* Critical Warning & Grounding Markers */
}
```

### 2.2 Elevation, Shadows & Atmospheric Glows

```css
/* Atmospheric Glows */
--glow-emerald: 0 0 25px rgba(16, 185, 129, 0.35);
--glow-saffron: 0 0 20px rgba(245, 158, 11, 0.40);
--glow-cyan: 0 0 20px rgba(56, 189, 248, 0.30);
--glow-card: 0 8px 32px 0 rgba(0, 0, 0, 0.55);

/* Glassmorphism Specification */
.glass-panel {
  background: rgba(15, 23, 42, 0.70);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(51, 65, 85, 0.6);
}
```

---

## 3. Typography System & Number Formatting

| Role | Font Family | Usage | Fallback |
|---|---|---|---|
| **Display & Titles** | `Space Grotesk`, `Orbitron` | App Headers, Mode Titles, Big Statistics | `sans-serif` |
| **Monospaced Telemetry** | `JetBrains Mono`, `Fira Code` | Coordinates, Metadata, Logs, Tabular Numbers | `monospace` |
| **Body & Explanations** | `Inter`, `system-ui` | Natural language answers, analysis text | `sans-serif` |

### Critical Numerical Rule: `tabular-nums`
All floating-point percentages, lat/long GPS coordinates, timestamps, and model loss curves MUST use:
```css
font-variant-numeric: tabular-nums;
```
This ensures zero layout shifts or jitter when streaming real-time PyTorch epoch counters or WebSocket packets.

---

## 4. Workstation Architecture: 3-Pane Locked Viewport

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP ENGINEERING STATUS BAR (H-12): Logo | Mission PS-26167 | Mode Status | WS Telemetry │
├────────────────────────┬───────────────────────────────┬───────────────────────────────┤
│ PANEL A (25% Width)    │ PANEL B (50% Width)           │ PANEL C (25% Width)           │
│ Data Ingestion & Setup │ Interactive Map / Benchmarks  │ Agentic Analyst Portal        │
├────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ • Workflow Registry    │ • Live Georeferenced Canvas   │ • Natural Language Query      │
│   (Single, Bi-Temp,    │ • Multi-Bounding Saffron      │ • Orchestrate Button          │
│    Cross-Modal, Bench) │   Grounding Reticles          │ • Real-time Stepper Trace     │
│ • GeoTIFF Ingestion    │ • CRS Viewport Badges         │ • Evidence Outbox (98.4%)     │
│ • Pre-Flight Shield    │ • Space-Navy Accuracy Gains   │ • Critical Flood Report Card  │
│ • Geospatial Metadata  │   Domain Adaptation Chart     │ • Export Executive PDF        │
│ • ISRO Secure Env      │ • Sub-pixel Coordinate Grid   │   Report Button               │
└────────────────────────┴───────────────────────────────┴───────────────────────────────┘
```

### 4.1 Panel Specifications

#### Panel A: Data Ingestion & Control (25% Width, min 280px, max 340px)
- **Workflow Registry Tabs**: High-contrast operational mode selector with active emerald/amber left accents.
- **GeoTIFF Dragzone**: Dashed slate border with active hover cyan-glow. Accepts georeferenced `.tif`/`.tiff` files.
- **1-Click Preset Loader**: `LOAD SAMPLE SENTINEL-2 TILE` button with instant offline loading.
- **Pre-Flight Compatibility Shield**:
  - Validates CRS alignment (`EPSG:32643`), resolution scale ratio (`1:1`), and spatial intersection overlap (`98.4%`).
  - Displays HUD badge: `[PRE-FLIGHT OK] CO-REGISTERED PAIR CALIBRATED`.
- **Monospaced Metadata Card**: Structured table with `File`, `Size (MB)`, `Resolution`, `CRS`, `Bands`, `Dimensions`.

#### Panel B: Interactive GIS Canvas / Benchmarks Viewport (50% Flex-1)
- **Canvas Container**: Deep space frame with 2px corner specular highlights and subtle inner shadow.
- **Multi-Bounding Saffron Grounding Reticles**:
  - Border: `2px solid #f59e0b` (Amber-500)
  - Background fill: `rgba(245, 158, 11, 0.15)`
  - Corner Reticles: 4 corner brackets (`w-2 h-2 border-t-2 border-l-2 border-amber-300`)
  - Target Badge: Top-pinned uppercase badge `FLOOD BREACH #01 (98.7%)` with crosshair icon.
- **Dynamic Performance & Benchmarks Chart**:
  - When the benchmark tab is active, smoothly renders `metrics_comparison.png`.
  - Displays domain adaptation accuracy gains across BigEarthNet, RSVQA, VRSBench, and CDVQA.

#### Panel C: Agentic Analyst Portal & Audit Console (25% Width, min 280px, max 340px)
- **Natural Language Input**: Monospaced dark slate textarea with emerald focus halo.
- **Action Trigger**: Full-width high-contrast button `Orchestrate Specialist Models` with pulsing hover glow.
- **Live Thought Trace Terminal**: Monospaced terminal window with sequential step badges (`[01]` to `[05]`), auto-scroll anchor, and dark scrollbar.
- **Evidence Outbox**: Glass card with quantitative confidence meter (`CONFIDENCE: 98.4%`), model tag, and latency (`0.14s`).
- **Grounding Alert Card (Matches `for_res.png`)**:
  - Left border: 4px solid `#f43f5e` (Rose-500).
  - Status badge: `CRITICAL ALERT` with pulsing red dot.
  - Telemetry grid: `GROUNDING CONFIDENCE`, `EXTENT / IMPACT AREA` (`1,420.5 ha`), `MISSION ID` (`ISRO-SAC-26167`), `TIME UTC`.
- **Export Executive PDF Report**: Bottom pinned amber-accented action button with ReportLab PDF compilation icon.

---

## 5. Remote Sensing Formulas & Spectral Algebra Tokens

SatQuery AI's mathematical engine executes genuine spectral band algebra defined below:

### 5.1 Normalized Difference Vegetation Index (NDVI)
$$\text{NDVI} = \frac{\text{NIR (Band 8)} - \text{Red (Band 4)}}{\text{NIR (Band 8)} + \text{Red (Band 4)}}$$
- **Thresholds**:
  - $\text{NDVI} \ge 0.65$: Dense, healthy agricultural canopy (Winter Wheat).
  - $0.20 \le \text{NDVI} < 0.65$: Sparse vegetation / shrubland.
  - $\text{NDVI} < 0.00$: Water bodies and aquatic reservoirs.

### 5.2 Normalized Difference Water Index (NDWI)
$$\text{NDWI} = \frac{\text{Green (Band 3)} - \text{NIR (Band 8)}}{\text{Green (Band 3)} + \text{NIR (Band 8)}}$$
- **Thresholds**: $\text{NDWI} > 0.00$ indicates open water surfaces and inundation zones.

### 5.3 Synthetic Aperture Radar (SAR) Water Backscatter Threshold
$$\sigma^0_{VV} < -14.8\text{ dB}$$
- Specular reflection of radar waves off open water surfaces yields low backscatter, allowing cloud-penetrating water extraction even under 100% monsoon cloud cover.

### 5.4 Cross-Modal Alignment Loss (PyTorch Domain Adaptation)
$$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{contrastive}}(\mathbf{z}_{\text{opt}}, \mathbf{z}_{\text{text}}) + \mathcal{L}_{\text{contrastive}}(\mathbf{z}_{\text{sar}}, \mathbf{z}_{\text{text}}) + \mathcal{L}_{\text{contrastive}}(\mathbf{z}_{\text{opt}}, \mathbf{z}_{\text{sar}})$$

---

## 6. Micro-Interactions & Visual States

| State | Visual Behavior | Tailwind / CSS Spec |
|---|---|---|
| **Hover on Action Buttons** | Scale up + Specular Border Glow | `hover:scale-[1.01] hover:border-emerald-500/50 shadow-glow-emerald transition-all duration-200` |
| **WebSocket Processing** | Continuous spinner + status pulse | `animate-spin text-emerald-400`, `animate-pulse bg-emerald-500` |
| **Grounding Box Entry** | Smooth fade-in with corner reticle flash | `animate-fadeIn transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]` |
| **Thought Trace Log Append** | Auto-scroll to bottom ref | `logEndRef.current.scrollIntoView({ behavior: 'smooth' })` |
| **Critical Alert Card** | 4px rose accent border + soft red background glow | `border-l-4 border-rose-500 bg-slate-950/90 shadow-lg` |

---

## 7. Compliance Checklist for Engineers

- [x] **Zero Layout Bleed**: The entire workstation viewport is locked at `100vh` (`overflow-hidden`).
- [x] **No External CDN Dependencies**: Fonts, icons, and assets run 100% offline from local bundles.
- [x] **Tabular Numerals**: All telemetry, loss stats, and bounds coordinates use `tabular-nums`.
- [x] **Responsive Scaling**: Clean containment on 1080p, 1440p, and laptop display viewports.
- [x] **Print-Ready PDF Compatibility**: Color scheme and telemetry layout map 1-to-1 to ReportLab PDF export schemas.
