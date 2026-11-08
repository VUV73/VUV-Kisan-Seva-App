from pathlib import Path
from PIL import Image, ImageOps

source = Path('app-icon-photo.png')
res = Path('android/app/src/main/res')
if not source.is_file():
    raise SystemExit('ERROR: app-icon-photo.png is missing')

# Keep the supplied photograph intact: only scale it proportionally and
# place it on a transparent square canvas. No filters, retouching or text.
photo = Image.open(source).convert('RGBA')
side = max(photo.width, photo.height)
canvas = Image.new('RGBA', (side, side), (0, 0, 0, 0))
photo.thumbnail((side, side), Image.Resampling.LANCZOS)
canvas.alpha_composite(photo, ((side - photo.width) // 2, (side - photo.height) // 2))

for density, size in [('mdpi', 48), ('hdpi', 72), ('xhdpi', 96), ('xxhdpi', 144), ('xxxhdpi', 192)]:
    folder = res / f'mipmap-{density}'
    folder.mkdir(parents=True, exist_ok=True)
    icon = canvas.resize((size, size), Image.Resampling.LANCZOS)
    icon.save(folder / 'ic_launcher.png', optimize=True)
    icon.save(folder / 'ic_launcher_round.png', optimize=True)

# Remove generated adaptive XML overrides so the supplied photo-based PNGs
# are used consistently by the launcher on this build.
for name in ('ic_launcher.xml', 'ic_launcher_round.xml'):
    p = res / 'mipmap-anydpi-v26' / name
    if p.exists():
        p.unlink()
