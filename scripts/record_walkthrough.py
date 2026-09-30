import os
import time
from playwright.sync_api import sync_playwright

OUT_DIR = os.path.abspath(r"d:\SIH_2026\monsoonguard-system\docs\videos\frames")
BASE_URL = "https://monsoonguard-system.vercel.app"

STAGES = [
    {
        "url": f"{BASE_URL}/",
        "title": "MonsoonGuard AI — SIH 2026",
        "subtitle": "AI-Powered Hyper-Local Monsoon Prediction & Agronomic Advisory Engine",
        "scrolls": 2,
        "wait": 3000
    },
    {
        "url": f"{BASE_URL}/dashboard",
        "title": "Real-Time Monsoon Dashboard",
        "subtitle": "Global Teleconnection Gauges: ENSO Niño 3.4, IOD Dipole & MJO Waves",
        "scrolls": 3,
        "wait": 3500
    },
    {
        "url": f"{BASE_URL}/forecast",
        "title": "16-Day Machine Learning Downscaled Forecast",
        "subtitle": "Quantile Rainfall Ensembles (P10, P50, P90) & Break-Monsoon Dry Spell Radar",
        "scrolls": 4,
        "wait": 3500
    },
    {
        "url": f"{BASE_URL}/map",
        "title": "Interactive Geospatial Block Choropleths",
        "subtitle": "Hyper-Local Sub-District Risk Heatmaps & Agro-Climatic Boundaries",
        "scrolls": 2,
        "wait": 4500
    },
    {
        "url": f"{BASE_URL}/advisories",
        "title": "Multilingual Agronomic Advisory Hub",
        "subtitle": "Actionable Spray Windows, Sowing Timelines & Drainage Alerts in Hindi & English",
        "scrolls": 3,
        "wait": 3500
    },
    {
        "url": f"{BASE_URL}/alerts",
        "title": "Early Warning Weather Alert Stream",
        "subtitle": "Severe Storm & Torrential Precipitation Warnings for Farming Clusters",
        "scrolls": 2,
        "wait": 3000
    },
    {
        "url": f"{BASE_URL}/officer",
        "title": "District Agriculture Officer Command Center",
        "subtitle": "Administrative Oversight, Threshold Triggers & Multi-Block Vulnerability Triage",
        "scrolls": 3,
        "wait": 3500
    },
    {
        "url": f"{BASE_URL}/officer/analytics",
        "title": "Multi-Block Longitudinal Analytics",
        "subtitle": "Comparative Moisture Deficit & Historical Seasonal Inundation Trends",
        "scrolls": 3,
        "wait": 3500
    }
]

def record_frames():
    os.makedirs(OUT_DIR, exist_ok=True)
    frame_count = 0

    with sync_playwright() as p:
        print("Launching Chromium for video walkthrough capture...")
        browser = p.chromium.launch(
            headless=True,
            executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            args=["--no-sandbox", "--disable-setuid-sandbox"]
        )
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=1.0
        )
        page = context.new_page()

        for s_idx, stage in enumerate(STAGES):
            print(f"Recording Stage {s_idx + 1}/{len(STAGES)}: {stage['title']}...")
            page.goto(stage["url"], wait_until="networkidle", timeout=60000)
            time.sleep(stage["wait"] / 1000.0)

            # Inject sleek SIH overlay banner
            page.evaluate("""({title, subtitle}) => {
                const old = document.getElementById("monsoon-demo-overlay");
                if (old) old.remove();

                const banner = document.createElement("div");
                banner.id = "monsoon-demo-overlay";
                banner.style.position = "fixed";
                banner.style.bottom = "24px";
                banner.style.left = "28px";
                banner.style.zIndex = "999999";
                banner.style.background = "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(5, 150, 105, 0.92))";
                banner.style.backdropFilter = "blur(12px)";
                banner.style.color = "#FFFFFF";
                banner.style.padding = "14px 22px";
                banner.style.borderRadius = "12px";
                banner.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.15)";
                banner.style.fontFamily = "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
                banner.style.maxWidth = "700px";
                banner.style.pointerEvents = "none";

                banner.innerHTML = `
                  <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #6ee7b7; font-weight: 700; margin-bottom: 3px;">
                    Smart India Hackathon 2026 · PS ID: 26086 (MoES / NCMRWF)
                  </div>
                  <div style="font-size: 19px; font-weight: 800; color: #FFFFFF; line-height: 1.25; margin-bottom: 4px;">
                    ${title}
                  </div>
                  <div style="font-size: 13px; color: #cbd5e1; font-weight: 400; line-height: 1.4;">
                    ${subtitle}
                  </div>
                `;
                document.body.appendChild(banner);
            }""", {"title": stage["title"], "subtitle": stage["subtitle"]})

            # Capture baseline frame (3 times)
            for _ in range(3):
                frame_path = os.path.join(OUT_DIR, f"frame_{frame_count:04d}.png")
                page.screenshot(path=frame_path)
                frame_count += 1

            # Incremental smooth scrolls
            for step in range(1, stage["scrolls"] + 1):
                page.evaluate(f"window.scrollBy(0, 220);")
                time.sleep(0.4)
                for _ in range(2):
                    frame_path = os.path.join(OUT_DIR, f"frame_{frame_count:04d}.png")
                    page.screenshot(path=frame_path)
                    frame_count += 1

            # Hold at scrolled position
            time.sleep(0.5)
            for _ in range(2):
                frame_path = os.path.join(OUT_DIR, f"frame_{frame_count:04d}.png")
                page.screenshot(path=frame_path)
                frame_count += 1

        browser.close()
        print(f"Captured {frame_count} total frames in {OUT_DIR}")

if __name__ == "__main__":
    record_frames()
