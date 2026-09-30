import os
import re
from playwright.sync_api import sync_playwright

DOCS_DIR = os.path.abspath(r"d:\SIH_2026\monsoonguard-system\docs")
MD_FILE = os.path.join(DOCS_DIR, "TECHNICAL_SPECIFICATION.md")
PDF_FILE = os.path.join(DOCS_DIR, "MonsoonGuard_Technical_Specification.pdf")

def generate_pdf():
    print(f"Reading {MD_FILE}...")
    with open(MD_FILE, "r", encoding="utf-8") as f:
        md_text = f.read()

    # Basic markdown parsing
    html_body = md_text
    html_body = re.sub(r'^### (.*$)', r'<h3 style="color:#0f172a; margin-top:20px; margin-bottom:8px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">\1</h3>', html_body, flags=re.MULTILINE)
    html_body = re.sub(r'^## (.*$)', r'<h2 style="color:#0369a1; margin-top:24px; margin-bottom:12px; border-bottom:2px solid #bae6fd; padding-bottom:6px;">\1</h2>', html_body, flags=re.MULTILINE)
    html_body = re.sub(r'^# (.*$)', r'<h1 style="color:#0f172a; margin-top:10px; margin-bottom:14px; font-size:24px;">\1</h1>', html_body, flags=re.MULTILINE)
    html_body = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html_body)
    html_body = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html_body)
    html_body = re.sub(r'```mermaid[\s\S]*?```', r'<p style="background:#f1f5f9; padding:8px; border-radius:4px; font-style:italic; color:#64748b;">[System Architectural Diagram Embedded in Section 2]</p>', html_body)
    html_body = re.sub(r'```([\s\S]*?)```', r'<pre style="background:#0f172a; color:#f8fafc; padding:12px; border-radius:6px; font-size:11px; overflow-x:auto;">\1</pre>', html_body)
    html_body = re.sub(r'`([^`]+)`', r'<code style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-family:monospace; font-size:11px;">\1</code>', html_body)
    html_body = re.sub(r'^\* (.*$)', r'<li style="margin-bottom:4px;">\1</li>', html_body, flags=re.MULTILINE)
    html_body = re.sub(r'(\n<li>.*<\/li>)+', r'<ul style="padding-left:20px; margin-top:6px; margin-bottom:10px;">\g<0></ul>', html_body)
    html_body = re.sub(r'\n\n', r'<p style="margin-top:6px; margin-bottom:10px; line-height:1.55;"></p>', html_body)

    full_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page {{
          size: A4;
          margin: 18mm 15mm 18mm 15mm;
        }}
        body {{
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #334155;
          font-size: 11.5px;
          line-height: 1.6;
          background: #ffffff;
        }}
        .header-box {{
          border-bottom: 2px solid #0284c7;
          padding-bottom: 12px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }}
        .tag {{
          display: inline-block;
          background: #e0f2fe;
          color: #0369a1;
          font-weight: bold;
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 4px;
        }}
        table {{
          width: 100%;
          border-collapse: collapse;
          margin: 14px 0;
          font-size: 11px;
        }}
        th, td {{
          border: 1px solid #cbd5e1;
          padding: 7px 10px;
          text-align: left;
        }}
        th {{
          background: #f8fafc;
          color: #0f172a;
          font-weight: 600;
        }}
      </style>
    </head>
    <body>
      <div class="header-box">
        <div>
          <span class="tag">SIH 2026 · Problem Statement ID: 26086</span>
          <div style="font-size:10px; color:#64748b; margin-top:4px;">Ministry of Earth Sciences (MoES) / NCMRWF</div>
        </div>
      </div>
      <div>
        {html_body}
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
        page.set_content(full_html, wait_until="networkidle")
        page.pdf(path=PDF_FILE, format="A4", print_background=True)
        browser.close()
        print(f"Generated PDF: {PDF_FILE}")

if __name__ == "__main__":
    generate_pdf()
