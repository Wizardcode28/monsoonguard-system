# MonsoonGuard: Hyperlocal Monsoon Onset & Break Prediction System
**Smart India Hackathon (SIH) Problem Statement 26086**
**Ministry of Earth Sciences (MoES) — National Centre for Medium Range Weather Forecasting (NCMRWF)**

---

## 🌟 Project Overview
MonsoonGuard bridges the gap between global planetary climate teleconnections (ENSO, IOD, MJO) and hyper-local agricultural outcomes at the **Block and Panchayat (village-cluster)** scale. Standard regional forecasts often fail to capture localized intra-seasonal variations, exposing farmers to false monsoon onsets, prolonged break phases (dry spells), or localized heavy downpours.

MonsoonGuard delivers:
1. **7-to-30-Day Probabilistic Forecasts**: Downscaled at Block/Panchayat resolution.
2. **Machine Learning Downscaling Pipeline**: Pairs ENSO (ONI), IOD (DMI), and MJO (RMM1/RMM2 phases) with micro-climatic atmospheric signals using trained gradient-boosted decision trees (`LightGBM`).
3. **Interactive Color-Coded Risk Maps**: Spatial maps with GeoJSON boundaries for onset probability, break phase duration, and heavy rainfall risks (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
4. **Expert Agronomic Advisory Engine**: Translates rainfall anomaly matrices into crop-specific advisories (sowing window, irrigation alternatives, drought-tolerant cultivar switches).
5. **Multilingual Farmer Gateway (SMS/WhatsApp)**: Automated outbound alert gateway delivering actionable alerts in regional languages (Hindi, Marathi, Gujarati, Punjabi, English).

---

## 📁 Repository Structure
```
d:\SIH_2026\monsoonguard-system/
├── backend/
│   └── app/
│       ├── main.py                     # FastAPI server with all REST endpoints
│       ├── ml/
│       │   ├── dataset_generator.py    # Generates historical teleconnection & rainfall datasets
│       │   ├── train_models.py         # LightGBM training pipeline & serialization
│       │   └── monsoon_downscaling_models.joblib # Serialized models bundle
│       ├── advisories/
│       │   └── engine.py               # Crop rules & multilingual translation engine
│       ├── notifications/
│       │   └── gateway.py              # SMS / WhatsApp outbound dispatcher simulator
│       └── data/
│           └── blocks_boundaries.geojson # Geographic polygon boundaries for target blocks
│
└── frontend/                           # Full-featured TanStack Start + React 19 UI
    ├── src/
    │   ├── routes/                     # Dashboard, Risk Map, Forecast, Advisories, Alerts, Officer Portal
    │   ├── components/                 # Leaflet/SVG interactive maps, Recharts timelines, Cards
    │   └── services/                   # Connects to http://localhost:5000 with fallbacks
```

---

## 🚀 Running the Project

### 1. Launch Backend API
```powershell
cd d:\SIH_2026\monsoonguard-system\backend
uvicorn app.main:app --port 5000 --reload
```
- **API Health Check**: `http://localhost:5000/api/health`
- **Swagger Docs**: `http://localhost:5000/docs`
- **Teleconnections Telemetry**: `http://localhost:5000/api/climate-teleconnections`
- **Multilingual Advisory**: `http://localhost:5000/api/advisories/berasia?crop=Soybean&lang=hi`

### 2. Launch Frontend UI
```powershell
cd d:\SIH_2026\monsoonguard-system\frontend
npm run dev
```
Open `http://localhost:5173` or Vite dev URL in your browser.
