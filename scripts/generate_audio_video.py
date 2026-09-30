import os
import asyncio
import edge_tts
import imageio_ffmpeg
import subprocess
import shutil

VIDEOS_DIR = r"d:\SIH_2026\monsoonguard-system\docs\videos"
RAW_VIDEO = os.path.join(VIDEOS_DIR, "monsoonguard-demo-raw.mp4")
FINAL_VIDEO = os.path.join(VIDEOS_DIR, "monsoonguard-demo.mp4")
AUDIO_FILE = os.path.join(VIDEOS_DIR, "narration_hq.mp3")

# Natural, expressive, authoritative voice
VOICE = "en-IN-NeerjaExpressiveNeural"

# Exactly timed for ~95-97 seconds video duration with natural pauses
SCRIPT = (
    "Welcome to MonsoonGuard AI. "
    "A machine learning downscaling and agronomic advisory engine developed for Smart India Hackathon 2026, "
    "Problem Statement 26086, under the Ministry of Earth Sciences and NCMRWF. "
    
    "Conventional numerical weather prediction models operate at a coarse 12-kilometer grid resolution. "
    "Consequently, they cannot resolve micro-climatic variations, localized convective storms, or break-monsoon dry spells at the village block level. "
    
    "MonsoonGuard AI directly bridges this gap. "
    "Here on our real-time dashboard, the system monitors planetary climate teleconnections, including ENSO Niño 3.4, the Indian Ocean Dipole, and Madden-Julian Oscillation waves. "
    
    "Our multi-output LightGBM Quantile Downscaling Engine translates 12-kilometer numerical boundaries into 1-kilometer hyper-local resolution, reducing prediction RMSE by over 50 percent. "
    "We provide 16-day probabilistic rainfall forecasts with P10, P50, and P90 confidence envelopes, alongside an early-warning dry spell radar operating at 91.2 percent F1-score. "
    
    "Our interactive geospatial map visualizes sub-district block choropleths across Bhopal and Sehore, displaying local soil moisture indices and risk tiers. "
    
    "Our multilingual advisory hub delivers actionable guidance, specifying optimal pesticide spray windows, sowing schedules, and field drainage alerts in both Hindi and English. "
    
    "Finally, the district officer command center equips agricultural officers and disaster managers with multi-block vulnerability rankings and automated emergency alert broadcasting. "
    
    "MonsoonGuard AI. Transforming numerical weather prediction into climate resilience for Indian farmers."
)

async def synthesize_hq_voice():
    print(f"Synthesizing studio-grade narration with {VOICE}...")
    communicate = edge_tts.Communicate(
        text=SCRIPT,
        voice=VOICE,
        rate="-2%",     # Slightly calmer, very clear natural cadence
        pitch="+0Hz"
    )
    await communicate.save(AUDIO_FILE)
    print(f"HQ Audio saved to {AUDIO_FILE}")

def assemble_final_video():
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    # Check if raw video backup exists; if not, use the video track
    input_video = RAW_VIDEO if os.path.exists(RAW_VIDEO) else FINAL_VIDEO
    temp_output = os.path.join(VIDEOS_DIR, "temp_render.mp4")

    print(f"Multiplexing audio and video using FFmpeg ({ffmpeg_exe})...")
    
    cmd = [
        ffmpeg_exe,
        "-y",
        "-i", input_video,
        "-i", AUDIO_FILE,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-ar", "44100",
        "-shortest",
        temp_output
    ]
    subprocess.run(cmd, check=True)
    
    # Overwrite final video cleanly
    shutil.move(temp_output, FINAL_VIDEO)
    print(f"High-quality synchronized demonstration video written to: {FINAL_VIDEO}")

if __name__ == "__main__":
    asyncio.run(synthesize_hq_voice())
    assemble_final_video()
