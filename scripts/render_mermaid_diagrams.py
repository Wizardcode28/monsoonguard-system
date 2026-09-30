import os
import time
from playwright.sync_api import sync_playwright

OUT_DIR = os.path.abspath(r"d:\SIH_2026\monsoonguard-system\docs\images")

DIAGRAMS = [
    {
        "name": "diagram-architecture.png",
        "code": """
flowchart TB
    subgraph DataSources ["Meteorological Data & Teleconnections (MoES / NCMRWF / NOAA)"]
        GFS["NCUM / GFS Numerical Models<br>(Coarse 12km NWP Grid)"]
        Satellite["INSAT-3DR & IMD Radar<br>(Satellite Radiance & Precipitation)"]
        Telecon["Planetary Teleconnection Indices<br>(ENSO Niño 3.4, IOD Dipole, MJO Wave)"]
    end

    subgraph Backend ["High-Performance Ingestion & AI Engine (FastAPI + Python)"]
        Ingest["Data Assimilation & Feature Pipeline<br>(Spatial Interpolation, Moving Trends)"]
        LightGBM_Downscale["LightGBM Quantile Regressors<br>(Hyper-Local 1km Downscaling)"]
        Extreme_Classifiers["Heavy Rainfall & Dry Spell Classifiers<br>(Probability of Break Monsoon)"]
        Advisory_Engine["Rule-Based Agronomic AI Engine<br>(Crop Stage, Soil Moisture, Spray Advisories)"]
        Multilingual["Multilingual Translation Layer<br>(Hindi, English, Regional Dialects)"]
    end

    subgraph Client ["Interactive Decision Support Web Platform (React 19 + TanStack)"]
        UI_Dash["Real-Time Monsoon Dashboard<br>(Teleconnections, Live Gauges, Status)"]
        UI_Forecast["16-Day Downscaled Forecast<br>(Confidence Intervals, Dry Spells)"]
        UI_Map["Geospatial Block Visualizer<br>(Leaflet Block Choropleths & Risk Zones)"]
        UI_Advisory["Farmer Agronomic Advisory Hub<br>(Crop Stages, Spray Windows, Sowing)"]
        UI_Officer["District Officer Command Center<br>(Disaster Alerts, Multi-Block Analytics)"]
    end

    GFS & Satellite & Telecon --> Ingest
    Ingest --> LightGBM_Downscale
    Ingest --> Extreme_Classifiers
    LightGBM_Downscale & Extreme_Classifiers --> Advisory_Engine
    Advisory_Engine --> Multilingual
    Multilingual --> UI_Dash & UI_Forecast & UI_Map & UI_Advisory & UI_Officer
"""
    },
    {
        "name": "diagram-sequence.png",
        "code": """
sequenceDiagram
    autonumber
    actor Farmer as Farmer / FPO Representative
    actor Officer as District Agriculture Officer
    participant Web as MonsoonGuard Web UI
    participant API as FastAPI Backend (Render)
    participant ML as LightGBM ML Downscaling Engine
    participant Advisory as Agronomic Decision Service

    Farmer->>Web: Selects Block (e.g. Bhopal - Berasia)
    Web->>API: GET /api/forecast?block=Berasia
    API->>ML: Inference (NWP Boundary + ENSO/IOD/MJO Teleconnections)
    ML-->>API: 16-Day Downscaled Rain, Dry Spell Risk (91%), Heavy Rain Prob
    API->>Advisory: Generate advisories for Soybean / Paddy
    Advisory-->>API: Multilingual Actionable Guidance (Hindi/English)
    API-->>Web: JSON Forecast + Risk Bands + Multilingual Cards
    Web-->>Farmer: Displays High-Res Curves, Alerts, Spray Window Timers

    Officer->>Web: Accesses District Command Center
    Web->>API: GET /api/alerts & GET /api/blocks
    API-->>Web: Aggregated Block Risk Matrix
    Web-->>Officer: Interactive Geo-Map & Threshold Warning Feeds
"""
    },
    {
        "name": "diagram-roadmap.png",
        "code": """
flowchart LR
    subgraph M1 ["Milestone 1: Proof-of-Concept"]
        A1["Bhopal & Sehore Pilots"]
        A2["LightGBM 1km Downscaling"]
        A3["Real-Time Dashboard & Web UI"]
    end

    subgraph M2 ["Milestone 2: State Expansion"]
        B1["All 55 MP Districts Integration"]
        B2["Meghdoot / Damini API Linking"]
        B3["Automated WhatsApp & SMS Broadcasts"]
    end

    subgraph M3 ["Milestone 3: National Rollout"]
        C1["Pan-India 6,000+ Blocks Deployment"]
        C2["NCMRWF Operational Cluster Pipeline"]
        C3["PMFBY Crop Insurance Ground Truth Feed"]
    end

    M1 --> M2 --> M3
"""
    }
]

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    body {{
      margin: 0;
      padding: 40px;
      background: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }}
    .mermaid {{
      width: 100%;
      max-width: 1200px;
    }}
  </style>
</head>
<body>
  <div class="mermaid">
{code}
  </div>
  <script>
    mermaid.initialize({{
      startOnLoad: true,
      theme: 'neutral',
      flowchart: {{
        curve: 'basis',
        nodeSpacing: 50,
        rankSpacing: 50
      }}
    }});
  </script>
</body>
</html>
"""

def render_diagrams():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe"
        )
        page = browser.new_page(viewport={"width": 1400, "height": 900}, device_scale_factor=2)

        for diag in DIAGRAMS:
            out_file = os.path.join(OUT_DIR, diag["name"])
            print(f"Rendering {diag['name']}...")
            content = HTML_TEMPLATE.format(code=diag["code"].strip())
            page.set_content(content, wait_until="networkidle")
            time.sleep(2)
            elem = page.locator(".mermaid svg").first
            if elem.is_visible():
                elem.screenshot(path=out_file)
                print(f"  [OK] Saved diagram to {out_file}")
            else:
                page.screenshot(path=out_file)
                print(f"  [OK Fallback] Saved diagram to {out_file}")

        browser.close()

if __name__ == "__main__":
    render_diagrams()
