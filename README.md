# BIME — BioMechatronics Engineering Interactive Web

> **臺灣大學生物機電工程學系 × Scrollytelling 科技展示網頁**
> An immersive scroll-driven showcase for NTU's Department of BioMechatronics Engineering

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=flat-square&logo=vercel)](https://bime-web.vercel.app)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=black)](https://greensock.com/gsap/)

---

## 📖 目錄 / Table of Contents

- [專案簡介 / Overview](#-專案簡介--overview)
- [技術堆疊 / Tech Stack](#-技術堆疊--tech-stack)
- [網頁架構 / Architecture](#-網頁架構--architecture)
- [視覺設計規範 / Design System](#-視覺設計規範--design-system)
- [啟動方式 / Getting Started](#-啟動方式--getting-started)
- [目錄結構 / Directory Structure](#-目錄結構--directory-structure)

---

## 🌱 專案簡介 / Overview

### 中文

**BIME Step & Snack** 是一個為臺灣大學生物機電工程學系設計的沉浸式互動展示網頁。  
整個網頁以「Scrollytelling（滾動敘事）」為核心，利用 220 張連續圖幀打造 3D DNA 旋轉動畫，引導使用者逐步認識 BIME 的六大研究領域，以及系上的豐富作品成果。

**設計理念：Engineering Life. Designing the Future.**  
結合生物科學與機電工程，從生命系統出發，創造更智慧、更永續的未來。

### English

**BIME Step & Snack** is an immersive interactive showcase for NTU's Department of BioMechatronics Engineering.  
Built around a scrollytelling concept, it uses 220 sequential frames to animate a 3D rotating DNA model, guiding visitors through BIME's six research domains and student project highlights.

**Design Philosophy: Engineering Life. Designing the Future.**  
At the intersection of biological sciences and mechatronics, we engineer the possibilities of life.

---

## 🛠 技術堆疊 / Tech Stack

| 技術 / Technology | 用途 / Purpose |
|:---|:---|
| **HTML5 / CSS3 / Vanilla JS** | 核心框架，零依賴，最大效能 / Zero-dependency core |
| **GSAP 3 + ScrollTrigger** | 滾動驅動動畫、翻頁換頁過場 / Scroll-driven animations & page-flip transitions |
| **Canvas API** | 220 幀序列圖高效能渲染 / 220-frame image sequence rendering |
| **Google Fonts (Outfit)** | 現代英文字型 / Modern typography |
| **counterapi.dev** | 即時訪客計數器 / Real-time visitor counter |

---

## 🏗 網頁架構 / Architecture

網頁分為三大核心區塊，透過 ScrollTrigger 無縫銜接：

The page is divided into three core sections, connected seamlessly via ScrollTrigger:

### Section 1 — DNA 序列動畫 / DNA Scroll Animation (`#core-elements`)

- 220 張圖幀以 Canvas API 即時渲染，映射至滾動進度
- 三個劇院級文字疊加層（生物 / 機械 / 電子）在特定幀數淡入淡出
- 手機版 DNA 向右偏移，讓左側疊加文字與動畫並排不衝突
- 220 frames rendered via Canvas API, mapped to scroll progress
- Three cinematic text overlays (Biology / Mechanics / Electronics) fade at specific frames
- On mobile, DNA shifts right to avoid overlapping with text overlays

### Section 2 — 六大研究領域輪盤 / Six Research Fields Hub (`#six-fields`)

- 翻頁式過場（Page-Flip）：DNA 播完後，六大領域從底部整頁翻上
- 環狀輪軸佈局（Hub-and-Spoke）：四層同心圓軌道＋六個懸浮按鈕節點
- 點擊節點彈出劇院級 Modal：含圓形照片、奢華字卡（1/3 留白排版）
- Page-flip transition: six-fields slides up from bottom after DNA completes
- Hub-and-spoke layout: four concentric orbit rings + six hexagonal node buttons
- Clicking a node opens a cinematic modal with circular photo & Quiet Luxury card layout

### Section 3 — 杜鵑花節作品展 / Azalea Festival Works (`#azalea-works`)

- Sticky 水平橫向滾動（Horizontal Scroll Hijack）
- 展示 BIME 系上年度代表作品卡片
- Sticky-based horizontal scroll hijack to showcase annual student projects

---

## 🎨 視覺設計規範 / Design System

### 顏色 / Colors

| 用途 / Usage | 色值 / Value |
|:---|:---|
| 背景主色 Background | `#fcfcfc` / `#f0f0f0` (羊皮紙白 Parchment White) |
| 品牌主色 Brand Primary | `#4a5d34` (松針深綠 Pine Green) |
| 輔助綠 Secondary Green | `#7a8c62` |
| 深色點綴 Dark Accent | `#111` / `#222` |

### 字型 / Typography

- **英文 Latin**: `Outfit` (Google Fonts) — 400, 700
- **中文 CJK**: `Noto Serif TC` / System Default

### 動畫風格 / Animation Style

- 緩慢而具分量的動畫，`ease: power3.inOut`，時長 0.8s–1.2s
- Slow and deliberate animations — `ease: power3.inOut`, duration 0.8s–1.2s
- 外圈流光：`stroke-dasharray: 250 58`，週期 24s（大面積實線滑行）
- Outer ring trace: `stroke-dasharray: 250 58`, period 24s

---

## 🚀 啟動方式 / Getting Started

此專案為純靜態網頁，無需安裝任何依賴。  
This is a pure static project — no installation needed.

### 本地預覽 / Local Preview

```bash
# 方法一：使用 VS Code Live Server 擴充套件
# Method 1: Use the VS Code Live Server extension

# 方法二：使用 Python 本地伺服器
# Method 2: Python local server
python -m http.server 8080
# 開啟 / Open: http://localhost:8080
```

> ⚠️ **注意**：請勿直接以 `file:///` 協定開啟，部分 fetch API（訪客計數器）會因 CORS 限制無法運作。  
> **Note**: Do not open via `file:///` directly — fetch API calls (visitor counter) will be blocked by CORS.

### 部署 / Deployment

推薦部署至 **Vercel** 或 **GitHub Pages**（靜態網頁，零配置）。  
Recommended: deploy to **Vercel** or **GitHub Pages** (static site, zero config).

---

## 📁 目錄結構 / Directory Structure

```
bime-web/
├── index.html                        # 頁面結構與 Modal 容器
├── style.css                         # 設計系統與 RWD 響應式樣式
├── script.js                         # GSAP 滾動映射、序列圖預載、翻頁邏輯
├── images/
│   ├── smart_agriculture_agri.png    # 智慧農業 — Quiet Luxury 白綠植物風格圖
│   ├── biosensing.png                # 生物感測
│   ├── robotics.png                  # 精密製造機器人
│   ├── advanced_manufacturing.png    # 先進製造
│   ├── ai_bioinformatics.png         # AI 生物資訊
│   └── bioenergy.png                 # 生質能源
├── ezgif-565c1a79dcc771c1-png-split/ # DNA 220 幀圖庫（frame-001 ~ frame-220）
├── au.jpg                            # 作者資訊卡背景（桌機版）
├── bimecontext.md                    # 開發脈絡與技術筆記
└── SKILL.md                          # 架構對照索引與設計規範
```

---

## 🔬 六大研究領域 / Six Research Domains

| # | 中文 | English | 節點位置 |
|:---:|:---|:---|:---|
| 01 | 智慧農業 | Smart Agriculture | Top |
| 02 | 生物感測 | Biosensing | Top-Right |
| 03 | 精密機器人 | Precision Robotics | Bottom-Right |
| 04 | AI 生物資訊 | AI & Bioinformatics | Bottom |
| 05 | 先進製造 | Advanced Manufacturing | Bottom-Left |
| 06 | 生質能源與環境 | Bioenergy & Environment | Top-Left |

---

## 👨‍💻 作者 / Author

**Aaron** — NTU BIME  
設計、前端開發與視覺規劃 / Design, Frontend Development & Visual Direction

---

*Engineering Life. Designing the Future.* 🌱
