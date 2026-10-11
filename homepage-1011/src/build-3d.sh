#!/bin/sh
# Rebuild vendor/how3d.js (three.js r160 + GLTF/EXR loaders + meshopt, bundled with src/how3d.js).
# usage: sh src/build-3d.sh <dir>   where <dir> has `npm i three@0.160.0 esbuild` done
D=${1:-.}; R=$(cd "$(dirname "$0")/.." && pwd)
cp "$R/src/how3d.js" "$D/how3d.entry.js"
(cd "$D" && ./node_modules/.bin/esbuild how3d.entry.js --bundle --minify --format=iife --target=es2019 --legal-comments=none --outfile="$R/vendor/how3d.js")
# model + light as base64 (img3/ring.glb, img3/studio.exr are the sources)
python3 - "$R" <<'PY'
import base64, sys, pathlib
R = pathlib.Path(sys.argv[1]); e = lambda f: base64.b64encode((R/'img3'/f).read_bytes()).decode()
(R/'vendor/how3d-assets.js').write_text('window.__VOCCI_RING="%s";window.__VOCCI_EXR="%s";\n' % (e('ring.glb'), e('studio.exr')))
PY
