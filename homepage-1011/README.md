# Vocci homepage · 0928 round（基于 V13 Big Grid artifact）

- `index.html` — 生成结果，直接打开即可（图片相对路径 img/ img2/ img3/）
- `src/baseline.html` — 客户确认的 V13 大格子 artifact 原稿（未改动）
- `src/patch.py` — 把 0928 Figma 的改动叠加到原稿：换图、新增模块（AI 轨道、社区气泡、爆炸图）、内联网格坐标转为自定义属性、追加覆盖样式与动效脚本。`python3 src/patch.py` 重新生成
- `src/override.css` — 本轮全部样式改动（色彩、可读性、一屏一区、三断点、动效状态）
- `src/motion.js` — 动效脚本；说明见 `docs/motion.md`
- `img3/` — 从 0928 PDF 提取的客户选定素材 + 本地 IBM Plex 字体

断点：桌面 ≥1101（4 列）· 平板 701–1100（2 列，标题行自适应高度）· 手机 ≤700（单列）
