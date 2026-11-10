"""
Карты глубины для настоящих снимков кабинетов.

Нейросеть оценивает, какие предметы на фото ближе к камере, а какие дальше.
По такой карте снимок можно показать объёмным (js/3d/depth.js) и снять из него
видео с движением камеры (make_tour_video.py). Сам снимок не меняется.

Запуск:
    pip install onnxruntime pillow numpy
    python _src/tools/make_depth_maps.py путь/к/depth_anything_v2_small.onnx

Модель Depth Anything V2 Small (Apache 2.0, ~99 МБ):
    https://huggingface.co/onnx-community/depth-anything-v2-small/resolve/main/onnx/model.onnx

Результат лежит в _src/assets/depth: белое — близко, чёрное — далеко.
"""
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "_src" / "assets"
OUT = ASSETS / "depth"
PHOTOS = ["room-dental.jpg", "room-procedure.jpg"]


def estimate(session, im):
    w0, h0 = im.size
    s = 518 / min(w0, h0)
    w, h = int(round(w0 * s / 14)) * 14, int(round(h0 * s / 14)) * 14  # сеть работает с кратными 14
    x = np.asarray(im.resize((w, h), Image.BICUBIC)).astype(np.float32) / 255
    x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    x = x.transpose(2, 0, 1)[None].astype(np.float32)
    d = session.run(None, {session.get_inputs()[0].name: x})[0][0]
    d = (d - d.min()) / (d.max() - d.min())
    depth = Image.fromarray((d * 255).astype("uint8")).resize((w0, h0), Image.BICUBIC)
    # Ближние предметы чуть «расширяем» и смягчаем край: при сдвиге не видно ореола фона
    return depth.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(2.5))


def main():
    session = ort.InferenceSession(sys.argv[1], providers=["CPUExecutionProvider"])
    OUT.mkdir(exist_ok=True)
    for name in PHOTOS:
        depth = estimate(session, Image.open(ASSETS / name).convert("RGB"))
        path = OUT / (Path(name).stem + ".png")
        depth.save(path, optimize=True)
        print(path.name, depth.size, path.stat().st_size)


if __name__ == "__main__":
    main()
