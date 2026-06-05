from PIL import Image
import os
import sys

src = sys.argv[1]
dst = sys.argv[2]
TARGET_W, TARGET_H = 800, 760

img = Image.open(src).convert("RGB")
src_w, src_h = img.size
target_ratio = TARGET_W / TARGET_H
src_ratio = src_w / src_h

if src_ratio > target_ratio:
    new_h = src_h
    new_w = int(src_h * target_ratio)
else:
    new_w = src_w
    new_h = int(src_w / target_ratio)

left = (src_w - new_w) // 2
top = (src_h - new_h) // 2
img = img.crop((left, top, left + new_w, top + new_h))
img = img.resize((TARGET_W, TARGET_H), Image.LANCZOS)
os.makedirs(os.path.dirname(dst), exist_ok=True)
img.save(dst, "WEBP", quality=85, method=6)
print(f"Saved: {dst} ({img.size[0]}x{img.size[1]})")
