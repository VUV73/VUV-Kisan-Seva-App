from pathlib import Path
import sys
from PIL import Image, ImageOps
res=Path(sys.argv[1]); src=Path(sys.argv[2])
im=Image.open(src).convert("RGBA")
# Fill square launcher canvas with the existing complete circular VUV badge.
for density,size in [("mdpi",48),("hdpi",72),("xhdpi",96),("xxhdpi",144),("xxxhdpi",192)]:
    d=res/f"mipmap-{density}"; d.mkdir(parents=True,exist_ok=True)
    icon=ImageOps.fit(im,(size,size),method=Image.Resampling.LANCZOS,centering=(0.5,0.5))
    icon.save(d/"ic_launcher.png",optimize=True)
    icon.save(d/"ic_launcher_round.png",optimize=True)
# Remove adaptive XML overrides so Android uses the generated PNG icons above.
for p in [res/"mipmap-anydpi-v26"/"ic_launcher.xml",res/"mipmap-anydpi-v26"/"ic_launcher_round.xml"]:
    if p.exists(): p.unlink()
