#!/bin/sh
# usage: shoot.sh <width> <height> <out.png>   (full-page capture with animations settled)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --no-sandbox --user-data-dir=/private/tmp/claude-501/-Users-jia-Desktop-Vocci/1e1e0f31-5ce8-427c-aaf0-5d6304c67493/scratchpad/chrome-profile --window-size=$1,$2 --virtual-time-budget=8000 --screenshot="$3" "http://127.0.0.1:8732/index.html" 2>/dev/null
