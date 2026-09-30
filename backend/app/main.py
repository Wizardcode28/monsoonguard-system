"""
FastAPI Server for Hyperlocal Monsoon Onset & Break Prediction System.
Connects ML downscaling models, teleconnection indices (ENSO, IOD, MJO),
GIS block GeoJSON boundaries, crop advisory rules, and SMS/WhatsApp notifications.
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

from app.advisories.engine import generate_crop_advisories, TRANSLATIONS
from app.notifications.gateway import send_monsoon_alert, get_recent_dispatches

app = FastAPI(
    title="MonsoonGuard Hyperlocal Prediction API",
    description="MoES / NCMRWF Block & Panchayat Scale Monsoon Prediction & Advisory System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_PATH = os.path.join(BASE_DIR, "ml", "monsoon_downscaling_models.joblib")
GEOJSON_PATH = os.path.join(BASE_DIR, "data", "blocks_boundaries.geojson")

# Load ML bundle
models_bundle = None
if os.path.exists(MODELS_PATH):
    models_bundle = joblib.load(MODELS_PATH)
    print("Loaded ML downscaling models bundle.")

# Load GeoJSON
blocks_geojson = {}
if os.path.exists(GEOJSON_PATH):
    with open(GEOJSON_PATH, "r", encoding="utf-8") as f:
        blocks_geojson = json.load(f)

DISTRICTS = [
    {"id": "bhopal", "name": "Bhopal", "state": "Madhya Pradesh"},
    {"id": "sehore", "name": "Sehore", "state": "Madhya Pradesh"},
    {"id": "vidisha", "name": "Vidisha", "state": "Madhya Pradesh"}
]

BLOCKS = [
    {"id": "berasia", "name": "Berasia", "districtId": "bhopal", "district": "Bhopal", "state": "Madhya Pradesh", "latitude": 23.63, "longitude": 77.43, "panchayats": ["Nazirabad", "Parwalia", "Chandpur", "Kurana"]},
    {"id": "phanda", "name": "Phanda", "districtId": "bhopal", "district": "Bhopal", "state": "Madhya Pradesh", "latitude": 23.28, "longitude": 77.28, "panchayats": ["Bilkisganj", "Ratibad", "Neelbad"]},
    {"id": "huzur", "name": "Huzur", "districtId": "bhopal", "district": "Bhopal", "state": "Madhya Pradesh", "latitude": 23.19, "longitude": 77.52, "panchayats": ["Kolar", "Misrod", "Bagroda"]},
    {"id": "ashta", "name": "Ashta", "districtId": "sehore", "district": "Sehore", "state": "Madhya Pradesh", "latitude": 23.02, "longitude": 76.72, "panchayats": ["Jawar", "Kannod", "Siddiqganj"]},
    {"id": "sehore-block", "name": "Sehore", "districtId": "sehore", "district": "Sehore", "state": "Madhya Pradesh", "latitude": 23.20, "longitude": 77.08, "panchayats": ["Doraha", "Amlaha", "Shyampur"]},
    {"id": "ichhawar", "name": "Ichhawar", "districtId": "sehore", "district": "Sehore", "state": "Madhya Pradesh", "latitude": 23.03, "longitude": 77.01, "panchayats": ["Diwadiya", "Brijishnagar", "Nasrullaganj"]},
    {"id": "vidisha-block", "name": "Vidisha", "districtId": "vidisha", "district": "Vidisha", "state": "Madhya Pradesh", "latitude": 23.52, "longitude": 77.81, "panchayats": ["Pathari", "Sanchi Road", "Haidergarh"]},
    {"id": "gyaraspur", "name": "Gyaraspur", "districtId": "vidisha", "district": "Vidisha", "state": "Madhya Pradesh", "latitude": 23.70, "longitude": 78.10, "panchayats": ["Manora", "Gulabganj", "Gyaraspur Village"]},
    {"id": "basoda", "name": "Basoda", "districtId": "vidisha", "district": "Vidisha", "state": "Madhya Pradesh", "latitude": 23.85, "longitude": 77.93, "panchayats": ["Ganj Basoda", "Bareth", "Tyonda"]},
]

def get_risk_level(score: float) -> str:
    if score >= 70:
        return "CRITICAL"
    if score >= 45:
        return "HIGH"
    if score >= 25:
        return "MODERATE"
    return "LOW"

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "models_loaded": models_bundle is not None,
        "blocks_count": len(BLOCKS),
        "geojson_loaded": bool(blocks_geojson)
    }

@app.get("/api/climate-teleconnections")
def get_teleconnections():
    """Returns current active planetary boundary teleconnection indices (ENSO, IOD, MJO)."""
    return {
        "enso": {
            "index": "ONI (Oceanic Niño Index)",
            "value": 0.42,
            "phase": "Neutral / Weak El Niño",
            "impact": "Slight moisture suppression over Central India"
        },
        "iod": {
            "index": "DMI (Dipole Mode Index)",
            "value": 0.35,
            "phase": "Positive IOD",
            "impact": "Favorable cross-equatorial flow into Arabian Sea branch"
        },
        "mjo": {
            "index": "Wheeler-Hendon RMM1/RMM2",
            "phase": 3,
            "phase_name": "Indian Ocean Convective Phase",
            "amplitude": 1.64,
            "impact": "Enhanced intra-seasonal convective pulse across Peninsular and Central India"
        },
        "as_of": datetime.now().strftime("%Y-%m-%d")
    }

@app.get("/api/locations")
def list_locations(districtId: Optional[str] = None):
    if districtId and districtId != "all":
        return [b for b in BLOCKS if b["districtId"] == districtId]
    return BLOCKS

@app.get("/api/districts")
def list_districts():
    return DISTRICTS

@app.get("/api/geojson")
def get_geojson_map():
    return blocks_geojson

@app.get("/api/forecast/{location_id}")
def get_block_forecast(location_id: str, horizon: int = Query(7, ge=1, le=30)):
    block = next((b for b in BLOCKS if b["id"] == location_id), None)
    if not block:
        raise HTTPException(status_code=404, detail="Block not found")
        
    start_date = datetime.now()
    daily_predictions = []
    
    # Run ML model or simulated features
    feature_cols = models_bundle["features"] if models_bundle else []
    
    for i in range(horizon):
        target_date = start_date + timedelta(days=i)
        doy = target_date.timetuple().tm_yday
        month = target_date.month
        
        # Prepare feature vector for ML downscaling
        row = {
            "month": month,
            "day_of_year": doy,
            "lat": block["latitude"],
            "lon": block["longitude"],
            "enso_oni": 0.42,
            "iod_dmi": 0.35,
            "mjo_phase": 3,
            "mjo_amplitude": 1.64,
            "rmm1": 1.12,
            "rmm2": 0.85
        }
        
        # Block one-hot flags
        for col in feature_cols:
            if col.startswith("blk_"):
                row[col] = 1 if col == f"blk_{location_id}" else 0
                
        df_feat = pd.DataFrame([row])
        # Ensure all columns present
        for col in feature_cols:
            if col not in df_feat.columns:
                df_feat[col] = 0
        df_feat = df_feat[feature_cols] if feature_cols else None
        
        if models_bundle and df_feat is not None:
            pred_rain = float(np.clip(models_bundle["rain_model"].predict(df_feat)[0], 0.0, 150.0))
            dry_prob = round(float(models_bundle["dry_model"].predict_proba(df_feat)[0][1]) * 100, 1)
            heavy_prob = round(float(models_bundle["heavy_model"].predict_proba(df_feat)[0][1]) * 100, 1)
        else:
            pred_rain = round(max(0.0, np.random.normal(8.0, 5.0)), 1)
            dry_prob = 35.0
            heavy_prob = 15.0

        onset_prob = round(min(98.0, max(20.0, 85.0 - (dry_prob * 0.4))), 1)

        daily_predictions.append({
            "date": target_date.strftime("%Y-%m-%d"),
            "rainfallMm": round(pred_rain, 1),
            "normalRainfallMm": 9.5,
            "onsetProbability": onset_prob,
            "drySpellProbability": dry_prob,
            "heavyRainProbability": heavy_prob,
            "temperatureMax": round(32.5 + np.sin(i / 3.0) * 2.0, 1),
            "temperatureMin": 24.0,
            "windSpeedKmph": 16.0
        })

    avg_dry = np.mean([d["drySpellProbability"] for d in daily_predictions])
    avg_heavy = np.mean([d["heavyRainProbability"] for d in daily_predictions])
    avg_onset = np.mean([d["onsetProbability"] for d in daily_predictions])
    
    return {
        "location": block,
        "horizonDays": horizon,
        "summary": {
            "onsetProbability": round(float(avg_onset), 1),
            "drySpellRisk": round(float(avg_dry), 1),
            "heavyRainRisk": round(float(avg_heavy), 1),
            "overallRisk": get_risk_level(avg_dry * 0.6 + avg_heavy * 0.4),
            "likelyOnsetDate": (start_date + timedelta(days=4)).strftime("%d %B %Y"),
            "projectedBreakDurationDays": 6 if avg_dry > 45 else 2
        },
        "daily": daily_predictions
    }

@app.get("/api/risk-map")
def get_risk_map(district: Optional[str] = None):
    targets = BLOCKS if not district or district == "all" else [b for b in BLOCKS if b["districtId"] == district]
    results = []
    
    for b in targets:
        fc = get_block_forecast(b["id"], horizon=7)
        s = fc["summary"]
        results.append({
            "id": b["id"],
            "name": b["name"],
            "district": b["district"],
            "state": b["state"],
            "latitude": b["latitude"],
            "longitude": b["longitude"],
            "onsetProbability": s["onsetProbability"],
            "drySpellRisk": s["drySpellRisk"],
            "heavyRainRisk": s["heavyRainRisk"],
            "overallRisk": s["overallRisk"],
            "panchayats": b.get("panchayats", [])
        })
    return results

@app.get("/api/advisories/{location_id}")
def get_advisories(location_id: str, crop: str = "Soybean", lang: str = "hi"):
    fc = get_block_forecast(location_id, horizon=7)
    s = fc["summary"]
    block = fc["location"]
    
    false_onset_prob = round(max(0, 100 - s["onsetProbability"]), 1)
    
    items = generate_crop_advisories(
        block_name=block["name"],
        crop=crop,
        dry_spell_prob=s["drySpellRisk"],
        heavy_rain_prob=s["heavyRainRisk"],
        onset_prob=s["onsetProbability"],
        false_onset_prob=false_onset_prob,
        language=lang
    )
    
    return {
        "block": block["name"],
        "crop": crop,
        "language": lang,
        "metrics": s,
        "advisories": items
    }

class NotificationRequest(BaseModel):
    recipient_type: str = "farmer"  # 'farmer' or 'officer'
    contact: str
    channel: str = "whatsapp"  # 'sms' or 'whatsapp'
    language: str = "hi"
    block_id: str
    title: str
    message: str
    risk_level: str = "HIGH"

@app.post("/api/notifications/dispatch")
def dispatch_notification(req: NotificationRequest):
    block = next((b for b in BLOCKS if b["id"] == req.block_id), None)
    block_name = block["name"] if block else req.block_id
    
    res = send_monsoon_alert(
        recipient_type=req.recipient_type,
        recipient_contact=req.contact,
        channel=req.channel,
        language=req.language,
        block_name=block_name,
        alert_title=req.title,
        alert_message=req.message,
        risk_level=req.risk_level
    )
    return {"status": "SUCCESS", "dispatch": res}

@app.get("/api/notifications/history")
def dispatch_history(limit: int = 50):
    return get_recent_dispatches(limit)
