# AGENTS.md - Code Generation & Engineering Instructions

## 1. Project Mission & Context
SIH2K26 is an AI-powered Geospatial Intelligence and Satellite Analytics workstation engineered for high-throughput spectral inference, Land-Use Land-Cover (LULC) segmentation, NDVI vegetation health assessment, and change detection.

---

## 2. Frontend Development Guidelines (React + Vite + TailwindCSS)
- **Component Isolation**: Keep GIS map controls, Hero cinematic viewport, and AI terminal decoupled.
- **State Management**: Manage AOI coordinates, active spectral bands, and AI inference state via unified React context / state coordinators.
- **Styling Contract**:
  - Always use design tokens specified in [DESIGN.md](file:///c:/Users/sarra/OneDrive/Desktop/SIH2K26_167/DESIGN.md).
  - Use Tailwind arbitrary values only when mapped to CSS custom properties.
  - Never use plain browser default scrollbars or plain alert modals; use high-tech HUD cards.
- **Map & Canvas Integrity**: Center GIS map viewport on coordinate changes and maintain clean vector overlays without memory leaks.

---

## 3. Backend Development Guidelines (FastAPI + Python)
- **FastAPI Routing**: Separate endpoints into modular routers (`/api/health`, `/api/analyze`, `/api/models`, `/api/presets`).
- **Data Schemas**: Define strict `pydantic` schemas for requests and responses (AOI bounding boxes, confidence thresholds, classification results).
- **Graceful Geospatial Fallback**: Implement native NumPy/Pillow raster fallback algorithms when external heavy GDAL/Rasterio C-bindings are in mock/sandbox mode.

---

## 4. Multi-Agent & Code Quality Directives
- Ensure all frontend interactive elements possess descriptive `data-testid` or `id` attributes.
- Avoid duplicate layout wraps or conflicting global scroll containers.
- Maintain fast build times and zero-warning TypeScript / JSX compilation.
