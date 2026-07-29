---
name: website_architecture
description: Provides details about the architecture, tech stack, and directory structure of the website.
---

# BIME Website Architecture & Mapping Reference

本文件定義此專案的技術架構與對應索引，以供開發與維護時能快速將口語描述對應至正確的 CSS 類別與 DOM 元素。

---

## 1. 口語術語與 CSS/JS 實體對照索引 (Selector Mapping Index)

當談到以下自然語言時，對應的實際代碼結構如下：

| 口語描述 (自然語言) | 實際對應的 CSS Class / ID | 位置與用途描述 |
|:---|:---|:---|
| **首頁 DNA 區塊** | `.bime-dna` / `#core-elements` | 首頁大背景與滾動時 DNA 3D 旋轉的部分。 |
| **首頁 DNA 畫布** | `#animation-canvas` & `#bg-canvas` | JS 實際在渲染播放圖片序列的 Canvas 元素。 |
| **首頁文字 (PPT字幕)** | `.bime-overlay` | 隨滾動進度在特定幀數淡入淡出的左右側大標題/描述文字。 |
| **英文大副標** | `.bime-overlay__title-en` | 每一段 PPT 疊加文字內的英文大寫字（如 `BIOLOGY`）。 |
| **三級次領域 (小圓圈)** | `.bime-overlay__sub-field` | 首頁疊加文字內，由小圓圈 SVG 圖示搭配下方標題和說明的區域。 |
| **六大研究領域 (輪盤)** | `.bime-fields` / `#six-fields` | 網頁第二大區塊，呈現同心圓雷達與 6 個懸浮按鈕的輪盤。 |
| **輪盤節點 (圓圈按鈕)** | `.bime-fields__node` | 六角分佈的按鈕，如 `bime-fields__node--top`（智慧農業）。 |
| **輪盤幾何環形線** | `.bime-fields__ring` | 輪盤底層旋轉的軌道線條，分 `--main`, `--inner`, `--core`。 |
| **杜鵑花節作品展** | `.bime-works` / `#azalea-works` | 第三區塊，包含水平橫滾動 (Horizontal scroll wrapper) 與作品卡片。 |
| **作品卡片** | `.work-card` | 水平橫向滾動中展示各小組作品的卡片元素。 |
| **彈出卡片 (模態框)** | `#field-modal` / `.glass-card` | 點擊六大領域節點後，彈出的 16:9 劇院級半透明磨砂玻璃卡片。 |

---

## 2. Tech Stack

- **Framework**: 純原生 HTML5, CSS3, JavaScript (Vanilla JS)
- **Animation**: 
  - GSAP (GreenSock Animation Platform)
  - ScrollTrigger (GSAP plugin for scroll-based animation)
- **Media**: Canvas API (220 frames sequence rendering)

---

## 3. Directory Structure

- `index.html`: 結構定義與 modal 容器配置。
- `style.css`: 核心設計系統與 RWD 手機版 `@media` 樣式。
- `script.js`: GSAP 滾動映射、預載入序列圖及 Modal 彈出邏輯。
- `ezgif-565c1a79dcc771c1-png-split/`: DNA 220 影格圖庫。

---

## 4. 設計規範與 Visual Style

### 顏色系統
- **背景主色**：`#fcfcfc` / `#f0f0f0` (羊皮紙白，Quiet Luxury 質感)
- **文字與主色**：`#4a5d34` / `#5d7342` (松針深綠色)
- **暗部點綴**：`#111` / `#222` (僅用於作品展示或部分暗色按鈕)

### 排版與字型
- **英文字型**：`Outfit`, `sans-serif`
- **中文字型**：`Noto Serif TC` / 系統預設儷黑

---

## 5. RWD 手機版特別處理規則

當畫面寬度小於或等於 `768px` 時，樣式會進行重構以適應直立式螢幕：
1. **三級次領域 (sub-field) 水平並排**：
   - 容器 `.bime-overlay__content-bottom-right` 改為 `flex-direction: row`，且不得使用負 margin 縮放，應以 `flex: 1` 均分空間，使三個圓圈字卡排成一直線。
2. **輪盤大小自適應**：
   - 輪盤 `.bime-fields__wheel` 轉為寬高皆為 `100vw` 滿版，節點與文字微縮，避免跑版。

---

## 6. Animation & Scrollytelling
- **Frameworks**: Utilize **Framer Motion** for micro-interactions (hover states, enter animations) and **GSAP (with ScrollTrigger)** for complex scroll-driven layout changes.
- **Smooth Scrolling**: The project uses **Lenis** globally. Rely on native scrolling enhanced by Lenis, avoid hijacking the scroll entirely unless inside a specific interactive canvas.
- **Cinematic Feel**: Animations should be slow and deliberate. Use ease curves like `cubic-bezier(0.19, 1, 0.22, 1)` (duration usually 0.8s - 1.2s). Avoid snappy, bouncy physics.

### 7. Component Assembly
Build complex UIs by assembling smaller components in `src/components/`. If you create a new feature, make sure it adheres completely to these CSS variables, typography utility classes, and layout rules.
