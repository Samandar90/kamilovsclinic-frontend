"""
Собирает лёгкие файлы шрифтов для сайта.

Запуск:
    pip install fonttools brotli
    python _src/tools/make_fonts.py папка/с/исходниками

Исходники: variable TTF из https://github.com/google/fonts (ofl/ysabeauoffice, ofl/onest).
Оставляем только начертания и символы, которые нужны сайту: кириллица, включая
узбекскую, латиница и типографские знаки. Новый редкий символ — добавьте в EXTRA.
"""
import sys
from pathlib import Path

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

OUT = Path(__file__).resolve().parents[2] / "fonts"

UNICODES = set(range(0x20, 0x7F))          # латиница
UNICODES |= set(range(0x410, 0x450))       # русский алфавит
UNICODES |= {0x401, 0x451}                 # Ё ё
UNICODES |= {0x40E, 0x45E, 0x49A, 0x49B, 0x492, 0x493, 0x4B2, 0x4B3}  # узбекская кириллица
EXTRA = "«»—–‘’“”…·•№ʻʼ×→ "
UNICODES |= {ord(c) for c in EXTRA}

JOBS = [
    # файл-исходник, файл на сайте, диапазон начертаний
    ("YsabeauOffice[wght].ttf", "ysabeau-office.woff2", (400, 600)),
    ("YsabeauOffice-Italic[wght].ttf", "ysabeau-office-italic.woff2", (400, 500)),
    ("Onest[wght].ttf", "onest.woff2", (400, 700)),
]

FEATURES = ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk", "tnum", "lnum"]


def build(src_dir, name, out_name, weights):
    font = TTFont(Path(src_dir) / name)

    options = Options()
    options.layout_features = FEATURES
    options.hinting = False
    options.desubroutinize = True
    options.name_IDs = [1, 2, 3, 4, 6]
    options.notdef_outline = True

    # Сначала символы, потом начертания: в обратном порядке fontTools падает на пробеле.
    subsetter = Subsetter(options)
    subsetter.populate(unicodes=UNICODES)
    subsetter.subset(font)
    font = instancer.instantiateVariableFont(font, {"wght": weights})

    font.flavor = "woff2"
    path = OUT / out_name
    font.save(path)
    print(out_name, round(path.stat().st_size / 1024), "КБ")


def main():
    for name, out_name, weights in JOBS:
        build(sys.argv[1], name, out_name, weights)


if __name__ == "__main__":
    main()
