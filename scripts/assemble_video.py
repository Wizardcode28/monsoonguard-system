import cv2
import os
import glob
from pathlib import Path

FRAMES_DIR = Path("D:/SIH_2026/monsoonguard-system/docs/videos/frames")
OUTPUT_VIDEO = Path("D:/SIH_2026/monsoonguard-system/docs/videos/monsoonguard-demo.mp4")

frame_files = sorted(glob.glob(str(FRAMES_DIR / "frame_*.png")))

if not frame_files:
    print("Error: No frames found!")
    exit(1)

print(f"Found {len(frame_files)} frames. Reading first frame to inspect resolution...")
first = cv2.imread(frame_files[0])
h, w, c = first.shape
print(f"Base frame dimensions: {w}x{h}")

TARGET_WIDTH = 1920
TARGET_HEIGHT = 1080
FPS = 24

# Hold each captured state for 25 frames (~1 second) with smooth 5-frame crossfades
REPEATS_PER_FRAME = 25

fourcc = cv2.VideoWriter_fourcc(*"mp4v")
out = cv2.VideoWriter(str(OUTPUT_VIDEO), fourcc, FPS, (TARGET_WIDTH, TARGET_HEIGHT))

print("Assembling MonsoonGuard demonstration video...")
prev_frame = None

for idx, fpath in enumerate(frame_files):
    frame = cv2.imread(fpath)
    if frame is None:
        continue
    
    # Resize with high quality Lanczos interpolation to 1080p
    resized = cv2.resize(frame, (TARGET_WIDTH, TARGET_HEIGHT), interpolation=cv2.INTER_LANCZOS4)
    
    # Smooth cross-fade transition from previous frame (4 frames)
    if prev_frame is not None:
        for alpha in [0.25, 0.5, 0.75]:
            blended = cv2.addWeighted(prev_frame, 1.0 - alpha, resized, alpha, 0)
            out.write(blended)
            
    # Hold state for comfortable viewing
    for _ in range(REPEATS_PER_FRAME):
        out.write(resized)
        
    prev_frame = resized
    if (idx + 1) % 20 == 0:
        print(f"Processed {idx + 1}/{len(frame_files)} frames...")

out.release()
print(f"Video assembly complete! Output saved to: {OUTPUT_VIDEO}")
