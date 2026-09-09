# 🛰️ SatQuery AI - Dataset & Model Checkpoint Replacement Guide
**Problem Statement ID: SIH PS-26167**

This directory houses the raw sample dataset used for testing the Multi-Modal Optical-SAR pipeline while your teammate completes model training.

---

## 📂 Current Structure (Raw Sample Dataset)
```
backend/
├── BigEarthNet.txt               # Manifest index mapping Optical | SAR | Text
├── data/
│   ├── sample_pairs/
│   │   ├── S2A_MSIL2A_sample.tif # Sentinel-2 Optical Multi-Spectral GeoTIFF (EPSG:32643)
│   │   └── S1A_IW_GRDH_sample.tif # Sentinel-1 SAR Dual-Pol GeoTIFF (EPSG:32643)
│   └── checkpoints/              # (Drop final trained PyTorch weights here)
```

---

## 🔄 How to Replace with Real Trained Data & Models

### Step 1: Replace Imagery Files
Jab aapke teammate ka Sentinel-1 aur Sentinel-2 dataset ready ho jaye:
1. Apni real `.tif` images ko `backend/data/sample_pairs/` me copy karein.
2. `backend/BigEarthNet.txt` me filenames update karein:
   ```text
   backend/data/sample_pairs/YOUR_REAL_S2.tif|backend/data/sample_pairs/YOUR_REAL_S1.tif|class description or ground truth label
   ```

### Step 2: Drop Trained Model Checkpoints
1. Place the saved PyTorch weights file (e.g., `satquery_optical_sar_best.pt`) in `backend/data/checkpoints/`.
2. In `backend/bigearthnet_finetuning_pipeline.py`:
   Update the checkpoint path:
   ```python
   CHECKPOINT_PATH = "backend/data/checkpoints/satquery_optical_sar_best.pt"
   ```

---

## ⚡ Current Fallback & Compatibility
- Both `bigearthnet_finetuning_pipeline.py` and `controller.py` will read the sample GeoTIFF files smoothly.
- System includes native NumPy/Rasterio auto-detection so it will not crash even without GPU.
