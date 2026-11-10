"""Кадры настоящих кабинетов для главной. Запуск: python _src/tools/make_room_photos.py"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "_src" / "assets"
OUT = ROOT / "images"

def grade(im):
    """Снимки с телефона недодержаны: белая стена выходит серой. Поднимаем света
    кривой (детали на белом остаются), чуть цвета и резкости. Содержимое не меняется."""
    arr = np.asarray(im).astype(np.float32) / 255
    arr = np.clip(arr * 1.2 - 0.02, 0, 1) ** 0.86
    # Лёгкая S-кривая вместо плоского контраста телефона.
    arr = arr + 0.1 * (arr - 0.5) * (1 - np.abs(2 * arr - 1))
    out = Image.fromarray((np.clip(arr, 0, 1) * 255).astype("uint8"))
    out = ImageEnhance.Color(out).enhance(1.12)
    return out.filter(ImageFilter.UnsharpMask(radius=1.6, percent=55, threshold=3))

JOBS = [
    # файл, исходник, кадр (л, в, п, н), нужна ли карта глубины для объёмного показа
    ("room-dental-tall.webp", "room-dental.jpg", (0, 230, 760, 1230), True),
    ("room-dental-detail.webp", "room-dental.jpg", (392, 590, 862, 1208), False),
    ("room-procedure.webp", "room-procedure.jpg", (120, 190, 760, 1032), False),
]

def main():
    for name, src, box, with_depth in JOBS:
        im = Image.open(ASSETS / src).convert("RGB").crop(box)
        grade(im).save(OUT / name, "WEBP", quality=76, method=6)
        print(name, im.size, (OUT / name).stat().st_size)
        if with_depth:
            # Карта глубины того же кадра (см. make_depth_maps.py). Ей хватает половины размера.
            depth = Image.open(ASSETS / "depth" / (Path(src).stem + ".png")).convert("L").crop(box)
            depth = depth.resize((im.width // 2, im.height // 2), Image.LANCZOS)
            path = OUT / name.replace(".webp", "-depth.webp")
            depth.save(path, "WEBP", quality=82, method=6)
            print(path.name, depth.size, path.stat().st_size)

if __name__ == "__main__":
    main()
