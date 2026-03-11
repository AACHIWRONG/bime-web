# BIME 杜鵑花節 - Step & Snack 互動展示網頁

這是一個為 **台大生機系杜鵑花節** 專門設計的互動式展示網頁。透過結合捲動動畫與物理引擎沙盒，帶領遊客深入淺出地了解「地鼠自動餵食器」的設計理念與運作原理。

## 🌟 核心特色

### 1. 互動式捲動動畫 (Scroll Animation)
- 採用 GSAP 與 ScrollTrigger 技術，將 47 楨的高畫質照片轉化為流暢的產品運作動畫。
- 動畫隨使用者捲動同步進度，直觀展示產品細節。

### 2. 物理碰撞沙盒 (Physics Sandbox)
- 使用 Matter.js 強大的物理引擎，在網頁背景中模擬真實的牛奶糖堆疊效果。
- **互動機制**：使用者的鼠標或手指觸摸會產生「排斥力」，讓牛奶糖四處滾動。
- **點擊生成**：點擊畫面的任何地方，都會從上方掉落新的牛奶糖。

### 3. 驚喜稀有掉落 (Rare Drop)
- 特別設計了 **1:9** 的稀有驚喜：除了標準的棕色牛奶糖外，有機會掉落經典的「黃色森永牛奶糖盒」。
- 所有貼圖均經過自定義去背處理，邊緣銳利清晰。

### 4. 專業單欄式介面 
- 側邊欄整合了：
  - **設計理念**：產品背景與願景。
  - **運作機制**：Arduino 程式控制與物理壓力系統說明。
  - **相關影片**：動態展示影片。
  - **相關軟體**：快速連結至開發工具 (Arduino IDE, Onshape, Antigravity)。

## 🛠️ 開發技術
- **Frontend**: HTML5, Vanilla CSS, JavaScript
- **Animation**: [GSAP](https://greensock.com/gsap/) + ScrollTrigger
- **Physics Engine**: [Matter.js](https://brm.io/matter-js/)
- **Design**: Responsive Web Design (支援手機/平板/電腦)

## 🚀 如何啟動
只需將此 Repository 下載或 Clone 至本地，並在瀏覽器中開啟 `index.html` 即可體驗。

---
*台大生機系 杜鵑花節 第3小組 誠摯出品*
