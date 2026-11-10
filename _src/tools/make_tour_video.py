"""
Видео «Клиника изнутри»: камера плавно движется по настоящим снимкам кабинетов.

Движение получено из фотографий и карт глубины (make_depth_maps.py): ближние
предметы смещаются сильнее дальних, как при съёмке с рельсов. Ничего
дорисованного в кадре нет. Когда у клиники появится настоящая съёмка,
достаточно заменить файлы media/clinic-tour.* и поправить TOUR в
_src/pages/home.mjs.

Запуск:
    pip install pillow numpy
    python _src/tools/make_tour_video.py путь/к/ffmpeg

Результат: media/clinic-tour.mp4, media/clinic-tour.webm, images/tour-poster.webp.
Время начала каждого кадра (STARTS) повторено в _src/pages/home.mjs: по нему
подписи на странице переключаются вместе с видео.
"""
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from make_room_photos import grade  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "_src" / "assets"
W, H, FPS = 720, 900, 30
FADE = 0.5  # секунды: кадры перетекают друг в друга
FOCUS = 0.22  # предметы этой глубины стоят на месте, ближние и дальние расходятся

# Съёмочный план. Центр и ширина кадра — в долях исходного снимка, сдвиг камеры — тоже.
SHOTS = [
    dict(photo="room-dental", start=0.0, center=((0.50, 0.555), (0.50, 0.575)), width=(0.93, 0.80), shift=((-0.030, 0.0), (0.030, 0.006)), dolly=(0.0, 0.07)),
    dict(photo="room-dental", start=4.4, center=((0.60, 0.69), (0.69, 0.71)), width=(0.60, 0.56), shift=((0.034, 0.0), (-0.034, 0.0)), dolly=(0.02, 0.05)),
    dict(photo="room-procedure", start=8.6, center=((0.47, 0.50), (0.50, 0.53)), width=(0.90, 0.78), shift=((-0.028, 0.008), (0.028, -0.004)), dolly=(0.0, 0.06)),
]
TOTAL = 13.0
STARTS = [s["start"] for s in SHOTS]


def load(name):
    photo = grade(Image.open(ASSETS / (name + ".jpg")).convert("RGB"))
    depth = Image.open(ASSETS / "depth" / (name + ".png")).convert("L").resize(photo.size, Image.BICUBIC)
    return np.asarray(photo).astype(np.float32), np.asarray(depth).astype(np.float32) / 255


def bilinear(img, x, y):
    h, w = img.shape[:2]
    x = np.clip(x, 0, w - 1.001)
    y = np.clip(y, 0, h - 1.001)
    x0 = x.astype(np.int32)
    y0 = y.astype(np.int32)
    fx = x - x0
    fy = y - y0
    if img.ndim == 3:
        fx = fx[..., None]
        fy = fy[..., None]
    top = img[y0, x0] * (1 - fx) + img[y0, x0 + 1] * fx
    bottom = img[y0 + 1, x0] * (1 - fx) + img[y0 + 1, x0 + 1] * fx
    return top * (1 - fy) + bottom * fy


def ease(t):
    return t * t * (3 - 2 * t)


GRID_U, GRID_V = np.meshgrid((np.arange(W) + 0.5) / W - 0.5, (np.arange(H) + 0.5) / H - 0.5)


def render(shot, sources, local, length):
    """Один кадр плана. local — секунды от начала плана, может быть чуть меньше нуля во время наплыва."""
    photo, depth = sources[shot["photo"]]
    ph, pw = depth.shape
    k = ease(np.clip((local + FADE) / (length + FADE), 0, 1))
    lerp = lambda a, b: a + (b - a) * k
    cx = lerp(shot["center"][0][0], shot["center"][1][0])
    cy = lerp(shot["center"][0][1], shot["center"][1][1])
    vw = lerp(*shot["width"])
    vh = vw * (H / W) * (pw / ph)
    tx = lerp(shot["shift"][0][0], shot["shift"][1][0])
    ty = lerp(shot["shift"][0][1], shot["shift"][1][1])
    dz = lerp(*shot["dolly"])

    # Куда смотрит каждая точка кадра на исходном снимке, если бы глубины не было
    qx = cx + GRID_U * vw
    qy = cy + GRID_V * vh
    # Сдвиг зависит от глубины в той точке, куда мы в итоге попадём: уточняем за несколько шагов
    px, py = qx, qy
    for _ in range(5):
        d = bilinear(depth, px * pw, py * ph) - FOCUS
        px = qx - d * (tx + (px - cx) * dz)
        py = qy - d * (ty + (py - cy) * dz)
    return bilinear(photo, px * pw, py * ph)


def frame(t, sources):
    """Кадр видео в момент t. На стыках два плана смешиваются, конец перетекает в начало."""
    layers = []
    for i, shot in enumerate(SHOTS):
        end = SHOTS[i + 1]["start"] if i + 1 < len(SHOTS) else TOTAL
        length = end - shot["start"]
        for local in (t - shot["start"], t - shot["start"] - TOTAL):
            if -FADE <= local < length:
                weight = (local + FADE) / FADE if local < 0 else 1.0
                layers.append((weight, render(shot, sources, local, length)))
    layers.sort(key=lambda layer: -layer[0])  # сначала основной план, поверх него — проявляющийся
    out = layers[0][1]
    for weight, img in layers[1:]:
        out = out * (1 - weight) + img * weight
    return out


VIGNETTE = 1 - 0.16 * np.clip((GRID_U ** 2 + GRID_V ** 2) / 0.5, 0, 1)[..., None] ** 1.5


def main():
    ffmpeg = sys.argv[1]
    sources = {name: load(name) for name in {s["photo"] for s in SHOTS}}
    media = ROOT / "media"
    media.mkdir(exist_ok=True)
    raw = ["-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-"]
    encoders = [
        subprocess.Popen([ffmpeg, "-y", "-loglevel", "error", *raw, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "24",
                          "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(media / "clinic-tour.mp4")], stdin=subprocess.PIPE),
        subprocess.Popen([ffmpeg, "-y", "-loglevel", "error", *raw, "-an", "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0",
                          "-row-mt", "1", "-pix_fmt", "yuv420p", str(media / "clinic-tour.webm")], stdin=subprocess.PIPE),
    ]
    count = int(TOTAL * FPS)
    for n in range(count):
        img = np.clip(frame(n / FPS, sources) * VIGNETTE, 0, 255).astype(np.uint8)
        if n == 0:
            Image.fromarray(img).save(ROOT / "images" / "tour-poster.webp", "WEBP", quality=78, method=6)
        data = img.tobytes()
        for enc in encoders:
            enc.stdin.write(data)
        if n % 60 == 0:
            print(f"{n}/{count}", flush=True)
    for enc in encoders:
        enc.stdin.close()
        enc.wait()
    for name in ("clinic-tour.mp4", "clinic-tour.webm"):
        print(name, round((media / name).stat().st_size / 1024), "KB")


if __name__ == "__main__":
    main()
