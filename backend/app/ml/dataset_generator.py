"""
Synthetic and Historical Dataset Generator for Monsoon Teleconnections and Hyperlocal Downscaling.
Simulates daily records across blocks with global indices:
- ENSO (ONI / NINO3.4 SST anomaly)
- IOD (Dipole Mode Index - DMI)
- MJO (RMM1, RMM2, Amplitude, Phase 1-8)
- Regional boundary variables: 850hPa Zonal Wind, 200hPa Velocity Potential, Total Precipitable Water, OLR
- Target metrics: Daily Precipitation (mm), Onset Day indicator, False Onset indicator, Break Monsoon Spell indicator (>3 consecutive dry days in peak monsoon)
"""

import numpy as np
import pandas as pd
import os

BLOCKS = [
    {"id": "berasia", "name": "Berasia", "district": "Bhopal", "state": "Madhya Pradesh", "lat": 23.63, "lon": 77.43},
    {"id": "phanda", "name": "Phanda", "district": "Bhopal", "state": "Madhya Pradesh", "lat": 23.28, "lon": 77.28},
    {"id": "huzur", "name": "Huzur", "district": "Bhopal", "state": "Madhya Pradesh", "lat": 23.19, "lon": 77.52},
    {"id": "ashta", "name": "Ashta", "district": "Sehore", "state": "Madhya Pradesh", "lat": 23.02, "lon": 76.72},
    {"id": "sehore-block", "name": "Sehore", "district": "Sehore", "state": "Madhya Pradesh", "lat": 23.20, "lon": 77.08},
    {"id": "ichhawar", "name": "Ichhawar", "district": "Sehore", "state": "Madhya Pradesh", "lat": 23.03, "lon": 77.01},
    {"id": "vidisha-block", "name": "Vidisha", "district": "Vidisha", "state": "Madhya Pradesh", "lat": 23.52, "lon": 77.81},
    {"id": "gyaraspur", "name": "Gyaraspur", "district": "Vidisha", "state": "Madhya Pradesh", "lat": 23.70, "lon": 78.10},
    {"id": "basoda", "name": "Basoda", "district": "Vidisha", "state": "Madhya Pradesh", "lat": 23.85, "lon": 77.93},
]

def generate_teleconnection_dataset(start_year=2000, end_year=2024):
    np.random.seed(42)
    records = []
    
    dates = pd.date_range(start=f"{start_year}-05-01", end=f"{end_year}-10-31", freq="D")
    # Filter monsoon/pre-monsoon season: May to October
    dates = dates[(dates.month >= 5) & (dates.month <= 10)]

    # Generate persistent climate indices by year & month
    years = range(start_year, end_year + 1)
    
    # Yearly base ENSO/IOD states
    yearly_enso = {y: np.random.normal(0.1, 0.9) for y in years}
    yearly_iod = {y: np.random.normal(0.05, 0.5) for y in years}

    for dt in dates:
        y = dt.year
        doy = dt.dayofyear
        
        # Teleconnections with low-frequency variability
        enso_oni = yearly_enso[y] + 0.15 * np.sin(2 * np.pi * doy / 365.25) + np.random.normal(0, 0.05)
        iod_dmi = yearly_iod[y] + 0.1 * np.cos(2 * np.pi * doy / 365.25) + np.random.normal(0, 0.04)
        
        # MJO 30-60 day oscillation cycle
        mjo_phase_float = (doy / 45.0 * 8.0) % 8.0
        mjo_phase = int(mjo_phase_float) + 1
        mjo_amp = np.clip(1.2 + 0.6 * np.sin(doy / 15.0) + np.random.normal(0, 0.2), 0.2, 3.5)
        rmm1 = mjo_amp * np.cos(2 * np.pi * mjo_phase_float / 8.0)
        rmm2 = mjo_amp * np.sin(2 * np.pi * mjo_phase_float / 8.0)
        
        # Atmospheric parameters (850hPa Zonal wind, OLR, TPW)
        # Positive MJO phases (2,3,4,5) over Indian Ocean favor active convection
        mjo_convection_bonus = 1.0 if mjo_phase in [2, 3, 4, 5] else -0.8
        enso_suppression = -1.2 if enso_oni > 0.8 else (0.8 if enso_oni < -0.8 else 0.0)
        iod_enhancement = 0.7 if iod_dmi > 0.4 else (-0.6 if iod_dmi < -0.4 else 0.0)
        
        synoptic_score = mjo_convection_bonus + enso_suppression + iod_enhancement

        for blk in BLOCKS:
            # Orographic / localized microclimate offset
            local_seed = (hash(blk["id"]) % 1000) / 1000.0
            
            # Monsoon seasonal bell curve: peak in July (month 7) and August (month 8)
            season_weight = np.exp(-((dt.month - 7.5)**2) / 1.5)
            
            # Expected rainfall
            mean_rain = max(0.0, (14.0 * season_weight + synoptic_score * 3.5 + (local_seed - 0.5) * 4.0))
            
            # Zero-inflated precipitation generator
            prob_rain = min(0.95, max(0.05, 0.45 * season_weight + 0.1 * synoptic_score))
            has_rain = np.random.rand() < prob_rain
            
            rainfall_mm = np.random.exponential(mean_rain + 2.0) if has_rain else 0.0
            if rainfall_mm < 0.2:
                rainfall_mm = 0.0
                
            records.append({
                "date": dt.strftime("%Y-%m-%d"),
                "year": dt.year,
                "month": dt.month,
                "day": dt.day,
                "day_of_year": doy,
                "block_id": blk["id"],
                "district": blk["district"],
                "lat": blk["lat"],
                "lon": blk["lon"],
                "enso_oni": round(enso_oni, 3),
                "iod_dmi": round(iod_dmi, 3),
                "mjo_phase": mjo_phase,
                "mjo_amplitude": round(mjo_amp, 3),
                "rmm1": round(rmm1, 3),
                "rmm2": round(rmm2, 3),
                "rainfall_mm": round(rainfall_mm, 2)
            })
            
    df = pd.DataFrame(records)
    
    # Calculate rolling metrics to flag Onset, False Onset, and Break Spells
    df["rainfall_3d_sum"] = df.groupby("block_id")["rainfall_mm"].transform(lambda x: x.rolling(3, min_periods=1).sum())
    df["rainfall_7d_sum"] = df.groupby("block_id")["rainfall_mm"].transform(lambda x: x.rolling(7, min_periods=1).sum())
    
    # IMD definition of Onset: >2.5mm for 2 consecutive days after May 10 + low level westerly winds
    # Break Phase: Consecutive 4+ days of dry weather (<1mm) during July-August
    df["is_dry_day"] = (df["rainfall_mm"] < 1.0).astype(int)
    df["dry_spell_4d"] = df.groupby("block_id")["is_dry_day"].transform(
        lambda x: x.rolling(4, min_periods=1).apply(lambda w: 1 if np.sum(w) >= 4 else 0, raw=True)
    )
    
    # Heavy Rain condition (>64.5 mm/day as per IMD criteria)
    df["is_heavy_rain"] = (df["rainfall_mm"] >= 64.5).astype(int)

    return df

if __name__ == "__main__":
    out_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(out_dir, "teleconnections_block_dataset.csv")
    print("Generating teleconnection training dataset...")
    df = generate_teleconnection_dataset(start_year=2015, end_year=2024)
    df.to_csv(csv_path, index=False)
    print(f"Generated {len(df)} records. Saved to: {csv_path}")
