# Calculator 3D/2D Visualization Upgrade Plan

## 1. 目标

将 54 个工程计算器从"纯数字输出"升级为"实时可视化交互体验"——用户输入参数时，
物理模型（型钢截面 / 管道流动 / 梁变形 / 泵叶轮 …）实时响应，提升专业感、停留时长与 SEO 价值。

参考项目 `engineering-simulation-lab` 的 Three.js+R3F 方案功能完整但风格偏暗色科技、不够高端写实。
本项目采用 **品牌色体系（Navy / Engineering Blue / AI Glow / Green）+ 混合渲染策略**，
达到工业制图级别的高级感。

---

## 2. 技术方案：混合渲染策略

| 可视化类型 | 技术 | 适用计算器 | Bundle 影响 |
|-----------|------|-----------|-------------|
| **SVG 矢量截面图** | 纯 SVG + CSS 动画 | 型钢/管材/板材重量、体积计算 | 0 KB（已有） |
| **2D Canvas 粒子模拟** | HTML5 Canvas + requestAnimationFrame | 管道流动、流速、雷诺数 | 0 KB |
| **3D 交互模型** | Three.js + R3F + Drei（懒加载） | 梁变形、柱屈曲、储罐 | ~150 KB（gzip）按需加载 |

**核心原则：**
- SVG / Canvas = 零依赖，SSR 安全，首屏直出
- Three.js = `next/dynamic` 懒加载，仅 3D 类计算器加载，不影响普通页面性能
- 所有可视化组件接收 `values: Record<string, number>` 实时响应输入变化
- 可视化区域默认折叠，点击 "Show Visualization" 展开（减少首屏 LCP 负担）

---

## 3. JSON Schema 扩展

在 `Calculator` 接口新增可选字段：

```typescript
interface CalculatorVisualization {
  type: "svg-section" | "canvas-flow" | "three-beam" | "three-tank";
  component: string;  // 组件文件名，如 "SteelSectionDiagram"
  props?: Record<string, string>;  // 映射 input id -> 可视化参数
}

interface Calculator {
  // ...existing fields
  visualization?: CalculatorVisualization;
}
```

`CalculatorCard.tsx` 检测 `calc.visualization`，若存在则渲染对应懒加载组件。

---

## 4. 优先级排序（基于 GSC 数据 + 业务价值）

### Tier 1 — 高流量入口（GSC 已有展示）
| 计算器 | GSC 展示次数 | 可视化类型 | 状态 |
|--------|------------|-----------|------|
| steel-weight-calculator | 5 | SVG 型钢截面 | Sprint 1 |
| pipe-flow-calculator | 4 | Canvas 粒子流动 | Sprint 1 |
| aluminum-weight-calculator | 5 | SVG 共享截面 | Sprint 2 |
| flow-rate-calculator | 4 | Canvas 粒子流动（复用） | Sprint 2 |
| pipe-velocity-calculator | — | Canvas 粒子流动 | Sprint 2 |
| pump-efficiency-calculator | 3 | SVG 泵性能曲线+叶轮 | Sprint 2 |

### Tier 2 — 结构/热力（差异化竞争力）
| 计算器 | 可视化类型 | 状态 |
|--------|-----------|------|
| beam-deflection-calculator | Three.js 3D 梁变形 | Sprint 3 |
| reynolds-number-calculator | Canvas 流态（层流/湍流） | Sprint 3 |
| heat-exchanger-calculator | SVG 温度场+LMTD | Sprint 3 |
| tank-volume-calculator | Three.js 3D 储罐液位 | Sprint 3 |
| orifice-flow-calculator | Canvas 孔板流 | Sprint 3 |

### Tier 3 — 批量覆盖（复用组件）
所有 *-weight-calculator 复用截面图组件；
所有 pipe-*-calculator 复用管道流组件；
所有 pump-*-calculator 复用泵性能曲线组件。

---

## 5. 设计风格规范

- **背景：** 浅灰 `#F8FAFC`（与页面一致），非暗色
- **线框：** Navy `#0B1F3A` 粗线
- **高亮色：** Engineering Blue `#1677FF`（流体/受力）
- **辅助色：** AI Glow `#00D4FF`（速度场/温度）、Green `#00B578`（结果/安全）
- **标注：** Slate `#64748B` 细字，工程制图风格标注尺寸线
- **材质：** 3D 模型用 `meshPhysicalMaterial`，metalness 0.6-0.8，roughness 0.3-0.5
- **动画：** 流体粒子 30-60fps，梁变形 2s 缓动，泵叶轮匀速旋转
- **交互：** 3D 场景 OrbitControls 可旋转缩放，2D 图随输入实时更新

---

## 6. Sprint 分解

### Sprint 1（MVP — 2个旗舰可视化）
- [ ] 扩展 Calculator types + engine loader 支持 visualization 字段
- [ ] 创建 `src/components/calculator/visualizations/` 目录
- [ ] `SteelSectionDiagram.tsx` — SVG 型钢截面（H/I/Box/Pipe/Angle）
- [ ] `PipeFlowCanvas.tsx` — Canvas 粒子流动（速度着色）
- [ ] `VisualizationRenderer.tsx` — 分发组件，按 calc.visualization.type 加载
- [ ] 在 steel-weight + pipe-flow 的 JSON 中添加 visualization 配置
- [ ] CalculatorCard 集成可视化区域（结果下方）

### Sprint 2（批量复用 + 结构3D）
- [ ] `Beam3DVisualization.tsx` — Three.js 懒加载 3D 梁变形
- [ ] `PumpPerformanceCurve.tsx` — SVG 泵性能曲线 + 叶轮旋转
- [ ] 复用截面图到 aluminum/copper/metal/stainless/round-bar/plate/pipe-weight
- [ ] 复用管道流到 flow-rate/pipe-velocity/water-velocity/pipe-diameter

### Sprint 3（热力+储罐+孔板）
- [ ] `ReynoldsFlowCanvas.tsx` — 层流/湍流对比可视化
- [ ] `HeatExchangerDiagram.tsx` — SVG 温度场 + LMTD 标注
- [ ] `Tank3DVisualization.tsx` — Three.js 储罐液位
- [ ] `OrificeFlowCanvas.tsx` — Canvas 孔板节流

### Sprint 4（全覆盖 + 优化）
- [ ] 所有 54 个计算器至少 1 个可视化
- [ ] 可视化组件代码分割优化
- [ ] 移动端响应式适配
- [ ] 分享图片中嵌入可视化截图

---

## 7. 与参考项目的关键差异

| 维度 | 参考项目 | 本项目 |
|------|---------|-------|
| 风格 | 暗色 #0a0a1a 科技感 | 浅色制图级 + Navy 品牌色 |
| 架构 | 每个计算器独立 page.tsx | JSON 驱动 + 统一 CalculatorCard |
| 3D 材质 | meshPhysicalMaterial 通用 | metalness 0.6-0.8 金属感工程件 |
| 粒子 | AdditiveBlending 蓝光 | 工程蓝 + 速度梯度色（蓝→黄→红） |
| 标注 | 无 | 工程制图尺寸线 + 箭头标注 |
| 加载 | 全量 Three.js | 懒加载按需，SVG/Canvas 零依赖 |
| SSR | 'use client' 全包 | SVG 直出，Canvas/3D 客户端渲染 |
