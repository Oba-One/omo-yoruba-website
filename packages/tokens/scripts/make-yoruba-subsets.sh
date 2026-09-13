#!/usr/bin/env bash
# Cuts the Yoruba letters that fontsource ships in latin-ext (U+0143-0144, U+01F8-01F9,
# U+1E3E-1E3F, U+1E62-1E63) out of the pinned @fontsource-variable latin-ext wght files into four
# small woff2 files, renames them (OFL condition 3: the fonts reserve the name "Source"), checks
# that every letter draws exactly as in its source at wght 200 to 900, and writes OFL.txt beside
# them. Recipe and licence check: docs/research/phase-5-yoruba-font-subsets.md.
#
#   bash packages/tokens/scripts/make-yoruba-subsets.sh
#
# Needs python3 3.10 or later and PyPI access; installs nothing outside a temporary directory.
set -euo pipefail

TOKENS="${TOKENS_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
OUT="${OUT_DIR:-$TOKENS/src/fonts}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

"${PYTHON:-python3}" -m venv "$tmp/venv"
"$tmp/venv/bin/pip" install --quiet --disable-pip-version-check \
  "fonttools[woff]==4.65.0" "brotli==1.2.0" "zopfli==0.4.3"
mkdir -p "$OUT"

"$tmp/venv/bin/python" - "$TOKENS" "$OUT" <<'PY'
import hashlib
import json
import sys
from pathlib import Path

from fontTools import subset
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont

tokens, out = Path(sys.argv[1]), Path(sys.argv[2])
CODEPOINTS = sorted(subset.parse_unicodes("U+0143-0144,U+01F8-01F9,U+1E3E-1E3F,U+1E62-1E63"))
OPTIONS = ["--layout-features=*", "--flavor=woff2", "--name-IDs=*", "--name-languages=*", "--notdef-outline"]
FONTSOURCE = "5.3.0"
# package, names that carry the Reserved Font Name, the new names, output prefix
FAMILIES = [
    ("source-sans-3", "Source Sans 3", "SourceSans3", "OY Yoruba Sans", "OYYorubaSans", "oy-yoruba-sans"),
    ("source-serif-4", "Source Serif 4", "SourceSerif4", "OY Yoruba Serif", "OYYorubaSerif", "oy-yoruba-serif"),
]
INPUTS = {  # sha256 of the fontsource 5.3.0 files; a mismatch means re-verify before cutting
    "source-sans-3-latin-ext-wght-normal.woff2": "a85a7459bdb3cdc1136751e151a506bae653fc29ada3ca86237477df6f1b59e6",
    "source-sans-3-latin-ext-wght-italic.woff2": "6fe10a66ec416f77a26309b645471d032ad8175063bb605b886e9b7e57efaaa8",
    "source-serif-4-latin-ext-wght-normal.woff2": "41529a5b38008d9ea01e28ec18693a714a3216669ee477d83a5b9db999369625",
    "source-serif-4-latin-ext-wght-italic.woff2": "515639854d3566c43860d2005770645c590df8b43a0144c70fe2566c33015ede",
}


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def drawing(font, wght):
    glyphs, cmap, result = font.getGlyphSet(location={"wght": wght}), font.getBestCmap(), []
    for codepoint in CODEPOINTS:
        pen = DecomposingRecordingPen(glyphs)
        glyphs[cmap[codepoint]].draw(pen)
        result.append((pen.value, glyphs[cmap[codepoint]].width))
    return result


notices, licence = [], None
for package, family, ps_family, new_family, new_ps_family, prefix in FAMILIES:
    root = tokens / "node_modules" / "@fontsource-variable" / package
    version = json.loads((root / "package.json").read_text())["version"]
    if version != FONTSOURCE:
        sys.exit(f"{package} is {version}, the recipe was verified on {FONTSOURCE}")
    text = (root / "LICENSE").read_text()
    start = text.index("SIL OPEN FONT LICENSE Version 1.1")
    licence = text[text.rindex("\n", 0, start - 1) + 1:]
    for style in ("normal", "italic"):
        src = root / "files" / f"{package}-latin-ext-wght-{style}.woff2"
        dst = out / f"{prefix}-wght-{style}.woff2"
        if sha256(src) != INPUTS[src.name]:
            sys.exit(f"{src.name} is not the verified file")
        options = subset.Options()
        options.parse_opts(OPTIONS)
        font = subset.load_font(str(src), options, dontLoadGlyphNames=True)
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=CODEPOINTS)
        subsetter.subset(font)
        name = font["name"]
        for record in name.names:
            if record.nameID == 0:  # the copyright notice and its RFN declaration stay verbatim
                continue
            old = record.toUnicode()
            new = old.replace(family, new_family).replace(ps_family, new_ps_family)
            if new != old:
                name.setName(new, record.nameID, record.platformID, record.platEncID, record.langID)
        left = [r.nameID for r in name.names if r.nameID != 0 and "Source" in r.toUnicode()]
        if left:
            sys.exit(f"{dst.name}: name IDs {left} still carry the Reserved Font Name")
        subset.save_font(font, str(dst), options)

        cut, original = TTFont(dst), TTFont(src)
        if sorted(cut.getBestCmap()) != CODEPOINTS:
            sys.exit(f"{dst.name}: cmap is not the eight letters")
        for name_id in (0, 14):
            if cut["name"].getDebugName(name_id) != original["name"].getDebugName(name_id):
                sys.exit(f"{dst.name}: name ID {name_id} differs from the source")
        for wght in range(200, 901, 50):
            if drawing(cut, wght) != drawing(original, wght):
                sys.exit(f"{dst.name}: draws differently from {src.name} at wght {wght}")
        notice = original["name"].getDebugName(0)
        if notice not in notices:
            notices.append(notice)
        print(f"{dst.name}  {dst.stat().st_size} bytes  sha256 {sha256(dst)}")

ofl = out / "OFL.txt"
ofl.write_text(
    "\n".join(notices)
    + "\n\nThis Font Software is licensed under the SIL Open Font License, Version 1.1.\n"
    + "This license is copied below, and is also available with a FAQ at:\n"
    + "https://openfontlicense.org\n\n\n"
    + licence
)
print(f"OFL.txt  {ofl.stat().st_size} bytes")
PY
