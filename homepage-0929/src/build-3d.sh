#!/bin/sh
# Rebuild vendor/how3d.js (three.js r160 + GLTF/EXR loaders + meshopt, bundled with src/how3d.js).
# usage: sh src/build-3d.sh <dir>   where <dir> has `npm i three@0.160.0 esbuild` done
D=${1:-.}; R=$(cd "$(dirname "$0")/.." && pwd)
cp "$R/src/how3d.js" "$D/how3d.entry.js"
(cd "$D" && ./node_modules/.bin/esbuild how3d.entry.js --bundle --minify --format=iife --target=es2019 --legal-comments=none --outfile="$R/vendor/how3d.js")
