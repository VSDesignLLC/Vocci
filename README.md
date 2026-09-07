# Vocci 网站设计 Demo

围绕 Vocci 戒指的品牌信息、视觉方向与 landing page 叙事进行设计探索。当前工作版本为 **Option B1.5**。

## 打开项目

打开 [index.html](index.html)，即可在原四个方案、B1 和 B1.5 之间切换，默认显示 B1.5。它现在直接承载方案切换功能，是根目录唯一入口。

也可以从项目目录启动本地服务：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

随后访问 [本地入口](http://127.0.0.1:8765/) 或 [B1.5 独立页面](http://127.0.0.1:8765/2026-09-07-option-b1.5.html)。B1.5 以 1440px 为设计基准，支持 1280px 及以上桌面浏览器宽度。

## 页面与版本

| 文件 | 用途 |
| --- | --- |
| [index.html](index.html) | 统一方案切换入口，默认 B1.5 |
| [2026-09-07-option-b1.5.html](2026-09-07-option-b1.5.html) | 当前稿：玻璃导航、全屏叠卡、固定四步流程、产品网格与信任区 |
| [2026-09-07-option-b1.html](2026-09-07-option-b1.html) | B1：日常佩戴场景、手部影像与 AI 工作流信息 |
| [2026-09-03-option-1.html](2026-09-03-option-1.html) | 原 Option 1 |
| [2026-09-03-option-2.html](2026-09-03-option-2.html) | 原 Option 2，B1 / B1.5 的探索起点 |
| [2026-09-03-option-3.html](2026-09-03-option-3.html) | 原 Option 3 |
| [2026-09-03-option-4.html](2026-09-03-option-4.html) | 原 Option 4 |
| [2026-08-31-all-options.html](2026-08-31-all-options.html) | 最早的全部方案合辑，保留作历史对照 |
| [2026-08-31-参考案例板.html](2026-08-31-参考案例板.html) | 最早的参考案例板 |

除固定入口 `index.html` 外，HTML 统一采用 `YYYY-MM-DD-版本名称.html`。日期表示该版本归档日期，不随每次小修改变化。旧版本日期依据 Git 记录，备份依据原目录的 0903 标记；今天两个文件去掉原名称中的多余编号，分别保留 B1 和 B1.5。

## 文件夹结构

```text
VOCCI/
├── index.html                         # 唯一日常入口
├── 2026-09-07-option-b1.5.html         # 当前工作稿
├── 2026-09-07-option-b1.html           # B1
├── 2026-09-03-option-1…4.html          # 原四方案
├── 2026-08-31-*.html                  # 早期合辑和参考板
├── assets/
│   ├── b1-5/                          # B1.5 CSS、JS、Geist 字体与许可证
│   ├── b1/                            # B1 CSS、JS、场景照片与生成记录
│   ├── product/                       # 产品图片与产品参考素材
│   ├── manufacture/                   # 制造过程图片
│   ├── ui/                            # App 界面素材
│   └── …                              # 共用素材与视觉参考
├── docs/                              # 会议、产品依据、品牌分析和设计文档
├── 0903 website demo v1/              # 09/03 历史备份，HTML 同样带日期
└── sections.png                       # 页面章节与版式参考拼图
```

备份目录内的 [历史入口](<0903 website demo v1/2026-09-03-demo-shell.html>) 仅用于查看该次快照，共用图片从 `../assets/` 读取。平时从根目录 `index.html` 进入即可。

## 修改位置与设计依据

- B1.5 页面结构及文案：[2026-09-07-option-b1.5.html](2026-09-07-option-b1.5.html)
- B1.5 样式：[assets/b1-5/style.css](assets/b1-5/style.css)；交互：[assets/b1-5/script.js](assets/b1-5/script.js)
- 当前视觉规则：[design system.md](<docs/design system.md>)
- 分轮修改与验证：[B1.5 交付记录](docs/0907-b1.5-delivery.md)
- 品牌依据：[品牌审阅](docs/0907-brand-review.md)、[Option 2 探索](docs/0907-option2-exploration.md)、[项目待办](docs/0907-project-todo.md)
- B1 定稿：[Message](docs/0907-b1-content.md)、[设计依据](docs/0907-b1-design-plan.md)、[图片生成记录](assets/b1/README.md)

产品图当前用于模拟 3D 镜头；Logo 与 testimonial 的真实内容仍待替换。调整公共素材前，可先搜索引用，避免影响历史方案。

## Git 与部署

GitHub 项目：[VSDesignLLC/Vocci](https://github.com/VSDesignLLC/Vocci)。当前工作分支：`2026-09-07`。

已有 Vercel 项目：[VSDesign / vocci-demos](https://vercel.com/vsdesign/vocci-demos)。本地通过 `.vercel/project.json` 关联，后续部署继续使用该项目。

上次线上预览对应提交 `8c0e61e`，本次文件重命名尚未重新部署。部署包仅包含网页和所需素材；内部 `docs/`、本地环境文件及历史备份不作为静态网站内容上传。

建议安装 Vercel CLI：

```sh
npm i -g vercel
```

随后可使用 `vercel deploy`、`vercel logs` 和 `vercel env pull`；未全局安装时也可通过 `npx vercel` 调用。部署前确认 `.vercel/project.json` 仍指向已有 `vocci-demos` 项目。
