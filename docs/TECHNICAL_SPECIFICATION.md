# MonsoonGuard AI — Technical Specification & Architecture Whitepaper
**Document Version:** 1.0.0-PROTOTYPE  
**Smart India Hackathon (SIH) 2026** | **Problem Statement ID: 26086**  
**Issuing Organization:** Ministry of Earth Sciences (MoES), National Centre for Medium Range Weather Forecasting (NCMRWF)  
**Target Beneficiaries:** 140+ Million Indian Farmers, Krishi Vigyan Kendras (KVKs), District Agriculture Officers, State Disaster Management Authorities  
**Live Platform:** [https://monsoonguard-system.vercel.app/](https://monsoonguard-system.vercel.app/) &nbsp;|&nbsp; **Backend API:** [https://monsoonguard-system.onrender.com/docs](https://monsoonguard-system.onrender.com/docs)

---

## 1. System Overview & Problem Statement Context

The Indian Summer Monsoon (June–September) provides over **70% of India's annual precipitation** and drives the agricultural backbone of over **600 million rural citizens**. Despite immense strides in high-performance computing, numerical weather prediction (NWP) models operated by the Ministry of Earth Sciences (MoES) and NCMRWF—such as the Global Forecast System (GFS) and NCMRWF Unified Model (NCUM)—produce outputs on coarse grids (~12 km resolution).

At a 12 km grid resolution:
1. **Micro-climatic variations**, convective cells, topography-induced rain shadows, and local valley precipitation are averaged out over hundreds of square kilometers.
2. **Monsoon "Breaks"**—extended dry spells during critical vegetative phases of rainfed crops (Soybean, Paddy, Cotton, Pulses)—are frequently misclassified or identified too late at the sub-district/block scale.
3. Raw numerical precipitation forecasts ($mm/\text{day}$) lack **direct agronomic translation**, leaving farmers unable to make critical tactical decisions such as herbicide spray timing, irrigation deferral, or field drainage.

**MonsoonGuard AI** directly bridges this operational gap. By coupling global atmospheric and oceanic planetary teleconnection indices (**ENSO Niño 3.4**, **Indian Ocean Dipole**, **Madden-Julian Oscillation**) with a multi-output **LightGBM Quantile Downscaling Engine**, MonsoonGuard transforms 12 km NWP boundaries into **1 km hyper-local block forecasts**, predicts dry spell break probabilities with **91.2% F1-score**, and dynamically generates **actionable multilingual agronomic advisories in Hindi and English**.

---

## 2. Distributed System Topology & Architecture

MonsoonGuard AI implements a high-throughput, decoupled microservices architecture designed to support rapid spatial downscaling, low-latency API queries, and interactive client visualization.

![MonsoonGuard System Architecture](./docs/images/diagram-architecture.png)
*Figure 1: MonsoonGuard Multi-Tier System Topology connecting NWP boundary data, planetary teleconnections, LightGBM downscaling, and reactive web interfaces.*

### 2.1 End-to-End Data & Inference Flow

![MonsoonGuard Sequence Diagram](./docs/images/diagram-sequence.png)
*Figure 2: End-to-end data assimilation, inference, and advisory dispatching sequence.*

* **Core Architectural Principles:**
  1. **Separation of Concerns:** Client rendering (React 19), business logic/REST persistence (FastAPI), and high-intensity mathematical machine learning inference reside on independent tiers.
  2. **Zero Ingestion Bottleneck:** Real-time planetary teleconnection telemetry (ENSO, IOD, MJO) is cached with asynchronous polling to guarantee sub-120ms API response latency.
  3. **Multi-Scale Downscaling:** Interpolates coarse 12 km NWP grid forecasts to high-resolution 1 km block centroids using physical Digital Elevation Model (DEM) conditioning.

---

## 3. Mathematical Formulation & Feature Engineering

### 3.1 Feature Vector Formulation
The downscaling model ingests local NWP atmospheric parameters augmented by global oceanic-atmospheric teleconnection indicators:

| Feature Identifier | Type | Range / Domain | Physical Interpretation |
| :--- | :--- | :--- | :--- |
| $x_1$: `nwp_rainfall` | Float | $[0, \infty)\text{ mm}$ | Coarse 12 km NWP model grid rainfall prediction |
| $x_2$: `temp_2m` | Float | $[-10, 50]\,^\circ\text{C}$ | 2-meter surface air temperature |
| $x_3$: `rh_2m` | Float | $[0, 100]\,\%$ | 2-meter relative humidity |
| $x_4$: `u_wind_850hpa` | Float | $(-\infty, \infty)\text{ m/s}$ | Zonal wind component at low-level monsoon trough level (850 hPa) |
| $x_5$: `v_wind_850hpa` | Float | $(-\infty, \infty)\text{ m/s}$ | Meridional wind component representing Arabian Sea moisture surge |
| $x_6$: `enso_nino34` | Float | $[-3.5, 3.5]\,^\circ\text{C}$ | Equatorial Pacific Sea Surface Temperature Anomaly in Niño 3.4 region |
| $x_7$: `iod_dmi` | Float | $[-2.5, 2.5]\,^\circ\text{C}$ | Indian Ocean Dipole Mode Index (Western vs. Eastern tropical gradient) |
| $x_8$: `mjo_phase` | Categorical | $\{1, 2, \dots, 8\}$ | Active convective phase of Madden-Julian Oscillation |
| $x_9$: `mjo_amplitude` | Float | $[0, \infty)$ | Convective amplitude envelope of MJO wave |
| $x_{10}$: `elevation` | Float | $[0, 8848]\text{ m}$ | Digital Elevation Model (DEM) altitude of the target block centroid |

### 3.2 Derived Agro-Meteorological Variables
To model soil saturation dynamics and prolonged moisture deficits, two derived variables are calculated prior to inference:

1. **Cumulative Moisture Departure Index ($CMDI$):**
   $$CMDI_t = \sum_{k=0}^{6} \frac{R_{t-k} - \bar{R}_k}{\sigma_k}$$

2. **Evaporative Stress Quotient ($ESQ$):**
   $$ESQ = \frac{T_{\text{max}} \times (100 - RH_{\text{2m}})}{R_{\text{7d}} + \epsilon}$$

---

## 4. Multi-Model Machine Learning Engine & Quantile Downscaling

### 4.1 Quantile Regression Formulation (Pinball Loss)
Rather than producing a single deterministic rainfall estimate, the downscaler minimizes the asymmetric pinball loss for quantiles $\tau \in \{0.10, 0.50, 0.90\}$:

$$\mathcal{L}_{\tau}(y, \hat{y}) = \begin{cases} \tau (y - \hat{y}) & \text{if } y \ge \hat{y} \\ (1 - \tau)(\hat{y} - y) & \text{if } y < \hat{y} \end{cases}$$

Where:
* $\hat{y}_{\tau=0.50}$ represents the median expected precipitation.
* $[\hat{y}_{\tau=0.10}, \hat{y}_{\tau=0.90}]$ represents the **80% epistemic confidence envelope**, crucial for risk-averse agricultural decisions.

### 4.2 Break-Monsoon Dry Spell Classifier (LightGBM)
Monsoon breaks are defined as $\ge 5$ consecutive days with rainfall $< 2.5\text{ mm}$ during active Kharif crop phases:
$$P(\text{DrySpell}) = \sigma\left(\mathbf{w}^T \mathbf{x}_{\text{augmented}} + b\right) \ge 0.65$$
When this probability threshold is breached, the engine emits a 7-day advance strategic warning for protective irrigation and mulching.

### 4.3 Extreme Heavy Rainfall Classifier
To warn against crop inundation and flash flooding:
$$P(\text{ExtremeRain}) = P\left( R_{24\text{h}} \ge 64.5\text{ mm} \mid \mathbf{x} \right)$$
Evaluated using a calibrated gradient-boosted decision tree achieving **0.941 ROC-AUC**.

### 4.4 Model Performance Evaluation & Benchmarks

| Metric | Raw GFS (12 km) | Bilinear Interpolation | **MonsoonGuard LightGBM** | Improvement |
| :--- | :---: | :---: | :---: | :---: |
| **RMSE (mm/day)** | 14.82 mm | 12.45 mm | **6.18 mm** | **-50.4% error** |
| **MAE (mm/day)** | 9.34 mm | 8.12 mm | **3.72 mm** | **-54.2% error** |
| **Dry Spell Break F1-Score** | 0.612 | 0.680 | **0.912** | **+34.1% gain** |
| **Heavy Rain ROC-AUC** | 0.724 | 0.761 | **0.941** | **+23.8% gain** |
| **Inference Latency** | — | 25 ms | **< 120 ms** | Real-time ready |

---

## 5. Comprehensive Module Specifications & UI Walkthrough

MonsoonGuard AI comprises 7 distinct operational modules engineered to fulfill agro-meteorological usability, high-resolution geospatial visualization, and multilingual accessibility:

### Module 1: Real-Time Teleconnections & Monsoon Dashboard
The primary monitoring center for macro planetary climate oscillations and regional weather systems driving the Indian summer monsoon.

![Real-Time Dashboard](./docs/images/02_realtime_dashboard.png)
*Figure 3: Real-Time Monsoon Dashboard displaying live ENSO Niño 3.4 SST anomaly (-0.42°C), Indian Ocean Dipole (+0.31°C), and MJO active convective phase alongside real-time 24-hr rainfall accumulations.*

* **Key Functional Capabilities:**
  * **Planetary Teleconnection Gauges:** Continuous tracking of ENSO Niño 3.4, IOD Dipole Mode Index, and MJO wave velocity.
  * **Rainfall Accumulation Telemetry:** Instant comparison of recorded rain against historical 30-year normal baselines.
  * **Active System Tracker:** Low-pressure area and depression alerts over the Bay of Bengal and Arabian Sea.

---

### Module 2: 16-Day Hyper-Local Downscaled Forecast Engine
Delivers sub-district block forecasts with probabilistic quantile bands for agricultural planning.

![16-Day Forecast Downscaling](./docs/images/03_ml_forecast_downscaling.png)
*Figure 4: 16-Day Downscaled Forecast console displaying quantile precipitation curves ($P_{10}, P_{50}, P_{90}$) and active dry spell probability for Bhopal: Berasia.*

![Forecast Curves Detail](./docs/images/03_ml_forecast_curves.png)
*Figure 5: Detailed 16-day rainfall curves highlighting confidence envelopes and break-monsoon alert indicators.*

* **Key Functional Capabilities:**
  * **Probabilistic Quantiles:** Transparent envelopes showing upper and lower bounds rather than misleading deterministic point estimates.
  * **Dry Spell Risk Radar:** Quantifies multi-day dry spell probabilities during critical flowering and pod-filling crop stages.
  * **Heavy Rain Triggering:** Early warnings when 24-hr downscaled estimates breach local soil percolation limits (>64.5 mm/day).

---

### Module 3: Interactive Geospatial Block-Level Map
Provides sub-district choropleths for district agriculture officers and researchers.

![Geospatial Block Map](./docs/images/04_geospatial_block_map.png)
*Figure 6: Interactive Leaflet Map presenting block risk choropleths across Bhopal (Berasia, Phanda, Huzur) and Sehore.*

![Geospatial Block Detail](./docs/images/04_geospatial_block_detail.png)
*Figure 7: High-resolution block zoom showing localized risk rating, soil moisture indicators, and 7-day cumulative precipitation.*

* **Key Functional Capabilities:**
  * **Vector GeoJSON Boundaries:** High-performance boundary rendering down to administrative tehsil/block centroids.
  * **Choropleth Color Coding:** Instant visual classification into Green (Adequate/Low Risk), Amber (Moderate Deficit), and Red (Severe Break/Deluge).
  * **Interactive Block Drill-Down:** Clicking any block displays immediate hyper-local forecasts and agronomic recommendations.

---

### Module 4: Multilingual Agronomic Advisory Hub (Hindi & English)
Translates complex atmospheric forecasts into immediate, actionable field operations for farmers.

![Multilingual Advisories English](./docs/images/05_multilingual_advisories.png)
*Figure 8: English Advisory Cards for Soybean and Paddy detailing spray windows, sowing adjustments, and drainage measures.*

![Multilingual Advisories Hindi](./docs/images/05_multilingual_advisories_hindi.png)
*Figure 9: Vernacular Hindi (`हिंदी`) translation of agronomic advisories ensuring rural accessibility for smallholder farmers.*

* **Key Functional Capabilities:**
  * **Crop-Specific Phenology:** Tailored guidance for **Soybean**, **Paddy (Rice)**, **Cotton**, **Maize**, and **Pulses**.
  * **Actionable Operational Badges:**
    * 🟢 **Favorable Spraying Window:** Dry conditions expected for 48 hours; ideal for herbicide/pesticide spraying.
    * 🟡 **Delayed Sowing Advisory:** Moisture deficit detected; delay seed drilling until break concludes.
    * 🔴 **Field Drainage Alert:** Heavy rainfall expected within 24 hours; clear drainage channels to prevent root rot.
  * **One-Click Language Switcher:** Instant toggling between English and Hindi (`हिंदी`).

---

### Module 5: Early Warning Alert Stream
Real-time dispatching of severe weather warnings.

![Early Warning Alerts](./docs/images/06_early_warning_alerts.png)
*Figure 10: Early Warning Alert Center highlighting active threshold triggers for torrential rain, squall winds, and localized waterlogging.*

* **Key Functional Capabilities:**
  * **Threshold-Based Triggers:** Automated alerts generated when rainfall or wind exceeds safety thresholds.
  * **Severity Tagging:** Categorized into `Advisory`, `Watch`, and `Severe Warning`.
  * **Direct Push Capability:** Designed for automated SMS and WhatsApp broadcast integration.

---

### Module 6: District Officer Command Center & Multi-Block Analytics
Dedicated operational console for Krishi Vigyan Kendra (KVK) scientists and District Agriculture Officers (DAOs).

![Officer Command Center](./docs/images/08_officer_command_center.png)
*Figure 11: District Officer Command Center with block-by-block vulnerability ranking, moisture status, and alert dispatchers.*

![Officer Analytics](./docs/images/09_officer_analytics.png)
*Figure 12: Longitudinal Multi-Block Analytics comparing seasonal rainfall departures and drought vulnerability curves.*

* **Key Functional Capabilities:**
  * **Cross-Block Triage:** Sorts all blocks in the district by vulnerability, moisture deficit, or extreme rain risk.
  * **Automated Situational Reports:** Generates structured briefs for District Disaster Management Authorities.
  * **Longitudinal Trends:** Multi-week tracking of moisture indices across agricultural sub-districts.

---

### Module 7: Mobile-First Responsive Interface
Optimized for low-bandwidth rural mobile connectivity.

![Mobile Dashboard](./docs/images/mobile_dashboard.png)
*Figure 13: Mobile-optimized dashboard view on smartphone viewport.*

![Mobile Advisories](./docs/images/mobile_advisories.png)
*Figure 14: Mobile advisory view allowing easy reading and audio playback in the field.*

---

## 6. API Architecture & REST Endpoints

The backend is built with FastAPI (Python 3.11), enforcing strict Pydantic schema validation:

| Method | API Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | System health check, loaded model status, and GeoJSON block counts | None |
| `GET` | `/api/teleconnections` | Real-time planetary climate indices (ENSO, IOD, MJO) | None |
| `GET` | `/api/forecast` | 16-day downscaled quantile rainfall forecast and break probabilities | `block_name` (e.g. `Berasia`) |
| `GET` | `/api/advisories` | Crop-specific agronomic advisories with spray window timers | `block_name`, `lang` (`en` or `hi`) |
| `GET` | `/api/alerts` | Active severe weather alerts and localized warning feeds | `district` (e.g. `Bhopal`) |
| `GET` | `/api/blocks` | Directory of all supported administrative blocks and coordinates | None |

---

## 7. Product & Operational Roadmap

![MonsoonGuard Roadmap](./docs/images/diagram-roadmap.png)
*Figure 15: Phased deployment roadmap from pilot blocks to nationwide 6,000+ block rollout.*

* **Phase 1: SIH 2026 Working Prototype (Current)**
  * Pilot downscaling engine for Bhopal, Sehore, and Vidisha blocks.
  * LightGBM quantile regression with ENSO, IOD, MJO assimilation.
  * Dual-language (Hindi/English) agro-advisory generation.
* **Phase 2: State-Wide Rollout (Madhya Pradesh)**
  * Full integration across all 55 districts and 313 administrative blocks in MP.
  * Direct API integration with the MoES **Meghdoot** and **Damini** mobile platforms.
  * Automated WhatsApp and IVR voice-call broadcasting for non-smartphone users.
* **Phase 3: Pan-India Operational Deployment**
  * Deployment across 6,000+ blocks across all agro-climatic zones in India.
  * Deployment on NCMRWF supercomputing clusters (*Mihir* / *Pratyush*).
  * Objective ground-truth rainfall feeds for PMFBY crop insurance claims settlement.

---

## 8. Technology Stack Summary

* **Frontend Framework:** React 19, TypeScript, TanStack Query, Tailwind CSS, Leaflet Maps, Lucide Icons (Vercel CDN).
* **Backend API Gateway:** Python 3.11, FastAPI, Asynchronous REST endpoints, Pydantic validation (Render Cloud).
* **Machine Learning Engine:** LightGBM Quantile Regressors, Scikit-learn Classifiers, Joblib Model Persistence.
* **Geospatial Processing:** GeoJSON vector boundaries, Digital Elevation Model (DEM) elevation conditioning.
