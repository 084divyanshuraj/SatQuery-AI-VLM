# 🛰️ SatQuery AI

### An Interactive Vision-Language Assistant for Multimodal Remote Sensing Image Analysis through Text Queries

> **Smart India Hackathon 2026 | Problem Statement: PS 26167 | ISRO | Space Technology**

[![SIH 2026](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-blue)](#)
[![Organization](https://img.shields.io/badge/Organization-ISRO-orange)](#)
[![Theme](https://img.shields.io/badge/Theme-Space%20Technology-purple)](#)
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)](#)

---

## 🌍 Overview

**SatQuery AI** is an interactive, agentic AI platform that enables users to analyse **satellite and remote sensing imagery using natural-language queries**.

The platform is designed to make complex remote sensing analysis more accessible through a simple interaction:

> ## 🛰️ Upload Satellite Imagery → 💬 Ask a Question → 🤖 Get Intelligence + Visual Evidence

SatQuery AI is envisioned as:

> ### **"ChatGPT for Satellite and Remote Sensing Intelligence"**

However, SatQuery AI is **not just a chatbot connected to a single Vision-Language Model**.

It is designed as an **agentic remote-sensing AI platform** capable of understanding the user's query, inspecting the uploaded imagery, determining the input configuration, selecting the appropriate specialist workflow, and integrating the results into an evidence-grounded response.

---

# 🎯 Problem Statement

### Smart India Hackathon 2026

* **Problem Statement ID:** PS 26167
* **Organization:** Indian Space Research Organisation (ISRO)
* **Theme:** Space Technology

The challenge requires an intelligent system capable of analysing remote sensing imagery through natural-language interaction across multiple scenarios.

SatQuery AI focuses on three major categories of analysis:

1. 🖼️ Single Image Analysis
2. 🔄 Bi-Temporal Change Analysis
3. 🛰️ Optical + SAR Cross-Modal Analysis

---

# 💡 Our Solution

SatQuery AI uses an **Agentic Controller** to intelligently route user requests to specialised analysis workflows.

Instead of sending every query to a single generic AI model, the system considers:

* 💬 User's natural-language query
* 🖼️ Number of uploaded images
* 🛰️ Image modality
* 📅 Whether images belong to different time periods
* 🔗 Whether the inputs form an Optical + SAR pair
* 🎯 Type of analysis requested

The system then selects the most appropriate workflow and AI tools.

```text
UPLOAD SATELLITE IMAGERY
        +
ASK A QUESTION
        ↓
SATQUERY AI UNDERSTANDS THE QUERY
        ↓
IDENTIFIES THE INPUT TYPE
        ↓
SELECTS THE APPROPRIATE SPECIALIST WORKFLOW
        ↓
ANALYSES THE IMAGERY
        ↓
RETURNS ANSWER + VISUAL EVIDENCE
```

---

# 🏗️ System Architecture

```text
                        USER
                          │
                          ▼
                  WEB APPLICATION
                          │
                    Images + Query
                          │
                          ▼
               INPUT VALIDATION &
                IMAGE INSPECTION
                          │
                          ▼
                  QUERY INTERPRETER
                          │
                          ▼
                 TASK CLASSIFICATION
                          │
                          ▼
                  AGENTIC CONTROLLER
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
     SINGLE IMAGE     BI-TEMPORAL     CROSS-MODAL
      WORKFLOW         WORKFLOW        WORKFLOW
          │               │               │
          ▼               ▼               ▼
        VQA            CHANGE          OPTICAL
    CAPTIONING         ANALYSIS            +
    GROUNDING        CHANGE VQA            SAR
                                          ANALYSIS
                                              │
                                              ▼
                                            FUSION
          │               │               │
          └───────────────┼───────────────┘
                          │
                          ▼
              OUTPUT / EVIDENCE INTEGRATION
                          │
                          ▼
                   FINAL RESPONSE
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
       ANSWER         VISUAL          EXECUTION
                     EVIDENCE          SUMMARY
                          │
                          ▼
                      CONFIDENCE
```

---

# ✨ Core Capabilities

## 🖼️ 1. Single Image Analysis

SatQuery AI can analyse a single remote sensing image, including:

* Optical imagery
* Multispectral imagery
* SAR imagery

### Capabilities

* 🤖 Visual Question Answering (VQA)
* 📝 Scene Description and Image Captioning
* 📍 Text-Guided Region Grounding
* 🏙️ Land Cover Identification
* 🌊 Water Body Detection
* 🏗️ Built-Up Area Identification
* 🌾 Agricultural Region Identification

### Example Queries

```text
Describe the land cover and major objects visible in this image.
```

```text
What is visible in this image?
```

```text
Where is the largest water body?
```

```text
Are there built-up areas?
```

```text
Identify agricultural regions.
```

---

# 🔄 2. Bi-Temporal Change Analysis

SatQuery AI can analyse two images of the same geographical region captured at different points in time.

The system can identify changes such as:

* 🏙️ Urban Expansion
* 🏗️ New Construction
* 🌳 Deforestation
* 🌊 Flooding
* 💧 Water Body Changes
* 🌱 Vegetation Changes
* 🗺️ Land Cover Changes

### Example Queries

```text
What changed between these two dates?
```

```text
Where did the change occur?
```

```text
Has the built-up area increased?
```

```text
Has vegetation decreased?
```

### Outputs

* Natural-language change description
* Change-based visual question answering
* Changed region highlighting
* Spatial change maps
* Change masks
* Confidence information

---

# 🛰️ 3. Optical + SAR Cross-Modal Analysis

SatQuery AI supports joint analysis of:

* 🌍 Optical / Multispectral Imagery
* 📡 Synthetic Aperture Radar (SAR) Imagery

Both images represent the same geographical area.

The system combines complementary information from both modalities.

```text
OPTICAL ANALYSIS
       +
SAR ANALYSIS
       ↓
FEATURE / INFORMATION FUSION
       ↓
JOINT INTERPRETATION
```

### Example Query

```text
Use the optical and SAR images together to identify built-up and water-covered regions.
```

---

# 🤖 Agentic Controller

The **Agentic Controller** is the intelligence layer responsible for selecting the correct analysis workflow.

It performs the following steps:

1. Reads the user's natural-language query.
2. Understands the requested task.
3. Inspects uploaded imagery.
4. Determines the number of images.
5. Identifies image modality where possible.
6. Determines the input configuration.
7. Selects the appropriate specialist workflow.
8. Executes the required models and tools.
9. Integrates outputs from different modules.
10. Returns evidence-grounded results.

### Example

```text
USER QUERY:
"What changed between these two dates?"

INPUT:
2 spatially corresponding images

DETECTED TASK:
CHANGE_ANALYSIS

SELECTED WORKFLOW:
BI-TEMPORAL CHANGE PIPELINE

MODELS / TOOLS:
Change Detection
+
Change Understanding / Change VQA

OUTPUT:
Text Description
+
Changed Region Highlighting
+
Confidence
+
Execution Summary
```

---

# 🧠 AI Module Registry

The modular AI architecture includes the following conceptual components:

```text
REMOTE SENSING VQA

IMAGE CAPTIONING / SCENE DESCRIPTION

TEXT-GUIDED REGION GROUNDING

CHANGE DETECTION

CHANGE UNDERSTANDING

CHANGE-BASED VQA

OPTICAL IMAGE ANALYSIS

SAR IMAGE ANALYSIS

OPTICAL-SAR FUSION

EVIDENCE / OUTPUT INTEGRATION
```

The architecture is modular so that individual models can be improved, replaced, fine-tuned, or benchmarked independently.

---

# 📤 Output Format

SatQuery AI does not return only plain text.

Each analysis can provide:

## 💬 Answer

A natural-language response to the user's question.

## 🗺️ Visual Evidence

Depending on the selected workflow:

* Highlighted regions
* Bounding boxes
* Change masks
* Image overlays
* Relevant geographical regions

## 📊 Confidence

A confidence score or confidence level associated with the result.

## 🧠 Models / Workflow Used

Example:

```text
Workflow:
Bi-Temporal Change Analysis

Models Used:
• Change Detection Model
• Change Understanding Model
```

## ⚙️ Execution Summary

Example:

```text
1. Input pair validated.
2. Images identified as a bi-temporal pair.
3. Change analysis task selected.
4. Change detection executed.
5. Changed regions analysed.
6. Final response generated.
```

> The system exposes the observable workflow and execution summary without exposing hidden internal reasoning.

---

# 🖥️ User Interface

SatQuery AI is designed as a modern **AI + Geospatial Intelligence Dashboard**.

## 📁 Left Panel — Input Management

Users can:

* Upload Image 1
* Upload Image 2 when required
* Preview uploaded imagery
* View image information
* View detected input configuration
* Check validation status

Example:

```text
✓ Image Uploaded
✓ Input Validated
✓ Input Type Detected
✓ Ready for Analysis
```

---

## 🛰️ Center Panel — Satellite Image Viewer

The analysis workspace supports:

* Satellite image display
* Zoom
* Pan
* Before / After comparison
* Image switching
* Result overlays
* Highlighted regions
* Bounding boxes
* Change masks

---

## 💬 Right Panel — SatQuery AI Assistant

A conversational interface allows users to ask questions about their imagery.

Example:

```text
SatQuery AI

Ask anything about your satellite imagery...

"What changed between these two images?"

[ Send ]
```

AI responses display:

```text
ANSWER

VISUAL EVIDENCE

CONFIDENCE

MODELS USED

EXECUTION SUMMARY
```

---

# 🧪 Remote Sensing Datasets & Domain Adaptation

SatQuery AI is designed to support remote-sensing-specific model adaptation and evaluation.

Relevant datasets and benchmarks include:

* BigEarthNet
* VRSBench
* RSVQA
* CDVQA

The modular architecture supports:

* Fine-tuned remote sensing models
* Vision-language model adaptation
* Benchmark evaluation
* Model replacement and experimentation

---

# 🛠️ Technology Stack

The exact technology stack may evolve as development progresses.

### Frontend

* Modern JavaScript / TypeScript framework
* Responsive UI
* Interactive geospatial image viewer

### Backend

* Modular API architecture
* Image processing services
* Agentic workflow routing

### AI / Machine Learning

* Vision-Language Models
* Remote Sensing VQA Models
* Change Detection Models
* Image Analysis Models
* Optical + SAR Fusion Models

### Development & Deployment

* Git & GitHub
* Node.js / npm
* Python-based AI services
* Containerised deployment where required

---

# 📂 Proposed Project Structure

```text
satquery-ai/
│
├── frontend/                 # Web application
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── assets/
│
├── backend/                  # Backend API and orchestration
│   ├── api/
│   ├── services/
│   │   ├── input_validation/
│   │   ├── query_classifier/
│   │   ├── agent_controller/
│   │   ├── vqa_service/
│   │   ├── captioning_service/
│   │   ├── grounding_service/
│   │   ├── change_analysis_service/
│   │   ├── sar_analysis_service/
│   │   └── fusion_service/
│   │
│   ├── models/
│   └── utils/
│
├── ai-engine/                # AI model wrappers and inference
│
├── datasets/                 # Dataset references / preprocessing
│
├── docs/                     # Project documentation
│
├── tests/                    # Test cases
│
├── README.md
└── .env.example
```

---

# 🚀 MVP Development Strategy

Development is organised into progressive levels.

## Level 1 — Single Image Analysis

The first complete workflow:

```text
UPLOAD SATELLITE IMAGE
        +
ASK QUESTION
        +
GET ANSWER
        +
GET SCENE DESCRIPTION
        +
SHOW VISUAL RESULT
        +
SHOW WORKFLOW SUMMARY
```

---

## Level 2 — Bi-Temporal Change Analysis

```text
UPLOAD BEFORE IMAGE
        +
UPLOAD AFTER IMAGE
        +
ASK:
"What changed?"
        ↓
CHANGE DESCRIPTION
+
CHANGE VISUALIZATION
```

---

## Level 3 — Optical + SAR Analysis

```text
UPLOAD OPTICAL IMAGE
        +
UPLOAD SAR IMAGE
        +
ASK QUERY
        ↓
CROSS-MODAL ANALYSIS
        ↓
COMBINED INTERPRETATION
```

---

# 🎯 Development Principles

SatQuery AI follows the principle:

```text
STRONG POLISHED UI
        +
MODULAR BACKEND
        +
REAL SPECIALIST MODELS
        +
CLEAR AGENTIC ROUTING
        +
EVIDENCE-GROUNDED OUTPUT
```

The goal is not to build every possible remote sensing capability from scratch.

Instead, the focus is on creating a **small number of highly functional, reliable, and demonstrable workflows** that can deliver meaningful results.

---

# 🗺️ Roadmap

* [x] Problem statement analysis
* [x] Product vision and architecture design
* [x] Agentic workflow design
* [x] Functional requirement identification
* [x] Repository creation
* [x] Initial frontend setup
* [ ] Complete MVP frontend
* [ ] Implement file upload pipeline
* [ ] Implement input validation
* [ ] Implement query classification
* [ ] Implement Agentic Controller
* [ ] Integrate Single Image VQA
* [ ] Implement Scene Description
* [ ] Implement Region Grounding
* [ ] Implement Bi-Temporal Change Analysis
* [ ] Implement Change Visualization
* [ ] Implement Optical + SAR Analysis
* [ ] Implement Evidence Integration
* [ ] Add confidence estimation
* [ ] Benchmark remote-sensing models
* [ ] Deploy the complete system

---

# 🌟 Vision

**SatQuery AI is an interactive agentic vision-language platform for remote sensing that enables users to upload satellite imagery and analyse it using natural-language queries.**

The system intelligently determines the appropriate workflow and specialist models based on the uploaded imagery and the user's query.

The final experience is:

# 🛰️ UPLOAD → 💬 ASK → 🤖 SATQUERY AI ROUTES → 🔍 ANALYSES → 💡 EXPLAINS → 🗺️ SHOWS EVIDENCE

---

<div align="center">

## 🚀 Building Intelligent Access to Satellite Intelligence

### Smart India Hackathon 2026

**PS 26167 • ISRO • Space Technology**

Made with ❤️ for innovation, research, and impact.

</div>
