import os
import asyncio
import edge_tts
import imageio_ffmpeg
import subprocess

AUDIO_DIR = r"d:\SIH_2026\monsoonguard-system\docs\videos"
AUDIO_FILE = os.path.join(AUDIO_DIR, "narration.mp3")
VIDEO_IN = os.path.join(AUDIO_DIR, "monsoonguard-demo.mp4")
VIDEO_OUT = os.path.join(AUDIO_DIR, "monsoonguard-demo-with-audio.mp4")

VOICE = "en-IN-PrabhatNeural"

NARRATION_SCRIPT = """
Welcome to MonsoonGuard AI, an AI-powered hyper-local monsoon prediction and agronomic advisory engine, built for Smart India Hackathon 2026, Problem Statement 26086, for the Ministry of Earth Sciences and NCMRWF.
Conventional numerical weather prediction models operate at a coarse 12-kilometer grid resolution. 
They cannot resolve localized micro-climates, convective storms, or break-monsoon dry spells at the sub-district and block level.
MonsoonGuard AI solves this challenge.
On our real-time dashboard, we ingest and visualize global planetary teleconnection indices, including ENSO Niño 3.4, the Indian Ocean Dipole, and Madden-Julian Oscillation waves.
Our multi-output LightGBM Quantile Downscaling Engine downscales 12-kilometer numerical models to 1-kilometer hyper-local resolution, achieving a 50.4 percent reduction in root mean square error.
We provide 16-day probabilistic rainfall curves with P10, P50, and P90 confidence envelopes, alongside a dedicated break-monsoon dry spell radar operating at a 91.2 percent F1-score.
Our interactive geospatial map visualizes sub-district block choropleths across Bhopal and Sehore, displaying localized soil moisture, precipitation anomalies, and risk tiers.
Our multilingual agronomic advisory hub translates meteorological data into actionable farm operations, providing crop-specific spray windows, sowing schedules, and field drainage alerts in both Hindi and English.
For district agriculture officers and disaster managers, the command center enables multi-block vulnerability ranking, early warning threshold alerts, and automated broadcast dispatches.
MonsoonGuard AI transforms numerical weather prediction into resilient farming livelihoods across 6,000 administrative blocks in India.
Thank you.
"""

async def generate_narration():
    print("Synthesizing neural voiceover narration with Edge TTS...")
    communicate = edge_tts.Communicate(NARRATION_SCRIPT.strip(), VOICE, rate="+3%")
    await communicate.save(AUDIO_FILE)
    print(f"Narration saved to: {AUDIO_FILE}")

def multiplex_audio_video():
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    print(f"Using FFmpeg binary: {ffmpeg_exe}")
    
    # Merge audio with video, keeping video quality and looping/trimming if needed
    cmd = [
        ffmpeg_exe,
        "-y",
        "-i", VIDEO_IN,
        "-i", AUDIO_FILE,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        VIDEO_OUT
    ]
    print("Running FFmpeg multiplexing...")
    subprocess.run(cmd, check=True)
    print(f"Final demonstration video with audio created at: {VIDEO_OUT}")

    # Overwrite monsoonguard-demo.mp4 with the audio-enhanced version as standard
    if os.path.exists(VIDEO_OUT):
        import shutil
        shutil.copyfile(VIDEO_OUT, VIDEO_IN)
        print(f"Updated primary demo video: {VIDEO_IN}")

if __name__ == "__main__":
    asyncio.run(generate_narration())
    multiplex_audio_video()
