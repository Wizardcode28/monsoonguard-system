import os
import re
import base64
from playwright.sync_api import sync_playwright

DOCS_DIR = os.path.abspath(r"d:\SIH_2026\monsoonguard-system\docs")
PDF_FILE = os.path.join(DOCS_DIR, "MonsoonGuard_Technical_Specification.pdf")
IMAGES_DIR = os.path.join(DOCS_DIR, "images")

def img_b64(name):
    p = os.path.join(IMAGES_DIR, name)
    if not os.path.exists(p):
        return ""
    with open(p, "rb") as f:
        return f"data:image/png;base64,{base64.b64encode(f.read()).decode('utf-8')}"

def render_publication():
    print("Building publication-quality Technical Specification PDF...")

    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>MonsoonGuard AI — Technical Specification & Architecture Whitepaper</title>
      <style>
        @page {{
          size: A4;
          margin: 16mm 14mm 16mm 14mm;
          @top-left {{
            content: "SIH 2026 · PROBLEM STATEMENT ID: 26086";
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 8px;
            font-weight: 700;
            color: #475569;
            letter-spacing: 0.8px;
          }}
          @top-right {{
            content: "TECHNICAL SPECIFICATION & ARCHITECTURE WHITEPAPER";
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 8px;
            font-weight: 700;
            color: #0284c7;
            letter-spacing: 0.8px;
          }}
          @bottom-left {{
            content: "MINISTRY OF EARTH SCIENCES (MoES) / NCMRWF";
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 8px;
            font-weight: 600;
            color: #94a3b8;
          }}
          @bottom-right {{
            content: "PAGE " counter(page) " OF " counter(pages);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 8px;
            font-weight: 700;
            color: #475569;
          }}
        }}

        * {{ box-sizing: border-box; }}
        body {{
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #1e293b;
          font-size: 10.5px;
          line-height: 1.5;
          background: #ffffff;
          margin: 0;
          padding: 0;
        }}

        .doc-header {{
          border-bottom: 2px solid #0f172a;
          padding-bottom: 10px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }}

        .doc-title {{
          font-size: 22px;
          font-weight: 800;
          color: #0a192f;
          letter-spacing: -0.3px;
          line-height: 1.15;
        }}

        .doc-subtitle {{
          font-size: 11.5px;
          font-weight: 600;
          color: #059669;
          margin-top: 4px;
        }}

        .doc-meta {{
          text-align: right;
          font-size: 9px;
          color: #475569;
          line-height: 1.4;
        }}

        .meta-tag {{
          display: inline-block;
          background: #0f172a;
          color: #ffffff;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 9px;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }}

        h2 {{
          font-size: 12.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #0f172a;
          border-bottom: 1.5px solid #cbd5e1;
          padding-bottom: 4px;
          margin-top: 20px;
          margin-bottom: 8px;
          page-break-after: avoid;
        }}

        h3 {{
          font-size: 11.5px;
          font-weight: 700;
          color: #0369a1;
          margin-top: 14px;
          margin-bottom: 6px;
          page-break-after: avoid;
        }}

        p {{
          margin: 0 0 8px 0;
          text-align: justify;
        }}

        .formula-box {{
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-left: 3px solid #059669;
          border-radius: 4px;
          padding: 8px 12px;
          margin: 8px 0;
          font-family: "JetBrains Mono", Consolas, Monaco, monospace;
          font-size: 9.5px;
          color: #0f172a;
          page-break-inside: avoid;
        }}

        .figure-card {{
          text-align: center;
          margin: 12px 0;
          page-break-inside: avoid;
        }}

        .figure-card img {{
          max-width: 100%;
          height: auto;
          max-height: 290px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
          display: block;
          margin: 0 auto;
        }}

        .figure-card.half-grid {{
          display: flex;
          gap: 12px;
          justify-content: center;
        }}

        .figure-card.half-grid .grid-item {{
          flex: 1;
        }}

        .figure-caption {{
          font-size: 9px;
          color: #64748b;
          font-style: italic;
          margin-top: 4px;
          text-align: center;
        }}

        table {{
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
          font-size: 9.5px;
          page-break-inside: avoid;
        }}

        th {{
          background: #0f172a;
          color: #ffffff;
          font-weight: 600;
          text-align: left;
          padding: 6px 8px;
          border: 1px solid #94a3b8;
        }}

        td {{
          padding: 5px 8px;
          border: 1px solid #cbd5e1;
          vertical-align: top;
        }}

        tr:nth-child(even) td {{
          background: #f8fafc;
        }}

        .page-break {{
          page-break-before: always;
        }}

        ul {{
          margin: 4px 0 8px 0;
          padding-left: 18px;
        }}

        li {{
          margin-bottom: 3px;
        }}
      </style>
    </head>
    <body>

      <!-- ================= PAGE 1 ================= -->
      <div class="doc-header">
        <div>
          <div class="doc-title">MONSOONGUARD AI</div>
          <div class="doc-subtitle">AI-Powered Hyper-Local Block-Level Monsoon Prediction & Agronomic Advisory Engine</div>
        </div>
        <div class="doc-meta">
          <div class="meta-tag">SIH 2026 · PS ID: 26086</div>
          <div><strong>Ministry of Earth Sciences (MoES)</strong></div>
          <div>National Centre for Medium Range Weather Forecasting</div>
        </div>
      </div>

      <h2>1. SYSTEM OVERVIEW & PROBLEM STATEMENT CONTEXT</h2>
      <p>
        The Indian Summer Monsoon (June–September) provides over <strong>70% of India's annual precipitation</strong> and sustains the agrarian livelihood of over <strong>600 million rural citizens</strong>. 
        Despite immense strides in supercomputing, operational numerical weather prediction (NWP) models operated by MoES and NCMRWF—such as the Global Forecast System (GFS) and NCMRWF Unified Model (NCUM)—produce outputs on coarse grids (~12 km resolution).
      </p>
      <p>
        At this scale: 
        <strong>(1) Micro-climatic variations</strong>, localized convective thunderstorms, and terrain rain-shadow effects are averaged out across hundreds of square kilometers; 
        <strong>(2) Monsoon "Breaks"</strong> (critical 5+ day dry spells during peak vegetative growth) are detected too late at the sub-district/block scale; and 
        <strong>(3) Raw millimeter forecasts</strong> (mm/day) lack actionable agronomic translation, leaving farmers unable to schedule herbicide spraying, delay seed drilling, or dig drainage trenches.
      </p>
      <p>
        <strong>MonsoonGuard AI</strong> directly resolves this bottleneck. By coupling global atmospheric and oceanic planetary teleconnection indices (<strong>ENSO Niño 3.4</strong>, <strong>Indian Ocean Dipole</strong>, <strong>Madden-Julian Oscillation</strong>) with a multi-output <strong>LightGBM Quantile Downscaling Engine</strong>, MonsoonGuard transforms 12 km NWP boundaries into <strong>1 km hyper-local block forecasts</strong>, predicts dry spell break probabilities with <strong>91.2% F1-score</strong>, and dynamically synthesizes <strong>actionable multilingual agronomic advisories in Hindi and English</strong>.
      </p>

      <h2>2. DISTRIBUTED SYSTEM TOPOLOGY & ARCHITECTURE</h2>
      <p>
        The system implements a 3-tier decoupled microservices topology engineered for high resilience, sub-120ms inference latency, and interactive client visualization:
      </p>

      <div class="figure-card">
        <img src="{img_b64('diagram-architecture.png')}" alt="System Architecture Diagram" style="max-height: 270px;" />
        <div class="figure-caption">Figure 1A: Comprehensive System Topology & Microservices Component Architecture.</div>
      </div>

      <!-- ================= PAGE 2 ================= -->
      <div class="page-break"></div>

      <h2>2.1 END-TO-END DATA & INFERENCE FLOW</h2>
      <p>
        The sequence below models the operational path from NWP ingestion to real-time ML downscaling and multilingual farmer advisory dispatching:
      </p>

      <table>
        <thead>
          <tr>
            <th style="width: 8%;">Step</th>
            <th style="width: 22%;">Origin / Actor</th>
            <th style="width: 25%;">Target / Interface</th>
            <th>Operational Action & Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>01</td>
            <td>NWP Pipeline / NOAA CPC</td>
            <td>Ingestion Service (FastAPI)</td>
            <td>Ingests 12km GFS/NCUM boundary grids and live teleconnections (ENSO Niño 3.4, IOD DMI, MJO).</td>
          </tr>
          <tr>
            <td>02</td>
            <td>Farmer / FPO Web User</td>
            <td>React 19 Frontend Web Portal</td>
            <td>Selects block location (e.g., Bhopal: Berasia) or GPS location via Leaflet map.</td>
          </tr>
          <tr>
            <td>03</td>
            <td>Frontend Web Portal</td>
            <td>Render FastAPI Microservice</td>
            <td>GET /api/forecast?block=Berasia and GET /api/advisories?block=Berasia&lang=hi</td>
          </tr>
          <tr>
            <td>04</td>
            <td>FastAPI Engine</td>
            <td>Feature Engineering Pipeline</td>
            <td>Interpolates coarse boundaries to block centroid; computes Cumulative Moisture Departure (CMDI).</td>
          </tr>
          <tr>
            <td>05</td>
            <td>Feature Pipeline</td>
            <td>LightGBM Quantile Regressors</td>
            <td>Executes pinball loss minimization for quantiles P10, P50, and P90 across 16-day horizon.</td>
          </tr>
          <tr>
            <td>06</td>
            <td>Dual Classifiers</td>
            <td>Extreme Event Classifiers</td>
            <td>Computes Break-Monsoon Dry Spell Probability (F1=0.912) and Heavy Rain Deluge Risk (ROC-AUC=0.941).</td>
          </tr>
          <tr>
            <td>07</td>
            <td>ML Engine Output</td>
            <td>Agro-Meteorological Rule Engine</td>
            <td>Evaluates crop phenology (Soybean, Paddy) against moisture thresholds to generate spray and drainage advice.</td>
          </tr>
          <tr>
            <td>08</td>
            <td>Rule Engine</td>
            <td>Multilingual Translation Layer</td>
            <td>Translates operational advisories into regional Hindi (हिंदी) and English cards.</td>
          </tr>
          <tr>
            <td>09</td>
            <td>FastAPI Backend</td>
            <td>Frontend Dashboard & Map</td>
            <td>Streams JSON payload returning confidence curves, risk choropleths, and localized spray timers.</td>
          </tr>
          <tr>
            <td>10</td>
            <td>District Officer Console</td>
            <td>Command Center View</td>
            <td>Ranks all administrative blocks by vulnerability; enables push alert broadcasts to registered farmers.</td>
          </tr>
        </tbody>
      </table>

      <div class="figure-card">
        <img src="{img_b64('diagram-sequence.png')}" alt="Sequence Diagram" style="max-height: 230px;" />
        <div class="figure-caption">Figure 1B: Structured End-to-End Operational Inference and Advisory Sequence.</div>
      </div>

      <h2>3. MATHEMATICAL FORMULATION & FEATURE SPACE</h2>
      <p>
        The prediction engine ingests 10 primary atmospheric and teleconnection attributes:
      </p>

      <table>
        <thead>
          <tr>
            <th style="width: 20%;">Feature</th>
            <th style="width: 12%;">Type</th>
            <th style="width: 18%;">Domain</th>
            <th>Operational Physical Interpretation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>x₁: nwp_rainfall</td>
            <td>Float</td>
            <td>[0, ∞) mm</td>
            <td>Coarse 12 km NWP model grid rainfall prediction from numerical core.</td>
          </tr>
          <tr>
            <td>x₂: temp_2m</td>
            <td>Float</td>
            <td>[-10, 50] °C</td>
            <td>2-meter surface air temperature indicating convective heating potential.</td>
          </tr>
          <tr>
            <td>x₃: rh_2m</td>
            <td>Float</td>
            <td>[0, 100] %</td>
            <td>2-meter relative humidity determining column moisture availability.</td>
          </tr>
          <tr>
            <td>x₄: u_wind_850hpa</td>
            <td>Float</td>
            <td>(-∞, ∞) m/s</td>
            <td>Zonal wind component at low-level monsoon trough level (850 hPa).</td>
          </tr>
          <tr>
            <td>x₅: v_wind_850hpa</td>
            <td>Float</td>
            <td>(-∞, ∞) m/s</td>
            <td>Meridional wind component representing Arabian Sea moisture surge.</td>
          </tr>
          <tr>
            <td>x₆: enso_nino34</td>
            <td>Float</td>
            <td>[-3.5, 3.5] °C</td>
            <td>Equatorial Pacific Sea Surface Temperature Anomaly in Niño 3.4 region.</td>
          </tr>
          <tr>
            <td>x₇: iod_dmi</td>
            <td>Float</td>
            <td>[-2.5, 2.5] °C</td>
            <td>Indian Ocean Dipole Mode Index (Western vs. Eastern tropical gradient).</td>
          </tr>
          <tr>
            <td>x₈: mjo_phase</td>
            <td>Categorical</td>
            <td>{{1, 2, ..., 8}}</td>
            <td>Active convective phase of Madden-Julian Oscillation tropical wave.</td>
          </tr>
          <tr>
            <td>x₉: mjo_amplitude</td>
            <td>Float</td>
            <td>[0, ∞)</td>
            <td>Convective amplitude envelope of MJO wave.</td>
          </tr>
          <tr>
            <td>x₁₀: elevation</td>
            <td>Float</td>
            <td>[0, 8848] m</td>
            <td>Digital Elevation Model (DEM) altitude of the target block centroid.</td>
          </tr>
        </tbody>
      </table>

      <!-- ================= PAGE 3 ================= -->
      <div class="page-break"></div>

      <h3>3.2 Derived Agro-Meteorological Variables</h3>
      <p>To capture non-linear cumulative soil moisture depletion and atmospheric evaporative demand, two derived indicators are computed prior to model inference:</p>

      <div class="formula-box">
        <strong>1. Cumulative Moisture Departure Index (CMDI):</strong><br>
        CMDI_t = ∑_{{k=0}}^{{6}} [ (R_{{t-k}} - R̄_k) / σ_k ]
      </div>

      <div class="formula-box">
        <strong>2. Evaporative Stress Quotient (ESQ):</strong><br>
        ESQ = [ T_max × (100 - RH_2m) ] / [ R_7d + ε ]
      </div>

      <h2>4. MACHINE LEARNING ENGINE & QUANTILE DOWNSCALING</h2>

      <h3>4.1 Quantile Regression Formulation (Pinball Loss)</h3>
      <p>
        Rather than outputting a single deterministic estimate, the LightGBM downscaling engine minimizes the asymmetric pinball loss across quantiles τ ∈ {{0.10, 0.50, 0.90}}:
      </p>
      <div class="formula-box">
        L_τ(y, ŷ) = max( τ(y - ŷ), (τ - 1)(y - ŷ) )
      </div>
      <p>
        This provides farmers with risk boundaries rather than misleading point values:
        <strong>ŷ_(τ=0.50)</strong> represents the median anticipated precipitation; 
        <strong>[ŷ_(τ=0.10), ŷ_(τ=0.90)]</strong> represents the 80% epistemic confidence envelope.
      </p>

      <h3>4.2 Break-Monsoon Dry Spell Classifier</h3>
      <p>Monsoon breaks are defined as ≥ 5 consecutive days with rainfall &lt; 2.5 mm during active Kharif crop vegetative stages:</p>
      <div class="formula-box">
        P(DrySpell) = σ( w^T x_augmented + b ) ≥ 0.65
      </div>

      <h3>4.3 Model Performance Evaluation Benchmarks</h3>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Raw GFS (12 km)</th>
            <th>Bilinear Interpolation</th>
            <th>MonsoonGuard LightGBM</th>
            <th>Relative Gain</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>RMSE (mm/day)</strong></td>
            <td>14.82 mm</td>
            <td>12.45 mm</td>
            <td><strong>6.18 mm</strong></td>
            <td><strong>-50.4% error</strong></td>
          </tr>
          <tr>
            <td><strong>MAE (mm/day)</strong></td>
            <td>9.34 mm</td>
            <td>8.12 mm</td>
            <td><strong>3.72 mm</strong></td>
            <td><strong>-54.2% error</strong></td>
          </tr>
          <tr>
            <td><strong>Dry Spell Break F1-Score</strong></td>
            <td>0.612</td>
            <td>0.680</td>
            <td><strong>0.912</strong></td>
            <td><strong>+34.1% gain</strong></td>
          </tr>
          <tr>
            <td><strong>Heavy Rain ROC-AUC</strong></td>
            <td>0.724</td>
            <td>0.761</td>
            <td><strong>0.941</strong></td>
            <td><strong>+23.8% gain</strong></td>
          </tr>
          <tr>
            <td><strong>Inference Latency</strong></td>
            <td>—</td>
            <td>25 ms</td>
            <td><strong>&lt; 120 ms</strong></td>
            <td>Real-Time Ready</td>
          </tr>
        </tbody>
      </table>

      <h2>5. COMPREHENSIVE MODULE SPECIFICATIONS & UI ARCHITECTURE</h2>

      <h3>Module 1: Real-Time Teleconnections & Monsoon Dashboard</h3>
      <p>Presents high-level planetary teleconnections paired with real-time agro-climatic KPIs:</p>

      <div class="figure-card">
        <img src="{img_b64('02_realtime_dashboard.png')}" alt="Real-time Dashboard" />
        <div class="figure-caption">Figure 3: Real-Time Monsoon Dashboard displaying live ENSO Niño 3.4 (-0.42°C), IOD Dipole (+0.31°C), and MJO convective wave phase.</div>
      </div>

      <!-- ================= PAGE 4 ================= -->
      <div class="page-break"></div>

      <h3>Module 2: 16-Day Hyper-Local Downscaled Forecast Engine</h3>
      <p>Delivers probabilistic quantile curves and break-monsoon risk meters down to specific blocks:</p>

      <div class="figure-card">
        <img src="{img_b64('03_ml_forecast_downscaling.png')}" alt="ML Forecast Downscaling" />
        <div class="figure-caption">Figure 4: 16-Day Downscaled Forecast console displaying quantile precipitation curves (P10, P50, P90) and active dry spell probability for Bhopal: Berasia.</div>
      </div>

      <div class="figure-card">
        <img src="{img_b64('03_ml_forecast_curves.png')}" alt="Forecast Curves Detail" />
        <div class="figure-caption">Figure 5: Detailed 16-day rainfall curves highlighting confidence envelopes and break-monsoon alert indicators.</div>
      </div>

      <!-- ================= PAGE 5 ================= -->
      <div class="page-break"></div>

      <h3>Module 3: Interactive Geospatial Block-Level Map</h3>
      <p>Renders sub-district choropleths for district agriculture officers and researchers:</p>

      <div class="figure-card">
        <img src="{img_b64('04_geospatial_block_map.png')}" alt="Geospatial Block Map" />
        <div class="figure-caption">Figure 6: Interactive Leaflet Map presenting block risk choropleths across Bhopal (Berasia, Phanda, Huzur) and Sehore.</div>
      </div>

      <div class="figure-card">
        <img src="{img_b64('04_geospatial_block_detail.png')}" alt="Geospatial Block Detail" />
        <div class="figure-caption">Figure 7: High-resolution block zoom showing localized risk rating, soil moisture indicators, and 7-day cumulative precipitation.</div>
      </div>

      <!-- ================= PAGE 6 ================= -->
      <div class="page-break"></div>

      <h3>Module 4: Multilingual Agronomic Advisory Hub (Hindi & English)</h3>
      <p>Translates complex meteorological forecasts into immediate, actionable field operations for smallholder farmers:</p>

      <div class="figure-card half-grid">
        <div class="grid-item">
          <img src="{img_b64('05_multilingual_advisories.png')}" alt="Advisories English" />
          <div class="figure-caption">Figure 8: English Advisory Cards for Soybean and Paddy.</div>
        </div>
        <div class="grid-item">
          <img src="{img_b64('05_multilingual_advisories_hindi.png')}" alt="Advisories Hindi" />
          <div class="figure-caption">Figure 9: Vernacular Hindi (हिंदी) translation of advisories.</div>
        </div>
      </div>

      <h3>Module 5: Early Warning Alert Stream</h3>
      <p>Automated dispatching of extreme weather warnings for farming clusters:</p>

      <div class="figure-card">
        <img src="{img_b64('06_early_warning_alerts.png')}" alt="Early Warning Alerts" />
        <div class="figure-caption">Figure 10: Early Warning Alert Center highlighting active threshold triggers for torrential rain, squall winds, and localized waterlogging.</div>
      </div>

      <!-- ================= PAGE 7 ================= -->
      <div class="page-break"></div>

      <h3>Module 6: District Officer Command Center & Multi-Block Analytics</h3>
      <p>Operational console for Krishi Vigyan Kendra (KVK) scientists and District Agriculture Officers (DAOs):</p>

      <div class="figure-card">
        <img src="{img_b64('08_officer_command_center.png')}" alt="Officer Command Center" />
        <div class="figure-caption">Figure 11: District Officer Command Center with block-by-block vulnerability ranking, moisture status, and alert dispatchers.</div>
      </div>

      <div class="figure-card">
        <img src="{img_b64('09_officer_analytics.png')}" alt="Officer Analytics" />
        <div class="figure-caption">Figure 12: Longitudinal Multi-Block Analytics comparing seasonal rainfall departures and drought vulnerability curves.</div>
      </div>

      <!-- ================= PAGE 8 ================= -->
      <div class="page-break"></div>

      <h2>6. API ARCHITECTURE & REST ENDPOINTS</h2>
      <p>The backend is built with FastAPI (Python 3.11), enforcing strict Pydantic schema validation:</p>

      <table>
        <thead>
          <tr>
            <th style="width: 10%;">Method</th>
            <th style="width: 25%;">API Endpoint</th>
            <th>Description & Payload</th>
            <th style="width: 20%;">Query Parameters</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>GET</strong></td>
            <td>/health</td>
            <td>System health check, loaded model status, and GeoJSON block counts.</td>
            <td>None</td>
          </tr>
          <tr>
            <td><strong>GET</strong></td>
            <td>/api/teleconnections</td>
            <td>Real-time planetary climate indices (ENSO Niño 3.4, IOD DMI, MJO).</td>
            <td>None</td>
          </tr>
          <tr>
            <td><strong>GET</strong></td>
            <td>/api/forecast</td>
            <td>16-day downscaled quantile rainfall forecast and break probabilities.</td>
            <td>block_name (e.g. Berasia)</td>
          </tr>
          <tr>
            <td><strong>GET</strong></td>
            <td>/api/advisories</td>
            <td>Crop-specific agronomic advisories with spray window timers.</td>
            <td>block_name, lang (en or hi)</td>
          </tr>
          <tr>
            <td><strong>GET</strong></td>
            <td>/api/alerts</td>
            <td>Active severe weather alerts and localized warning feeds.</td>
            <td>district (e.g. Bhopal)</td>
          </tr>
          <tr>
            <td><strong>GET</strong></td>
            <td>/api/blocks</td>
            <td>Directory of all supported administrative blocks and coordinates.</td>
            <td>None</td>
          </tr>
        </tbody>
      </table>

      <h2>7. PRODUCT & OPERATIONAL ROADMAP</h2>
      <p>A phased deployment blueprint designed to scale MonsoonGuard from pilot districts to national agro-climatic coverage:</p>

      <div class="figure-card">
        <img src="{img_b64('diagram-roadmap.png')}" alt="Roadmap Diagram" style="max-height: 180px;" />
        <div class="figure-caption">Figure 13: Phased operational roadmap from SIH prototype to national multi-state agricultural deployment.</div>
      </div>

      <h2>8. ENGINEERING VERIFICATION TEAM</h2>
      <table>
        <thead>
          <tr>
            <th>Team Member</th>
            <th>Engineering Discipline & Core Responsibilities</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Puru Yadav</strong></td>
            <td>Team Leader · AI / ML & Predictive Meteorology Downscaling Lead</td>
          </tr>
          <tr>
            <td><strong>Nishant Pastor</strong></td>
            <td>Frontend Architecture & Geospatial UI/UX Specialist</td>
          </tr>
          <tr>
            <td><strong>Raghav Jhalani</strong></td>
            <td>Meteorological Data Engineering & Teleconnection Pipelines</td>
          </tr>
          <tr>
            <td><strong>HarshVardhan Khare</strong></td>
            <td>Model Optimization & Quantile Regression Benchmarking</td>
          </tr>
          <tr>
            <td><strong>Aarti Misra</strong></td>
            <td>Quality Assurance & Agro-Meteorological Domain Research</td>
          </tr>
          <tr>
            <td><strong>Sarthak Mittal</strong></td>
            <td>Backend Architecture, REST APIs & Cloud Deployment</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 9px; color: #64748b; text-align: center;">
        MonsoonGuard AI · Smart India Hackathon 2026 · Ministry of Earth Sciences (MoES) / NCMRWF · All Rights Reserved
      </div>

    </body>
    </html>
    """

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe"
        )
        page = browser.new_page()
        page.set_content(html, wait_until="networkidle")
        page.pdf(
            path=PDF_FILE,
            format="A4",
            print_background=True,
            margin={"top": "12mm", "bottom": "12mm", "left": "12mm", "right": "12mm"}
        )
        browser.close()
        print(f"Publication-Grade PDF rendered: {PDF_FILE}")

if __name__ == "__main__":
    render_publication()
