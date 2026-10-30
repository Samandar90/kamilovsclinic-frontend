"""
Вырезает врачей из студийных портретов и приводит кадр к единому виду.

Запуск:
    pip install onnxruntime pillow numpy
    python _src/tools/make_doctor_cutouts.py путь/к/isnet-general-use.onnx

Модель (свободная, ~170 МБ):
    https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-general-use.onnx

Нейросеть только отделяет человека от фона. Лицо и одежда не изменяются.
Новый врач: положите портрет в _src/assets/doctors/doctor-N.webp и добавьте
в HEADS центр головы по горизонтали, верх головы и её высоту в пикселях снимка.
"""
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "_src" / "assets" / "doctors"
OUT = ROOT / "images" / "doctors"

CANVAS = (800, 680)
HEAD_H = 236   # высота головы на холсте: у всех врачей одинаковая
HEAD_TOP = 36  # минимальный отступ сверху

# id: (центр по x, верх головы, высота головы, масштаб к HEAD_H)
HEADS = {
    1: (369, 107, 251, 1.0),
    2: (402, 91, 233, 1.0),
    3: (384, 36, 244, 1.0),
    4: (395, 58, 233, 1.0),
    5: (406, 2, 266, 1.0),
    6: (389, 0, 275, 1.0),
    7: (380, 220, 249, 1.14),
    8: (391, 0, 291, 1.0),
    9: (395, 20, 282, 1.0),
}

# Белый халат на белом фоне: маска мягкая, на тёмной арке был бы виден ореол.
WHITE_COAT = {1, 2, 6, 9}

# Снимки, где причёска или платок упираются в верх кадра: на фоне арки был бы виден
# ровный срез. Верхний край скругляем параболой, здесь её крутизна.
ROUND_TOP = {5: 0.0027, 6: 0.0025, 8: 0.0027}


def predict_mask(session, im):
    """Маска ISNet: 1024x1024, вход нормирован как в обучении модели."""
    x = np.asarray(im.convert("RGB").resize((1024, 1024), Image.LANCZOS)).astype(np.float32)
    x = x / max(x.max(), 1e-6)
    x = (x - np.array([0.485, 0.456, 0.406], dtype=np.float32)) / 1.0
    x = x.transpose(2, 0, 1)[None]
    pred = session.run(None, {session.get_inputs()[0].name: x})[0][0, 0]
    pred = (pred - pred.min()) / max(pred.max() - pred.min(), 1e-6)
    mask = Image.fromarray((pred * 255).astype("uint8")).resize(im.size, Image.LANCZOS)
    return np.asarray(mask).astype(np.float32) / 255


def box(a, r):
    """Быстрое среднее по окну (2r+1)^2 через интегральное изображение."""
    h, w = a.shape
    pad = np.pad(a, ((r + 1, r), (r + 1, r)), mode="edge")
    s = pad.cumsum(0).cumsum(1)
    return (s[2 * r + 1:, 2 * r + 1:] - s[:-2 * r - 1, 2 * r + 1:] - s[2 * r + 1:, :-2 * r - 1] + s[:-2 * r - 1, :-2 * r - 1]) / (2 * r + 1) ** 2


def guided(guide, p, r=5, eps=1e-3):
    """Guided filter: подтягивает край маски к реальному краю на снимке."""
    mg, mp = box(guide, r), box(p, r)
    cov = box(guide * p, r) - mg * mp
    var = box(guide * guide, r) - mg * mg
    a = cov / (var + eps)
    b = mp - a * mg
    return box(a, r) * guide + box(b, r)


def cutout(session, doc_id):
    im = Image.open(SRC / f"doctor-{doc_id}.webp").convert("RGB")
    rgb = np.asarray(im).astype(np.float32) / 255
    alpha = predict_mask(session, im)

    # Край по снимку, только в узкой полосе неуверенности.
    refined = np.clip(guided(rgb.mean(-1), alpha), 0, 1)
    band = (alpha > 0.04) & (alpha < 0.96)
    alpha = np.where(band, refined, alpha)
    low, high = (0.42, 0.78) if doc_id in WHITE_COAT else (0.18, 0.82)
    alpha = np.clip((alpha - low) / (high - low), 0, 1)
    if doc_id in WHITE_COAT:
        smooth = Image.fromarray((alpha * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(0.8))
        alpha = np.asarray(smooth).astype(np.float32) / 255

    # Светлый ореол студийного фона снимаем с полупрозрачных пикселей.
    bg = np.median(rgb[alpha < 0.02].reshape(-1, 3), axis=0)
    a3 = alpha[..., None]
    fg = np.clip((rgb - (1 - a3) * bg) / np.maximum(a3, 0.08), 0, 1)
    rgb = np.where(a3 < 0.98, fg, rgb)

    cx, top, head_h, boost = HEADS[doc_id]
    if doc_id in ROUND_TOP:
        yy, xx = np.mgrid[0 : alpha.shape[0], 0 : alpha.shape[1]].astype(np.float32)
        alpha = alpha * np.clip((yy - ROUND_TOP[doc_id] * (xx - cx) ** 2) / 1.5, 0, 1)

    out = np.dstack([rgb, alpha])
    cut = Image.fromarray((out * 255).round().astype("uint8"))

    s = HEAD_H * boost / head_h
    w, h = cut.size
    scaled = cut.convert("RGBa").resize((round(w * s), round(h * s)), Image.LANCZOS).convert("RGBA")
    sw, sh = scaled.size
    y = max(HEAD_TOP, CANVAS[1] - round((h - top) * s)) - round(top * s)
    x = CANVAS[0] // 2 - round(cx * s)
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    canvas.paste(scaled, (x, y))

    r, g, b, a = canvas.split()
    sharp = Image.merge("RGB", (r, g, b)).filter(ImageFilter.UnsharpMask(radius=1.4, percent=45, threshold=2))
    final = Image.merge("RGBA", (*sharp.split(), a))
    path = OUT / f"cut-{doc_id}.webp"
    final.save(path, "WEBP", quality=80, alpha_quality=88, method=6)
    print(path.name, final.size, path.stat().st_size)


def main():
    session = ort.InferenceSession(sys.argv[1], providers=["CPUExecutionProvider"])
    OUT.mkdir(exist_ok=True)
    for doc_id in HEADS:
        cutout(session, doc_id)


if __name__ == "__main__":
    main()
