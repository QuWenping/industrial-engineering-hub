# Industrial Engineering Studio — 全站视觉风格 & 素材需求清单

> 给 ChatGPT/Midjourney 生成图用。所有素材统一风格：**工业工程、专业、极简、蓝图感**。
> 格式优先 SVG（图标）或 PNG 透明底（插画/背景）。

---

## 一、品牌色板（所有素材统一用这 5 个色）

| 色名 | HEX | 用途 |
|---|---|---|
| Navy（深海军蓝） | `#0B1F3A` | 主深色背景、Header/Footer、Logo 底 |
| Engineering Blue（工程蓝） | `#1677FF` | 主色/按钮/链接/图标主色 |
| AI Glow（AI 青） | `#00D4FF` | 高亮/渐变终点/数据可视化 |
| Accent Green（成功绿） | `#00B578` | 成功状态/CTA 辅色 |
| Light BG（浅底） | `#F8FAFC` | 页面浅色背景 |
| Dark BG（暗底） | `#05070B` | 最深背景（少用） |

**渐变**：`#1677FF → #00D4FF`（蓝→青，用于按钮/标题/Logo）
**文字**：深色页用白色/`#94A3B8`(副文本)；浅色页用 `#0B1F3A`(标题)/`#64748B`(正文)

---

## 二、Logo & 品牌标识

### 2.1 Logo Mark（图标标）
- **现状**：深蓝圆角方块 + 渐变 Σ（西格玛符号）+ "ENGINEERING" 小字
- **需要**：一个更精致的工业工程品牌图标
- **尺寸**：SVG，可缩放。用于 Header(36px) / Footer(36px) / Favicon(32px/180px)
- **ChatGPT 提示词**：
  > A minimalist logo mark for an industrial engineering company. A geometric symbol combining a building/structure silhouette with a blueprint grid motif. Navy (#0B1F3A) rounded-square background, gradient (#1677FF to #00D4FF) line art. Clean, professional, scalable SVG style. No text. 200x200.

### 2.2 Wordmark（文字标）
- **现状**："IE Studio"（Header）/ "IES"（Footer 简写）
- **需要**：统一 "Industrial Engineering Studio" 全称 + "IES" 简写
- **字体**：Inter Bold（英文标题），JetBrains Mono（数字/代号）
- **ChatGPT 提示词**：
  > Typography wordmark "Industrial Engineering Studio" in Inter font, bold, navy (#0B1F3A) on transparent background. Clean, modern, engineering feel. Horizontal layout. SVG.

### 2.3 Favicon
- **现状**：SVG Σ 简化版（可用但偏简单）
- **需要**：32×32 + 180×180（Apple Touch Icon），和 Logo Mark 一致
- **直接用 Logo Mark 缩放即可**

---

## 三、服务图标（6 个，替换 lucide 通用图标）

**风格要求**：线条/outline 风格，2px 描边，圆角线帽，工程蓝图感，`#1677FF` 单色或 `#1677FF→#00D4FF` 渐变。48×48 SVG，透明底。

| # | 服务名 | 现用图标 | 需要的工业图标 | ChatGPT 提示词 |
|---|---|---|---|---|
| 1 | Industrial Building Design | Factory | 工业厂房轮廓（带烟囱/钢架） | Minimalist outline icon of an industrial factory building with steel frame and chimney, 2px stroke, rounded corners, blue (#1677FF), transparent background, 48x48, SVG style |
| 2 | Structural Engineering | HardHat | 钢结构节点（工字钢截面+螺栓） | Minimalist outline icon of an I-beam steel cross-section with bolts, 2px stroke, rounded, blue, transparent, 48x48, SVG |
| 3 | HVAC & MEP Engineering | Wind | 风管+管道交叉（HVAC duct + pipe） | Minimalist outline icon of HVAC duct and pipe crossing, 2px stroke, rounded, blue, transparent, 48x48, SVG |
| 4 | Chemical Plant Engineering | FlaskConical | 化工反应釜+管道 | Minimalist outline icon of a chemical reactor vessel with connecting pipes, 2px stroke, rounded, blue, transparent, 48x48, SVG |
| 5 | Energy Facility Engineering | SolarPanel | 电力塔/变电站轮廓 | Minimalist outline icon of a power transmission tower, 2px stroke, rounded, blue, transparent, 48x48, SVG |
| 6 | Digital Engineering & AI | Cpu | BIM 线框立方体/数字孪生 | Minimalist outline icon of a 3D wireframe cube (BIM/digital twin), 2px stroke, rounded, blue, transparent, 48x48, SVG |

---

## 四、行业图标（4-6 个）

同上风格（outline, 2px, blue）。

| # | 行业名 | 需要的图标 | ChatGPT 提示词 |
|---|---|---|---|
| 1 | Battery Manufacturing | 电池组+工厂 | Outline icon of battery cells in a factory setting, 2px stroke, blue, transparent, 48x48, SVG |
| 2 | Chemical Plants | 化工园区+储罐 | Outline icon of chemical storage tanks with piping, 2px stroke, blue, transparent, 48x48, SVG |
| 3 | Energy Facilities | 风机+光伏 | Outline icon of wind turbine and solar panels, 2px stroke, blue, transparent, 48x48, SVG |
| 4 | Smart Factories | 机械臂+工厂数字化 | Outline icon of a robotic arm in a smart factory, 2px stroke, blue, transparent, 48x48, SVG |

---

## 五、计算器类别图标（7-8 个）

| # | 类别 | 图标描述 | ChatGPT 提示词 |
|---|---|---|---|
| 1 | Mechanical Engineering | 齿轮+轴 | Outline icon of a gear and shaft, 2px, blue, 48x48, SVG |
| 2 | Material Engineering | 材料层叠+密度 | Outline icon of stacked material layers, 2px, blue, 48x48, SVG |
| 3 | Thermal Engineering | 热交换器+温度 | Outline icon of a heat exchanger with temperature symbol, 2px, blue, 48x48, SVG |
| 4 | Chemical Engineering | 反应釜+分子 | Outline icon of a reactor with molecule symbol, 2px, blue, 48x48, SVG |
| 5 | Construction Engineering | 塔吊+建筑 | Outline icon of a tower crane, 2px, blue, 48x48, SVG |
| 6 | Electrical Engineering | 电路+闪电 | Outline icon of a circuit board with lightning, 2px, blue, 48x48, SVG |
| 7 | Structural Engineering | 梁柱+应力 | Outline icon of a beam with stress arrows, 2px, blue, 48x48, SVG |
| 8 | General Engineering | 卡尺/工具 | Outline icon of a caliper/measuring tool, 2px, blue, 48x48, SVG |

---

## 六、UI/导航图标（用 lucide 即可，无需自定义）

这些通用 UI 图标用 lucide-react 现成库即可，不需要生成：
- 导航：Briefcase, Building2, FolderKanban, Calculator, BookOpen
- 操作：ArrowRight, ChevronRight, Check, X, Mail, Send, Search, Menu
- 状态：CheckCircle2, AlertCircle, AlertTriangle, Loader2
- 其他：Cookie, HardHat, MapPin, Calendar, Globe, ExternalLink, Trash2

---

## 七、按钮设计规范（不需要生成图片，CSS 实现）

| 类型 | 样式 | 用途 |
|---|---|---|
| **Primary** | 渐变蓝→青 `#1677FF→#00D4FF`，白字，圆角 8px，高 44px，hover 投影 | 主 CTA（Discuss Your Project / Calculate） |
| **Secondary** | Navy `#0B1F3A` 底，白字，hover 90% 透明 | 次 CTA |
| **Outline** | 1px 边框 `slate-300`，`slate-700` 字，hover 浅底 | 辅助/取消 |
| **Ghost** | 无边框，透明底，hover 浅灰 | 极少用 |
| **Icon** | 正方形，outline 边框，hover 浅底 | 重置/删除等 |

---

## 八、Hero 背景/装饰元素

| 元素 | 现状 | 需要 |
|---|---|---|
| **蓝图网格** | CSS 实现（50px 间距，6% 蓝色线） | OK，不需生成 |
| **径向光晕** | CSS 实现（蓝+青双色径向渐变） | OK |
| **模糊光球** | CSS 实现（大圆 blur-3xl） | OK |
| **Hero 背景图（可选）** | 无 | 可选：一张工业全景图/效果图，半透明叠在 navy 渐变上。ChatGPT: "Wide panoramic industrial facility at dusk, steel structure factory with blue sky, cinematic, muted tones, suitable as dark website hero background, 1920x1080" |
| **Section 分隔线/装饰** | 无 | 可选：一条细的工程蓝图风格分隔线 SVG。ChatGPT: "Minimalist horizontal divider line with blueprint grid pattern, blue (#1677FF) on transparent, 1200x4, SVG" |

---

## 九、字体规范

| 用途 | 字体 | 备选 |
|---|---|---|
| 英文正文/标题 | **Inter** (Google Fonts, 400/500/600/700/800) | system-ui, Arial |
| 数字/代号/代码 | **JetBrains Mono** (Google Fonts, 400/700) | Courier New, monospace |
| 中文（如有） | PingFang SC / system-ui | — |

---

## 十、OG 图模板（1200×630，社交分享卡）

- 底：navy 渐变 `#0B1F3A → #0F2B52`
- 左上：Logo Mark（小）
- 中间：大标题（白色/渐变）+ 副标题（slate）
- 底部：品牌名 + 域名 `www.industrialengineeringstudio.com`
- 装饰：蓝图网格 + 蓝色径向光晕
- 已有：根 `/opengraph-image` + guides/tools/materials 动态 OG

---

## 十一、案例封面图

- **现状**：从宣传册 PDF 提取（14 个，已上线）
- **风格**：工程效果图/实景照片
- **如需统一风格**：可在每张封面左下角加品牌色叠加条 + "Industrial Engineering Studio" 水印
- **尺寸**：1600px 宽，JPG，16:10 比例

---

## 总结：你需要在 ChatGPT 生成的素材优先级

| 优先 | 素材 | 数量 | 格式 |
|---|---|---|---|
| **P0** | Logo Mark（品牌图标） | 1 | SVG 200×200 |
| **P0** | Favicon（32+180） | 2 | PNG |
| **P1** | 6 个服务图标 | 6 | SVG 48×48 |
| **P1** | 4 个行业图标 | 4 | SVG 48×48 |
| **P2** | 7-8 个计算器类别图标 | 7-8 | SVG 48×48 |
| **P2** | Hero 背景图（可选） | 1 | JPG 1920×1080 |
| **P3** | Wordmark 文字标 | 1 | SVG |
| **P3** | OG 图底图模板 | 1 | PNG 1200×630 |

> 图标统一风格：**outline/线条，2px 描边，圆角线帽，蓝色 `#1677FF` 或渐变 `#1677FF→#00D4FF`，透明底，无填充，无文字，48×48 SVG**。
> Logo 统一风格：**navy `#0B1F3A` 圆角方块底 + 渐变 `#1677FF→#00D4FF` 图形**。
