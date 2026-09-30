import os
import time
from playwright.sync_api import sync_playwright

OUT_DIR = os.path.abspath(r"d:\SIH_2026\monsoonguard-system\docs\images")
BASE_URL = "https://monsoonguard-system.vercel.app"

def capture_features():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            args=["--no-sandbox", "--disable-setuid-sandbox"]
        )
        context = browser.new_context(
            viewport={"width": 1600, "height": 1050},
            device_scale_factor=1.5
        )
        page = context.new_page()

        # 1. Advisories Hindi
        print("Capturing Hindi advisories...")
        page.goto(f"{BASE_URL}/advisories", wait_until="networkidle", timeout=45000)
        time.sleep(3)
        # click Hindi toggle if present
        try:
            hindi_btn = page.locator("button:has-text('हिंदी'), button:has-text('Hindi')").first
            if hindi_btn.is_visible():
                hindi_btn.click()
                time.sleep(1.5)
        except Exception as e:
            print("Hindi toggle error:", e)
        page.screenshot(path=os.path.join(OUT_DIR, "05_multilingual_advisories_hindi.png"))
        print("Captured Hindi Advisories!")

        # 2. Map zoomed on Berasia
        print("Capturing Map zoomed...")
        page.goto(f"{BASE_URL}/map", wait_until="networkidle", timeout=45000)
        time.sleep(4)
        # Click on one of the block cards or map popups
        try:
            berasia_badge = page.locator("text=Berasia").first
            if berasia_badge.is_visible():
                berasia_badge.click()
                time.sleep(2)
        except Exception as e:
            print("Map click error:", e)
        page.screenshot(path=os.path.join(OUT_DIR, "04_geospatial_block_detail.png"))
        print("Captured Map Detail!")

        # 3. Forecast Dry Spell Detail
        print("Capturing Forecast Dry Spell curves...")
        page.goto(f"{BASE_URL}/forecast", wait_until="networkidle", timeout=45000)
        time.sleep(3)
        page.evaluate("window.scrollBy(0, 450)")
        time.sleep(1.5)
        page.screenshot(path=os.path.join(OUT_DIR, "03_ml_forecast_curves.png"))
        print("Captured Forecast Curves!")

        browser.close()

if __name__ == "__main__":
    capture_features()
