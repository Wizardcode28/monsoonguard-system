import os
import re
import base64
from playwright.sync_api import sync_playwright

DOCS_DIR = os.path.abspath(r"d:\SIH_2026\monsoonguard-system\docs")
MD_FILE = os.path.join(DOCS_DIR, "TECHNICAL_SPECIFICATION.md")
PDF_FILE = os.path.join(DOCS_DIR, "MonsoonGuard_Technical_Specification.pdf")
IMAGES_DIR = os.path.join(DOCS_DIR, "images")

def image_to_base64(img_path):
    if not os.path.exists(img_path):
        return ""
    ext = os.path.splitext(img_path)[1].lower()
    mime = "image/png" if ext == ".png" else "image/jpeg"
    with open(img_path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    return f"data:{mime};base64,{data}"

def generate_pdf():
    print(f"Reading {MD_FILE}...")
    with open(MD_FILE, "r", encoding="utf-8") as f:
        md_text = f.read()

    # Replace image markdown with base64 embedded images
    def replace_image(match):
        alt = match.group(1)
        rel_path = match.group(2).strip()
        filename = os.path.basename(rel_path)
        full_path = os.path.join(IMAGES_DIR, filename)
        b64 = image_to_base64(full_path)
        if b64:
            return f'<div style="text-align:center; margin:14px 0;"><img src="{b64}" alt="{alt}" style="max-width:92%; border-radius:6px; border:1px solid #cbd5e1; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);" /></div>'
        return f'<p style="color:#ef4444; font-size:10px;">[Image not found: {filename}]</p>'

    html_body = re.sub(r'!\[(.*?)\]\((.*?)\)', replace_image, md_text)

    # Convert Markdown formatting to clean HTML
    html_body = re.sub(r'^### (.*$)', r'<h3 style="color:#0f172a; margin-top:20px; margin-bottom:8px; border-bottom:1px solid #e2e8f0; padding-bottom:4px; font-size:14px;">\1</h3>', html_body, flags=re.MULTILINE)
    html_body = re.sub(r'^## (.*$)', r'<h2 style="color:#0369a1; margin-top:24px; margin-bottom:12px; border-bottom:2px solid #bae6fd; padding-bottom:6px; font-size:17px;">\1</h2>', html_body, flags=re.MULTILINE)
    html_body = re.sub(r'^# (.*$)', r'<h1 style="color:#0f172a; margin-top:10px; margin-bottom:14px; font-size:22px;">\1</h1>', html_body, flags=re.MULTILINE)
    html_body = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html_body)
    html_body = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html_body)
    html_body = re.sub(r'```([\s\S]*?)```', r'<pre style="background:#0f172a; color:#f8fafc; padding:10px; border-radius:6px; font-size:10px; overflow-x:auto;">\1</pre>', html_body)
    html_body = re.sub(r'`([^`]+)`', r'<code style="background:#f1f5f9; padding:2px 5px; border-radius:4px; font-family:monospace; font-size:10px; color:#0369a1;">\1</code>', html_body)
    html_body = re.sub(r'^\* (.*$)', r'<li style="margin-bottom:4px;">\1</li>', html_body, flags=re.MULTILINE)
    html_body = re.sub(r'(\n<li>.*<\/li>)+', r'<ul style="padding-left:18px; margin-top:6px; margin-bottom:10px;">\g<0></ul>', html_body)

    # Table conversions
    lines = html_body.split('\n')
    in_table = False
    new_lines = []
    for line in lines:
        if line.strip().startswith('|') and line.strip().endswith('|'):
            if not in_table:
                in_table = True
                new_lines.append('<table style="width:100%; border-collapse:collapse; margin:12px 0; font-size:10.5px;">')
            
            cells = [c.strip() for c in line.strip().split('|')[1:-1]]
            if all(set(c).issubset({'-', ':', ' '}) for c in cells):
                continue  # Header divider
            
            # Check if first row is header
            if '<table' in new_lines[-1]:
                row = ''.join([f'<th style="background:#0f172a; color:#ffffff; font-weight:600; text-align:left; padding:6px 8px; border:1px solid #cbd5e1;">{c}</th>' for c in cells])
            else:
                row = ''.join([f'<td style="padding:6px 8px; border:1px solid #cbd5e1; vertical-align:top;">{c}</td>' for c in cells])
            new_lines.append(f'<tr>{row}</tr>')
        else:
            if in_table:
                in_table = False
                new_lines.append('</table>')
            new_lines.append(line)
    if in_table:
        new_lines.append('</table>')
    html_body = '\n'.join(new_lines)

    # Paragraph conversions
    html_body = re.sub(r'\n\n', r'<p style="margin-top:6px; margin-bottom:8px; line-height:1.55;"></p>', html_body)

    full_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page {{
          size: A4;
          margin: 15mm 15mm 15mm 15mm;
          @bottom-right {{
            content: counter(page);
            font-size: 10px;
            color: #64748b;
          }}
        }}
        body {{
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #334155;
          font-size: 11px;
          line-height: 1.5;
          background: #ffffff;
        }}
        .header-box {{
          border-bottom: 2px solid #0284c7;
          padding-bottom: 10px;
          margin-bottom: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }}
        .badge {{
          background: #e0f2fe;
          color: #0369a1;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }}
        tr:nth-child(even) td {{
          background: #f8fafc;
        }}
        em {{
          font-size: 10px;
          color: #64748b;
          display: block;
          text-align: center;
          margin-top: 4px;
        }}
      </style>
    </head>
    <body>
      <div class="header-box">
        <div>
          <div style="font-size: 18px; font-weight: 800; color: #0f2942;">MonsoonGuard AI</div>
          <div style="font-size: 11px; color: #64748b;">Technical Specification & Architecture Whitepaper</div>
        </div>
        <div class="badge">SIH 2026 · PS 26086 · MoES / NCMRWF</div>
      </div>

      {html_body}

      <div style="margin-top:24px; border-top:1px solid #e2e8f0; padding-top:8px; font-size:10px; color:#94a3b8; text-align:center;">
        Smart India Hackathon 2026 · Ministry of Earth Sciences (MoES) / NCMRWF · MonsoonGuard Engineering Team
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
        page.pdf(
            path=PDF_FILE,
            format="A4",
            print_background=True,
            margin={"top": "12mm", "bottom": "12mm", "left": "12mm", "right": "12mm"}
        )
        browser.close()
        print(f"Technical Specification PDF created successfully at: {PDF_FILE}")

if __name__ == "__main__":
    generate_pdf()
