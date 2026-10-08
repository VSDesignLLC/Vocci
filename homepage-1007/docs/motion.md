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
- 0929-u：Finishes 改为 3D 配色选择器（4×2 网格）：左上标题「Four finishes. One ring.」+ 说明；左下「Selected」当前配色名与参数表（Finish / Material / Weight / Water）；中间两列跨两行为实时 3D 戒指（复用同一模型，缓慢旋转，进入视口时从下方升起放大）；右列四个选项（编号、色块、名称、材质、选中时展开一句描述 + 橙色左条）+ Buy now + Get a sizing kit + 「Current offer available in the store」。悬停/点击切换，停留时每 4 秒自动轮换，悬停列表时暂停。材质按时间过渡约 0.5 秒：Lumen 镜面银、Midnight 外壳与内圈都哑光黑、Dawn 镜面金外壳 + 银内圈、Lux 哑光黑外壳 + 银边与内圈。不显示价格。平板/手机无 3D 时切换对应的静态 PNG。
- 0929-u 修复：手机端页脚（sticky 垫底层）一直可见，会从上方各区块透明处透出文字；现在手机端也只在 FAQ 底边接近视口底部时才显示页脚。
- 0929-v：Finishes 去掉中间竖线；3D 画布铺满整屏网格，戒指起初沉在中间格后方（只在格内可见），随区块进入向前穿出格子平面并放大到比格子更宽，旋转到横向时两侧越过左右格线。删除「VOCCI R1 · Ø 26.9 mm」装饰文字；爆炸图屏的「Exploded view」「VOCCI R1 · Ø 26.9 mm · IP67」同样删除。
- 0929-w：页脚加入充电盒 3D（桌面）：盒子四个零件本就在 ring.glb 里（case_lid / case_lidin / case_base / case_inner），按参考稿「dock」章节的参数搭建——盒子放在戒指下方 1.55 个直径处，盒盖绕铰链（-0.3971·盒深）转开 2.36 rad，戒指翻平后落到停靠点；材质：盒盖缎面、盒身镜面、内衬哑黑。由 FAQ 揭开页脚的进度驱动：页脚刚露出时戒指悬在合着的盒子上方 → 盒盖转开 → 戒指翻平落进盒中；滚到底时停在「盒开、戒指入座」。位置在页脚下半部正中（跨 2/3 列格线），不压 logo 与链接；可倒放。
- 0929-x：Finishes 选中项改为全站统一的磨砂玻璃卡片（--glass 底 + 22px 模糊 + --glass-line 白描边 + 圆角 + 柔和投影，与 hero 卡同一套变量），去掉橙色左竖条，选中态保留橙色编号；选中卡相邻的分隔线隐藏。
- 0929-y：页脚的充电盒 3D 删除（恢复原页脚）。Finishes 戒指缩小到中间格中央约一半宽（停稳后不再越过格线，仍保留从格子后方向前穿出的入场）。
- 0929-z：Privacy 与 Certified 合并为一屏（Certified 区块删除）：左列跨两行 = 标题 + 一句说明 + 四枚认证（ISO 27001 / ISO 27701 / SOC 2 / GDPR，灰阶徽章小卡）+ Trust Center 按钮；中间两列跨两行 = 戒指微距大图，去掉中间竖线；右列「Our promises」01→03 从上往下，说明常显，当前项为磨砂玻璃卡（与 Finishes 选中项同款），在视口内每 3.6 秒轮换、悬停停住。去掉通用线性图标、行线、右下空格与模糊底图透出（文字格纯白）。
- 0929-z（修订）：撤回 Privacy/Certified 合并，两屏恢复原样式。Privacy 只改三处：编号顺序 = 左列标题 → 01（标题下方）→ 右列 02（上）→ 03（下）；照片完整占中间两列两行，删掉右下空白格；三条说明常显（不再悬停才出现），紧跟在标题下方。
- 0929-aa：Hero 换成客户倾向的「亚麻桌面 + 写字的手 + 手机录音波形」图（`img3/hero-linen.jpg`）。原图里 AI 生成的充电盒整体抹除（inpaint + 亚麻纹理回填），换成真实产品渲染（开盖正俯视：真实 VOCCI logo、真实充电位结构），按照片的暖色侧光调色并加接触阴影与投影。手上的金戒保留原图。原图中旧盒子的椭圆投影已补光去除，新投影按新盒子轮廓、沿照片光线方向（左上→右下）重投。
- 0929-ab：Hero 盒子移到画面正中（中心对准第 2/3 列竖线与两行横线的交点）。原位置的旧盒子与其整片投影重新抹除（按多边形遮罩，低频光照在 1/4 尺寸 inpaint 后放大，再回填亚麻纹理），新投影按新位置沿光线方向重投。另导出只含盒子的透明层 `img3/hero-case.webp`（与照片同画布、同裁切），作为第二张 `.bgimg.hero-top` 叠在格线之上（z-index 4），所以格线从盒子下面穿过、盒子压着线；滚动时两层一起缩放压暗。手机端无网格，不加载该层。
- 0929-ac：Recording（演讲者）与 MCP（交叠的手）两张照片里的戒指换成真实 Vocci 渲染（正面带按键与边线的一段，按手指上戒指的四角透视贴合、按场景光调暗调暖）；两张图 2× Lanczos 放大 + 锐化（recording-presenter 2808×1800、mcp-hands 3776×2160）。注：环境内无法调用 AI 超分，清晰度提升有限，原图素材本身分辨率低。
- 0929-ad：Hero 盒子投影改为与照片里植物影子同色同强度（按实测 R/G/B 衰减 0.67/0.65/0.62 相乘，暖色、边缘更实），盒子本体调暖以匹配下午暖光。
- 0929-ae：去掉开场与离站的 liquid glass 竖板幕布（#tx），页面直接开始入场动效。
- 0930-a：替换五张照片为客户新图：ring-macro（Privacy）、mcp-hands（MCP）、recording-presenter（Recording）、pain-ideas、pain-workflow（Three moments），并重新生成对应模糊底图。
- 0930-b：MCP 区 mcp-hands 换为客户新图（戒指按键可见的版本），模糊底图同步更新。
- 0930-c：MCP 轨道圆心移到新图戒指按键上（--cx 23% / --cy 40%，轨道层坐标；入场放大原点 42% 41%），1280/1440/1920 宽实测对位。
- 0930-d：修复 3D 不加载：预览站不支持带 ?v= 的脚本地址（请求失败后回退到静态图）。改为按内容哈希命名的文件 vendor/how3d.<hash>.js（patch.py 生成并引用）。
- 0930-e：新增 src/embed.py，生成单文件版 dist/vocci-homepage-standalone.html（全部图片/字体为 data URI，3D 代码与模型内联，去掉 Google Fonts 与 Lenis CDN；约 16 MB，离线可用）。
- 0930-f：Figma 导入用静态稿：src/figma_static.js + src/embed_static.py 生成 dist/figma-static.html（hover 前）与 dist/figma-static-hover.html（所有 :hover 规则强制生效）。1440 宽，动效全部停在终态，3D 画面烘焙为 PNG（How it works 停在第 04 步），去掉脚本/钉住/逐字拆分，素材全部内嵌（各约 13 MB）。
- 0930-g：Figma 静态稿 How it works 修正：上排四格改为整格截图（App 卡片用了 CSS scale，导入工具不识别会被裁半），3D 戒指裁出放进 01 格，去掉浮在文字上的波形/状态胶囊/戒指层，四步说明全部正常显示。

## 1007 · homepage_jia_1007（基于 homepage_jia_0929 @ 7c4482b）
- **去掉所有文字渐显**（便于搜索引擎 / AI 抓取正文）：删除 hero 标题逐字模糊、全站 h2/h3 逐字与正文逐词模糊上浮（0929-q）、标题按词遮罩升起、段落逐行随滚动上浮（p-scroll）、数字 count-up；卡片入场不再从透明开始（只保留 28px 上移）；"hover 才出现"的说明文字、FAQ 答案、Breather 文字卡、社区评价气泡（原先先显示"正在输入"再出现引言）全部首屏直接可见。正文不再被拆成逐字/逐词的 span。
- **第二、三屏去掉录音中 / 对话 UI 卡片**：App 里没有录音中的功能界面，只有设备头像处的 Recording 小提示，因此 Recording 与 MCP 两屏右下角的原型卡删除，照片完整露出。
- **手机端 3D 改静态图**：3D 包（three.js + 模型，约 4 MB）本就只在桌面（宽 >1100、可 hover、支持 WebGL2）加载；手机/平板实测不请求任何 3D 资源。How it works 在无 3D 时原先显示的是旧占位照片，现在换成从桌面 3D 序列烘焙的四张静态图（`img3/how-static-1..4.jpg`：01 格 3D 戒指、02 Vocci App 会议纪要、03 Vocci Agent、04 Claude via MCP），手机上按 4:5 完整显示。Every detail（`detail-exploded.png`）与 Finishes（四张配色 PNG）在无 3D 时沿用已有静态图。
- `dist/`（单文件版、Figma 静态稿）未复制到 1007，需要时用 `src/embed.py` 等重新生成。
- 1007-b：
  1. 网格交点方块改为白色圆点（7px，带一圈细描边，白底区块也看得见）。
  2. 社区评价气泡恢复"正在输入 → 出现引言"的动画（引言文字仍在 HTML 里，抓取不受影响）。
  3. 手机 How it works：保留桌面的"四步一排"结构，做成横向滑动卡片（每张 = 上方静态图 + 下方步骤文字，露出下一张一角），下方 4 个圆点跟随当前步骤，当前步骤文字卡顶部橙线。
  4. 手机端去掉文字格的大块留白（文字格高度随内容，统一内边距 22/20/24）。
  5. Breather 手机端为一整张方图（不再沿用桌面"从一格长满"的尺寸）。
  6. 手机端所有照片完整显示：清除桌面视差位移与半揭开状态，模糊底图层不显示。
  7. 手机社区：评价气泡排在照片下、文字上。
  8. Every detail 去掉实时 3D 爆炸模型（vendor 包不再挂载 #hardware），所有设备显示客户稿里的静态爆炸渲染图。
  9. 手机页脚改为普通区块，排在 FAQ 之后完整显示。
  - 窗口拖动跨过 700 / 1100 px 时自动重新加载，避免桌面脚本（3D、钉住、生长、视差）的状态残留在窄屏布局里。

## 1007-d
- Phone/tablet How it works: cards 02–04 reuse the desktop app phones (APP markup + 0929-j CSS, now unscoped); card 01 reuses the desktop REC pill + ripples. Each loops ~9s while visible.
- Phone: sections read title → image → text (why, scenes interleaved, scenes2, privacy, hardware, finishes); How it works gets a mobile-only "How it works." title.

## 1007-f · tablet
- Tablet (701–1100) now uses the phone structure: patch.py remaps phone rules `max-width:700px` → 1100 (and JS `innerWidth<=700` → 1100) at build time.
- Tablet-only tuning lives in `@media(min-width:700.5px) and (max-width:1100px)`: 40px side padding, 42px headings, 17px body, How it works shows 2 cards per view.

## 1007 · Figma-import static pages
- `figma/vocci-1007-{desktop-1440,tablet-768,mobile-390}.html`: self-contained (images/fonts inlined), no scripts, every motion at its end state.
- Built in two steps: run `src/figma_freeze.js` in a browser at each width on the local build (it scrolls through, freezes the end states, swaps sections for clean copies so no script keeps writing, and POSTs the DOM to a local receiver), then `python3 src/figma_static.py <snap-dir>` resolves every @media rule for that width, converts vw/vh/svh to px, pins the page width and inlines assets.
- Desktop How it works / Every detail use still images (no 3D) so they import as real layers; app screens show their final step and use `zoom` instead of `scale` (importers ignore `scale`).
