# Vocci homepage · 动效方案（0928）

参考：db-longbow.webflow.io（Digital Butlers）。参考站的动效系统拆解后只有 8 个原语，本页全部用原生 CSS/JS 复刻，不依赖 GSAP；Lenis 平滑滚动可选（CDN 可用时自动启用，离线时退化为原生滚动）。

## 参考站动效原语 → Vocci 对应

| Longbow 原语 | 参考站做法 | Vocci 实现（motion.js / override.css） |
| --- | --- | --- |
| Preloader 画网格 | 横线 scaleX 从左画出 → 竖线 scaleY → 第二条横线从右画出，交点方块 scale 0→1 并 rotate 45→0（back.out），logo 淡入；最短 3 s | `.pre`：同一顺序，总时长 1.5 s（产品站不宜太久），每个 tab 只播一次（sessionStorage） |
| card-animation | 卡片 opacity 0 / y 50 / scale .85 → 1，1.2 s power2.inOut，50% 可见时触发，data-delay 错开 | 每个 `.pn` 面板：opacity 0 / y 36 / scale .97 → 1，.85 s，同一区块内按 DOM 顺序 60 ms 错开 |
| content-reveal | 图片按 `data-reveal="left bottom"` 方向遮罩揭示 | `.pn.pic > img` clip-path inset 从下向上揭示 1 s（裁切放在 img 上，面板本身保持可被 IntersectionObserver 观测） |
| image-parallax | 图片放大 1.2–1.4 倍，随滚动 y 位移，scrub | 全幅 `.bgimg` 与 `.pn.pic.sharp > img` 高 110%，滚动时 ±8% 位移（rAF 节流）；hero 图额外 1.08→1 的落定缩放 |
| text-split | 标题按字符从 y 150% 升起，微旋转 | 所有 h1/h2 与页脚字标按「词」遮罩升起，每词 45 ms 错开（按词而非按字，IBM Plex 更稳） |
| text-reveal | mono 标签从 0/1 乱码解码成文字，进入视口或 hover 触发 | 所有 `.label` / `.pill`（编号、眉题、来源）进入视口解码一次，hover 再次解码 |
| 网格线与方块 | 线条为静态元素，preloader 时画出 | 每个区块进入视口：横线 scaleX 画出 1.1 s，交点方块延迟 .5 s 弹出 |
| header / nav-link hover | 固定玻璃胶囊导航；链接文字双层字符上滑 | 导航固定在顶部（脱离 hero），链接 hover 整词上滑；购物袋按钮变深 |
| marquee | 无限滚动文字条 | 未采用：客户稿没有跑马灯，且与「安静的大网格」气质不符 |
| gallery-sticky / cursor follower | sticky 画廊 + 跟随光标的标签 | 未采用，改为更贴合内容的列表联动（见下） |

## 0928-b 追加（参考 sangar.framer.website）

- **Hero → 第二屏**：hero 用 `position:sticky; top:0` 钉在页面最底层，第二屏从下方盖上来；随滚动 hero 照片放大 1→1.12 并压暗到 55%，玻璃卡下沉 140px 并淡出（scrub，跟手）。
- **FAQ → Footer**：footer `position:sticky; bottom:0` 垫在最底层，FAQ 上滑时把它揭开；footer 三个面板随揭开程度从 −90px 上浮并淡入。
- **图片出现**（Longbow content-reveal）：从左下角的楔形擦除 + 1.14→1 的落定缩放；sharp 大图只擦除不缩放（视差占用 transform）。
- **Hover**：文字面板底色提亮、眉题变橙；图片面板 2px 橙色内框 + 轻微放大；列表项右移 6px；徽章/奖项恢复彩色、月桂变橙；引言加深；气泡上浮；录音小组件上浮描橙；页脚链接右移；购物袋按钮变橙。
- **MCP 轨道**：以照片中戒指的位置为圆心（`--cx:40% --cy:46%`），7 个 AI 图标分布在两圈虚线轨道上缓慢公转，每个图标有一条从戒指出发的虚线连接（进入时逐条画出），圆心是橙色脉冲点，持续向外扩散涟漪，表达「戒指通过 MCP 连接多个 AI」。

## 逐区块

1. **Hero** — preloader 收起后导航从上方落下；照片 1.08 → 1 落定 2.2 s；左下玻璃卡升起，标题逐词升起，副标与 BUY NOW 随后；滚动时照片轻微视差。
2. **Recording（A）** — 标题面板与卡片错开升起；主照片自下而上揭示并视差；录音小组件计时器实时走秒，橙点呼吸。
3. **MCP（B）** — 主照片揭示；AI 图标轨道淡入 + 放大到位，随后 14 s 周期缓慢摆动；列表 hover / 点击 / 键盘聚焦切换标题与说明（淡出淡入），编号变橙。
4. **Three moments** — 三张照片依次揭示（120 ms 错开），三段文字随后升起；hover 图片轻微放大。
5. **Make room** — 人群列表 7 项随卡片升起；hover 任一人群 → 右侧引言与来源切换，头像放大；照片视差。
6. **Where the ring earns its place** — 全幅照片视差；四个场景 hover 切换编号、眉题、标题、说明。
7. **How it works** — 四张图与四段文字交错升起；进入视口后每 3.2 s 自动轮播高亮（浅灰底），hover 停在该步；图片 hover 轻微放大。
8. **Small enough to forget** — 全幅图视差；标题四行逐词升起，说明文字最后出现。
9. **Privacy** — 宏观照片揭示；三条承诺按 01→02→03 错开升起，编号解码。
10. **Certified** — 标题先出，四枚徽章 scale .86 → 1 带回弹依次弹出。
11. **Seen through everyday experience** — 照片揭示；三条引言错开升起，来源标签解码。
12. **Community** — 全幅照片视差；三个气泡带回弹依次弹出；右下玻璃卡与两个按钮最后出现。
13. **In their words** — 三张作者图错开揭示，标题与来源随后；占位卡在平板/手机隐藏。
14. **Awards + press** — 四枚奖项弹出；引语逐词升起，括号随卡片出现，媒体 logo 灰阶。
15. **Every detail** — 爆炸图揭示（自下而上）；四角细节卡错开；小图 hover 放大。
16. **Finishes** — 四枚戒指弹出；hover 上浮并轻转 −5°。
17. **FAQ** — 四张问题卡升起；点击 +/− 或标题展开答案（高度过渡 + 淡入），01 默认展开。
18. **Footer** — VOCCI 字标逐词升起；链接列错开淡入；背景为预模糊的产品平铺图。

## 节奏参数

- 缓动：`cubic-bezier(.22,.61,.21,1)`（出场）、`cubic-bezier(.65,0,.35,1)`（线条/揭示）、`cubic-bezier(.34,1.56,.64,1)`（弹出回弹）
- 触发：IntersectionObserver，15% 可见，底部 −6% 边距
- 尊重 `prefers-reduced-motion`：全部动效关闭，内容直接呈现
- 无 JS 时：所有元素为最终状态，不会出现空白

## 0928-e 追加

- **翻页效果修复**：之前 `.page{overflow-x:hidden}` 使 `position:sticky` 失效，现改为 `overflow-x:clip`，hero 钉底、第二屏盖上；footer 被 FAQ 揭开且贴齐底边。
- **Breather（Small enough to forget）**：参考 Longbow 汽车段——图片随滚动从 42% 大小、35% 透明度慢慢放大到充满网格（ease-out 三次），网格线始终在图片之上。
- **用户评价**：三个引言格是窗口，点击/悬停任一引言即切换中间照片；"More stories →" 翻到下一组三条，计数 "01–03 / 06"。04–06 为占位，待真实引言。
- **社区**：照片本身已含气泡，HTML 气泡删除；两个按钮同一行左对齐。

## 0928-i · Breather 改为 Longbow「gallery-sticky」

参考站拆解（`.section--sticky` + `w-gallery-sticky.js`）：区块高 200vh；内层容器 `position:sticky` 钉住一屏；画面初始只占左上角一个网格单元（宽 33.3%、高 50vh），ScrollTrigger 从「区块顶到视口中线」到「区块底到视口顶」之间 scrub，把画面拉到宽 100%、高 100vh；网格线与交点方块始终压在画面之上；长满后接跑马灯。

Vocci 实现：`#breather` 高 = 两行 + 110vh；`.stage` sticky 居中钉住；`.bgimg` 从左上角一格（25% × 50%）随滚动二次缓动长到 100% × 100%；长到 92% 后左下角玻璃文字卡淡入上浮；手机端不启用（普通排版）。

## 0928-k · 区块 2 / 3 重做

- **去掉代码感小字**：所有 "A / 02 ·"、"B / 02 ·"、"01 / 04 ·" 前缀删除，眉题只保留有意义的词（Recording、AI context layer · MCP、Team meetings…）；步骤格只保留序号。
- **去掉 0/1 数字乱码动效**（进入视口与 hover 都不再触发）。
- **区块 2 原型（8 秒循环，进入视口才播放）**：0–2s 「Listening」计时从 00:00 开始 → 2–5s 三句转写逐条出现（Maya / Daniel）→ 5–6.5s 出现「Moment highlighted」橙色标记 → 6.5–8s 「Saved · transcript & summary ready」；底部 2px 橙色进度条走满 8 秒后重头。
- **区块 3 原型（8 秒循环）**：Claude via MCP 状态「Vocci connected」→ 0–2s 逐字输入 "What did the supplier promise on Tuesday?" → 2s 出现上下文芯片「Vocci · Client discussions · 42 min」→ 5s 起答案两行流出 → 循环。原来的 01–03 列表由原型替代。
- **区块 2 镜头**：照片以她手指上的戒指为原点（55%, 61%），进入视口 1.2 秒后用 14 秒缓慢推近到 1.45 倍并停住；该图不再参与视差。

## 0928-l · MCP 轨道入场序列

图标从白底圆片里抠出（只保留图形），底改为磨砂玻璃圆（白 50% + blur 14px + 白色内描边）。入场顺序：0.2s 起画面停在戒指上（以戒指为原点放大 1.6 倍，停 0.8s）→ 1.3s 橙色圆点从戒指弹出并开始涟漪 → 2.2s 两圈虚线轨道浮现、七条连线从戒指逐条画到图标位置（每条错开 0.12s）→ 3.2s 图标依次弹出落在线端（每个错开 0.14s）→ 画面在 2.6s 回到原尺寸后轨道开始缓慢公转。

## 0928-m
- 导航胶囊去掉描边与内阴影，只留玻璃底。
- 网格行高改为 `max(272px, 50svh)`：任何桌面高度下，两行的区块都正好撑满一屏（hero 也是），单行区块半屏；breather 钉在 top:0。
- 区块 2/3 的原型卡改为弹性高度（贴底、随行高伸展），芯片单行省略，不再溢出。

## 0928-n
- 导航：向下滚动时上滑隐藏，向上滚或回到顶部 80px 内时回来。
- 区块 2 缺横线的原因：原型卡替换时多切了一个 `</div>`，把 `.stage` 提前闭合，横线元素掉到网格外；已修。
- 原型加速到 5.5 秒一轮：录音卡 0–1.2s Listening → 1.2–3.2s 转写逐条出现并带橙色声波条 → 3.2–4.3s 第二句左侧亮橙条 +「Moment highlighted」→ 4.3–5.5s 转写变淡、「Saved · summary ready」。芯片放在独立的底部槽位，不再压住文字。MCP 卡：1.1s 打完问题 → 上下文芯片 + 三点思考 → 答案两行。

## 0928-o · 原型去「AI 味」
- 去掉等宽大写芯片、橙色描边标签和进度条；全部改用产品 UI 的真实形态。
- 录音卡 = Vocci App 的录音页：标题「Client discussions」+ 时间；大计时器 + 黑色声波；转写按「人名 / 内容」两栏；单击高亮 = 该句左侧橙条 + 右侧小字 Highlight；保存后转写收起，换成灰底「Summary」卡；底部是圆形录音键（录制时变方块）+ 状态文字。
- MCP 卡 = 聊天线程：右侧灰色气泡打字提问；下面挂一个像真实附件的文件卡（戒指图标 + Client discussions + Vocci · 42:17）；左侧「…」思考点 → 两行回答；底部一个 Reply 输入框。

## 0928-p · 卡片动效对齐 Longbow

参考站拆解：`card-animation` = 卡片初始 opacity 0 / y +50px / scale .85，进入视口 50% 时 1.2s power2.inOut 归位，同屏卡片按 data-delay 错开；`content-reveal` = 图片从角落擦入；hover = 卡内隐藏的 `.hover` 层 0.3s 淡入，露出背后的视频/照片。

本页：
- 滚动入场：所有卡改为 y 50 / scale .85 / 1.2s cubic-bezier(.45,0,.55,1)，触发阈值 35%，同区块每张错开 0.1s；图片仍从左下角擦入。
- hover 才出现：Three moments、How it works、Privacy、Every detail、Finishes、Creators 的次要说明文字默认隐藏（格子右下角留一个橙点提示），hover 时上浮出现；How it works 自动轮播到某步时也会展开该步说明。
- 图片格 hover：底部浮出一张玻璃说明卡（Three moments、四个步骤、创作者）。
- 触屏与手机（无 hover）：全部直接显示。

## 0928-q · 抖动修复
原因：视差 / hero 下沉 / footer 揭开 / 轨道公转每帧都在写 `transform`，而这些元素同时挂着入场用的 1.2s `transform` 过渡，每一帧都在向新目标缓动，看起来就是持续抖动。修法：滚动驱动的位移改写独立的 `translate` / `scale` 属性（不经过 transform 过渡），入场完成后给被驱动的卡加 `.driven` 关闭过渡。

## 参考 · ivycapital.com 首页动效拆解（2026-09-29）

技术：无第三方库，纯 IntersectionObserver + rAF + CSS（site.js · motion.css）。
1. 页面转场 `.plb / .tx-slats / .tx-fade`：进站用"百叶窗"揭示（slats），离站盖幕；固定视频背景 `#pagebg` 由每个 section 的 `data-bgop` 控制透明度（经过视口中线切换，CSS 过渡平滑）。
2. Hero：标题逐字（`.ch`）带模糊→清晰的淡入；副标题蓝字强调；"I Value You" 手写字 + 向下箭头；导航顶部是浮动胶囊，滚动后变满宽玻璃条（`nav--v2 → nav--bar tuck`）。
3. 段落 `p-scroll`：按"字/词"拆成 `.u`，按行分组，随滚动进度逐行上浮（可倒回），段落到视口 72%→40% 之间完成。
4. 数字 count-up：进入视口时 2008 / 296+ / 197 / 29 从 0 滚到目标。
5. section 标题 `.sec-anim .bt`：只有文字上浮 .8s，线条/盒子/角标静态直显；侧边竖线 `grid-overlay .vline` scaleY 从上往下画出 1.4s。
6. 卡片 `data-reveal`：opacity 0 + y 24px → .8s，`--d` 逐张错开。
7. 代表项目卡 hover：背景放大 1.06，底部半高的玻璃板 `card-project__plate` 以 clip-path 从下往上揭出，标题与说明（`grid-template-rows:0fr→1fr`）展开，同时另一处显示公司简介浮卡。
8. 合作机构跑马灯 `.marquee__track`：38s 线性无限循环，hover 暂停。
9. 荣誉卡：同 data-reveal 错开；`dot--live` 圆点脉冲光环。

## 0928-r · ivycapital 动效移植（只加动效，不改版式）
1. 进站：8 条深色竖板从上往下依次收起（百叶窗），0.35s 后内容开始入场；离站：点击外链时竖板从下往上合拢再跳转。底层加固定的模糊产品图 `#pagebg`，每个 section 带 `data-bgop`（照片区 0、白/浅灰区 .4–.5），经过视口中线时切换透明度；白色/浅灰网格底改为 90% 不透明，让底图微微透出。
2. Hero 标题逐字：模糊 10px → 清晰并上浮，每字错开 32ms；副标题 "real life" / "AI tool" 用品牌橙强调。
3. 导航：顶部为浮动胶囊，滚动 40px 后变为满宽玻璃条（替代之前的滚动隐藏）。
4. 段落 p-scroll：区块 2/3 说明、Three moments 说明、Where the ring…、Small enough…、人群引言：按词拆分、按行分组，随滚动在视口 78%→45% 之间逐行上浮，可回滚。
5. 数字 count-up：Every detail 的 3–5 g / 6.8 mm / 2.85 mm / 8 h / 30 min / 80%，Certified 的 27001 / 27701，进入视口 60% 时 1.4s 滚到目标。
6. 媒体 logo 跑马灯：26s 线性循环，两端渐隐，hover 暂停。
7. 图片格 hover：底部 46% 高的玻璃板用 clip-path 从下向上揭出，标题随之出现（替代之前的淡入说明卡）。
8. Privacy 01/02/03：编号前加橙点 + 2.4s 扩散光环。

## 0928-s · 荣誉卡 hover（ivycapital 项目卡风格）
Awards 四张、Certified 四张：hover 时底图淡入并从 1.08 缩回 1（你提供的四张彩色玻璃图：竖纹渐变、半调网点、模糊渐变、全息流体），上面压一层 28% 白 + 18px 磨砂玻璃，徽章恢复彩色、文字加深；移开时淡出。入场仍是逐张错开上浮。
- 0928-t：hover 后徽章、月桂、文字全部反白（徽章 invert + 提亮），底图上压 12% 深色磨砂，保证可读性。
- 0928-u：百叶窗与底层背景改为 liquid glass（8 条竖板各显示玻璃图的一片，拼成整幅后依次收起）；Awards / Certified 八张卡 hover 底图换成新提供的八张玻璃/流体图（Awards：橙铬、橙光弧、橙条纹、橙波线；Certified：铬液、蓝峰竖纹、蓝涟漪、白铬），底图只压 10% 白 + 3px 微磨砂，文字与徽章保持墨色。
- 0928-w：百叶窗与底层背景改为纯 CSS liquid glass，不用任何图片。竖板 = 半透明玻璃（backdrop-filter 22px 模糊 + 饱和度/亮度提升）透出下方页面，左缘 2px 高光、右缘 1px 暗边模拟厚度，斜向高光扫过时带一丝蓝/橙色散；收起时页面从玻璃后面"显影"。底层 `#pagebg` = 浅灰渐变上三个大而柔的高光团（白 / 微橙 / 微蓝）缓慢漂移，随 data-bgop 淡入淡出。
- 0928-y：去掉竖板上的斜向高光扫过，只保留上下边缘的柔和高光；玻璃板垂直收起，不再像倾斜的百叶窗。
- 0928-z：桌面/平板下网格行高改为固定值（原来是 minmax(行高, auto)，内容一高整行就被撑开）；格子内容超出时裁切。实测 1440×900 每区 900、1280×720 每区 720。
- 0929-a：导航在 hero 之后（滚动 >80px）整体上滑收起；鼠标移到视口顶部 28px 热区或导航本身时滑回（满宽玻璃条形态），移开 0.5s 后再收起；回到页面顶部恢复常显胶囊。
- 0929-b：录音卡转写行重叠修复——固定行高后卡片是弹性列，转写列表被压缩导致行叠行；列表改为不可压缩，行距 7px、行高 1.4。
- 0929-c：区块 2/3 原型卡改为"中段吸收高度"：标题、计时器、底部控制行/输入框固定不压缩，转写列表 / 回答区随格子高度伸缩并内部裁切，任何视口下底部控制行都可见（1300×700、1440×780、1440×900 实测）。段落逐行上浮的最低透明度提到 55%，并在段落到视口 72% 前完成，灰字不再难读；矮视口（<840px）下卡片自动用紧凑尺寸。
- 0929-d：MCP 区左上角的空玻璃格删除，照片改为横跨四列整幅，聊天卡直接压在照片上（与 hero、社区区一致）。
- 0929-e：Awards 四卡 hover 底图 = 液态铬系列（白铬、铬液、橙铬、橙光弧）；Certified 四卡 = 纹理系列（蓝峰竖纹、橙条纹、蓝涟漪、橙波线）。
- 0929-f：区块 2/3 的原型从左下角文字卡拆出，放到右下角独立玻璃格（col 4 · row 2），文字卡恢复正文行距；MCP 轨道两枚右侧图标角度微调，避开新格子。平板下原型格排在文字卡下一行。
- 0929-g：区块 2/3 右下角原型格去掉磨砂玻璃底，原型卡在格内水平垂直居中（最宽 340px），改用柔和投影和照片分层。
- 0929-h：Where the ring earns its place → How it works 加翻页，与 hero → 第二屏相同：`#scenes2` 桌面/平板下 `position:sticky` 钉住（区块高于视口时 top 取负值，保证底边可见），`#how` 从下方盖上来（底色改为不透明白）；随覆盖进度照片放大 1→1.12、压暗到 55%，两个文字格下沉 140px 并淡出；完全盖住后隐藏，不再透到后面的半透明区块。手机端不启用。
- 0929-i：How it works 改为 3D 戒指「冲破格子」（参考 Vocci_3Dmodel_demo 的 act3，桌面 ≥1101 且支持 WebGL2 时启用；平板/手机/减少动效时保持原来的静态四格 + 自动轮播）。
  - 素材：`img3/ring.glb`（参考稿内嵌的戒指模型，meshopt 压缩）、`img3/studio.exr`（棚拍光照；解析失败时退回 three 自带的 RoomEnvironment）。`src/build-3d.sh` 打包出 `vendor/how3d.js`（three.js r160 + 加载器 + `src/how3d.js`）和 `vendor/how3d-assets.js`（模型与光照的 base64，预览站不能直接托管 .glb/.exr，且这样直接双击打开 index.html 也能用）；motion.js 只在桌面端按需加载。
  - 区块钉住 3 屏：网格平面即 z=0。戒指在平面后方的部分只画在 01 格里（scissor），前方的部分画满整个网格，所以读起来是戒指从 01 格里向前顶出来、压过格线。中心穿过平面的瞬间 01 格框闪橙并放出一圈冲击波。
  - 冲出后戒指落到第二行中段，随滚动依次走到 01→04（格间有小跳跃 + 转一圈），当前列高亮、其余列压暗去色，说明文字展开；身后拖出录音波形，每步留下橙色手势符号（双击 ‖ / 转写三行 / 长按 ⊓）。
  - 每步反馈：01 按键闪两下 + 两次震动，胶囊 REC 计时；02 TRANSCRIBING；03 按键按下、橙光渐强、外圈进度环随滚动填满，胶囊进度条 → SENT；04 按键常亮橙光、两圈涟漪、胶囊变橙 AGENT ACTIVE。
  - 01 格在戒指离开后显示蓝图组件（虚线轮廓、按键位置、规格标注），作为这一格的示意画面。
- 0929-j：How it works 上排 02–04 格在戒指走到该步时，照片模糊淡出，换成深色 Vocci App 卡片（界面与文案取自 Vocci_3Dmodel_demo 的演示台，强调色改为品牌橙），内容随滚动播放、可倒回：
  - 02 · Vocci App：录音页 "ready for transcription" → 点 Transcribe（进度条走满）→ Chat 转写逐条出现（Mia / Ian / Ray），两条高亮变橙并展开 Insight，标签切到 Highlights → Notes 页（会议纪要 + Summary）。
  - 03 · Vocci Agent：长按时中央橙点呼吸「Holding · listening」，语音指令逐字出现 → 松手 Send to Agent 变橙 → 思考三点 → 「Reminder set」「Draft ready in Mail」两张结果卡。
  - 04 · Claude：提问 "What did we decide about the launch?" → 「Reading Vocci · Product Sync」通过 MCP 取上下文 → 回答逐字流出 → context via Vocci MCP 标签 + 可接入工具（ChatGPT / Claude / Claude Code / any MCP tool）。
  - 已走过的格保留 App 最终画面（随非当前列一起压暗），往回滚则恢复照片。
- 0929-k：How it works 上排三张占位图（手持手机、戴戒指的手、聊天截图）在 3D 模式下去掉（平板/手机无 3D 时仍显示）。开场改为：3D 戒指停在上排正中央（02/03 两格交界），滚动时像车轮一样向左滚进 01 格，到位后沉入格子后方，再照原流程从 01 格冲出、走完 01→04；02–04 格在对应步骤出现 App 卡片。钉住距离由 3 屏加到 3.6 屏，各步时间点整体后移。
- 0929-l：「Seen through everyday experience」评价屏并入社区屏，人脸大图删除。社区照片里原本印着的三个气泡（其中「Build with us」被裁断）已从照片中抹掉（`img3/community-clean.jpg`）。三条真实评价做成白色毛玻璃对话气泡贴在照片空墙处：进入视口后依次弹出，先显示「正在输入」三点，再出现引言和来源；之后每 3.4 秒轮流高亮一条（橙色描边 + 首字母头像变橙），鼠标悬停可停在某条。右下卡片合并为「Seen through everyday experience.」+ 加入社区文案 + Discord / Reddit 按钮 + 「Quotes as posted on Reddit & Discord」。导航 Stories 指向这一屏。平板为左上/右上/左下三处气泡，手机为照片下方的气泡列表。占位评价 04–06 与翻页去掉。
- 0929-m：Logo 换成 Vocci_3Dmodel_demo 里的标志（O 为顶部开口的戒指 + 两道按键弧线）。原稿只有 205×56 的白色 PNG（留在 `img3/vocci-logo-ref.png` 作对照），按其几何重画为矢量 `img3/vocci-logo.svg`（描边 = currentColor，可随底色变色），叠图比对基本重合。导航字标（高 20px）与页脚大字标（仍按词遮罩升起）都改为内联 SVG。
- 0929-n：Every detail, considered 中间大格的静态爆炸图换成实时 3D（桌面；平板/手机仍为静态图），不钉住。
  - 戒指轴向横放、3/4 视角；这一屏从视口底部升到顶部的过程中，零件沿轴向拆开（外壳 +0.42、两道端部密封环 ±0.62、内衬 −0.28 个直径，参数同参考稿），同时缓慢转动；往回滚会合上。
  - 拆开后依次从零件画引线到四角卡片，卡片标签变橙：内衬 → 标题卡（Titanium inside and out）、按键 → The button、6.8 mm 尺寸线 → True to size、端部密封环 → IP67。外壳下方出现橙色 6.8 mm 工程尺寸线。悬停卡片：对应零件发橙光、引线变橙、卡片底色变浅灰。
  - 中间格加虚线轴线、左上「Exploded view」、左下「VOCCI R1 · Ø 26.9 mm · IP67」。
  - 共用：模型与光照只解析一次（`shared()`），How it works 与本屏各自克隆场景、各自一个 WebGL 画布。
- 0929-o：爆炸图改为「冲破格子」：3D 画布铺满整屏网格，戒指起初沉在中间格后方（格子平面后的部分只画在中间格内），随滚动向前穿出平面；拆开幅度放大 1.7 倍，两端零件伸出中间格、压过两侧格线。三张图片卡（The button / True to size / IP67）起初关闭，各自的引线画到卡片边缘时，卡片从引线那一侧展开；标题卡始终可见。三张图改为提前加载，避免展开时空白。
- 0929-p：In their words 改为视频墙：左列（跨两行）标题 + 说明 + Watch all on YouTube；两张视频卡各跨两行（16:9 暗调统一的缩略图、磨砂玻璃播放键、YouTube 标、频道、标题、Watch review →），悬停缩略图放大恢复色彩、播放键变橙、箭头右移；第三格为 Become a creator 邀请卡（方格底 + 虚线加号）。占位「Creator title placeholder」删除。链接暂为 #，待提供视频地址。
- 0929-q：全站文字加 hero 同款动效（模糊 10→0、上浮、渐显）：各区块 h2/h3 逐字，正文/引言/小标签逐词，进入视口时触发一次。跳过：hero（自有）、已逐行上浮的段落、3D 区 App 卡与蓝图、社区气泡、count-up 数字、页脚大字标。原「按词遮罩升起」只保留在页脚字标。
- 0929-r：In their words 按 sangar.framer.website「Our process」重排：顶行左上橙色方块眉题「Creator reviews」、2–3 列大标题、右上「[ 2026 ]」；下方四列卡片错落（2、4 列下移），每张卡片顶部 3px 橙条、浅灰底、编号 + 来源（00 Unscripted / 01 YouTube · Product Manager / 02 YouTube · Creator / 03 Creators program），底部深一档灰条放「Watch review →」「Become a creator →」。介绍卡的「Watch all on YouTube」改为与全站一致的深色实心按钮。去掉穿过卡片的行线与下缘方块；区块高度随内容。
- 0929-s：In their words 回到标准 4×2 网格（与其他区块同高一屏）：左列跨两行 = 默认 h2 左对齐 + 说明 + 底部 btn；其余三列各一张跨两行的卡片（顶部 3px 橙条、`.label` 来源、缩略图撑满中部、默认 h3、底部浅灰条内 `.tlink`），不再自定义字号/字体，不再错落。无行线。第三张邀请卡用 `img2/n451.jpg` 作占位图，叠磨砂玻璃「+ Your review here」。手机端缩略图固定 16:10。
- 0929-t：In their words 恢复 0929-r 的错落卡片设计（编号标签、橙色顶条、浅灰卡底、深灰底条），但放进标准 4×2 网格：四列各一个跨两行的格子，卡片在格内错落（2、4 列更高），区块高度一屏；标题为默认 h2 左对齐在左上。第三张卡保留 `img2/n451.jpg` 占位图，去掉「+ Your review here」浮层。
