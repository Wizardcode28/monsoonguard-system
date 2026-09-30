import os
import time
from playwright.sync_api import sync_playwright

OUT_DIR = os.path.abspath(r"d:\SIH_2026\monsoonguard-system\docs\images")
BASE_URL = "https://monsoonguard-system.vercel.app"

PAGES_TO_CAPTURE = [
    {"name": "01_hero_landing.png", "path": "/", "wait": 3000},
    {"name": "02_realtime_dashboard.png", "path": "/dashboard", "wait": 4000},
    {"name": "03_ml_forecast_downscaling.png", "path": "/forecast", "wait": 4000},
    {"name": "04_geospatial_block_map.png", "path": "/map", "wait": 5000},
    {"name": "05_multilingual_advisories.png", "path": "/advisories", "wait": 4000},
    {"name": "06_early_warning_alerts.png", "path": "/alerts", "wait": 3500},
    {"name": "07_block_locations_matrix.png", "path": "/locations", "wait": 3500},
    {"name": "08_officer_command_center.png", "path": "/officer", "wait": 4000},
    {"name": "09_officer_analytics.png", "path": "/officer/analytics", "wait": 4000},
    {"name": "10_admin_infrastructure.png", "path": "/officer/infrastructure", "wait": 4000},
    {"name": "11_historical_trends.png", "path": "/officer/historical", "wait": 4000},
]

def capture_all():
    print(f"Target Directory: {OUT_DIR}")
    os.makedirs(OUT_DIR, exist_ok=True)
    
    with sync_playwright() as p:
        print("Launching Chromium...")
        browser = p.chromium.launch(
            headless=True,
            executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            args=["--no-sandbox", "--disable-setuid-sandbox"]
        )
        context = browser.new_context(
            viewport={"width": 1600, "height": 950},
            device_scale_factor=1.5
        )
        page = context.new_page()

        for item in PAGES_TO_CAPTURE:
            url = f"{BASE_URL}{item['path']}"
            filename = item['name']
            filepath = os.path.join(OUT_DIR, filename)
            print(f"Capturing: {url} -> {filename}")
            try:
                page.goto(url, wait_until="networkidle", timeout=60000)
                time.sleep(item['wait'] / 1000.0)
                
                # Scroll slightly down and back up to trigger lazy components if any
                page.evaluate("window.scrollBy(0, 300)")
                time.sleep(0.5)
                page.evaluate("window.scrollTo(0, 0)")
                time.sleep(0.5)

                page.screenshot(path=filepath, full_page=False)
                print(f"  [OK] Saved {filepath}")
            except Exception as e:
                print(f"  [ERROR] Failed to capture {url}: {e}")

        # Also capture Mobile view of the Dashboard & Advisories for documentation
        mobile_context = browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=2
        )
        mobile_page = mobile_context.new_page()
        for mob_item in [
            {"name": "mobile_dashboard.png", "path": "/dashboard"},
            {"name": "mobile_advisories.png", "path": "/advisories"}
        ]:
            url = f"{BASE_URL}{mob_item['path']}"
            filepath = os.path.join(OUT_DIR, mob_item['name'])
            try:
                mobile_page.goto(url, wait_until="networkidle", timeout=45000)
                time.sleep(3)
                mobile_page.screenshot(path=filepath, full_page=False)
                print(f"  [OK Mobile] Saved {filepath}")
            except Exception as e:
                print(f"  [ERROR Mobile] {e}")

        browser.close()
        print("All screenshots successfully captured!")

if __name__ == "__main__":
    capture_all()
