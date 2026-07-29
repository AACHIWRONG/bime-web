# BIME Step & Snack - 整體架構與使用技巧總結

## 1. 核心技術堆疊 (Tech Stack)
- **前端框架**：純原生的 HTML5, CSS3, JavaScript (Vanilla JS)，不依賴如 React 或 Vue 等重量級框架，以確保最高的效能與客製化自由度。
- **動畫引擎**：
  - **GSAP (GreenSock Animation Platform)**：負責串聯所有基於滾動 (Scroll-based) 的動畫，包含透明度淡入淡出、位移 (y-axis)、以及畫布 (Canvas) 的幀數切換。
  - **ScrollTrigger**：GSAP 的擴充套件，精準捕捉使用者的滾動深度，並將滾動百分比映射到動畫的進度上。
- **物理引擎 / 畫布渲染**：
  - **Canvas API**：利用原生的 `<canvas>` 進行序列圖 (Image Sequence) 的高效能重繪，打造順滑的 3D DNA 旋轉視覺體驗。

## 2. 關鍵架構設計 (Architecture)
整個網頁被拆分為三大核心區塊，透過 `ScrollTrigger` 進行無縫過場：

### Section 1: Core Elements (DNA 序列動畫)
- **架構**：使用固定定位 (`position: fixed`) 的 `<canvas>` 作為底層，外層包覆一個極高 (`400vh`) 的 `.scroll-spacer` 讓使用者有足夠的空間往下滾動。
- **技巧 - 序列圖播放**：預先載入 220 張 DNA 動畫的連續影格。透過 GSAP 監聽滾動進度，並將其映射至 `airship.frame`。在 `onUpdate` 函式中同步繪製。
- **技巧 - 劇院級疊加層 (PPT Overlays)**：在特定的幀數區間觸發 `autoAlpha`。例如「生物」將文字置於左側；而「電子」因 DNA 動畫位於左側，則利用 `.overlay-center-right` 與橫向的 `.overlay-bottom-right` 將文字排版於右側，完美避開 DNA 主體。
- **技巧 - 滾動緩衝 (Scroll Buffer)**：在下一個區段利用 `margin-top: 20vh;` 創造留白，讓 DNA 動畫在播完最後一幀時，能有一段純粹的滾動空間，使區塊過渡更加流暢不突兀。

### Section 2: Six Major Fields (環狀樞紐佈局)
- **架構**：採用 `display: flex` 拆分左右區塊 (左側 `500px` 文字區，右側滿版軌道圖)，打造出「輪軸狀 (Hub-and-Spoke)」介面。
- **技巧 - 多層次同心圓軌道**：右側以四層 `wheel-ring` ( outer, main, inner, core ) 交錯堆疊，搭配虛實線條與不同的透明度，營造出宛如雷達軌道般的豐富層次感。
- **技巧 - SVG 與圓周定位**：導入全站統一定調的深綠色 (`#4a5d34`) SVG 線條圖示。透過 `top` 與 `left` 結合百分比，將 6 個節點精準定位成正六邊形軌道。
- **技巧 - 新擬物化發光特效 (Neumorphism Glow)**：為每個按鈕與中心 BIME 疊加多層 `box-shadow` (亮色高光 + 濃厚深綠色柔光 `rgba(122, 140, 98, 0.45)` + 內陰影)，創造出立體且具漂浮科技感的視覺。懸停放大時改用 `scale` 屬性，確保動畫平順無衝突。

### Section 3: Azalea Festival Works (水平橫向滾動)
- **架構**：利用 `position: sticky` 配合外層容器的高度，在使用者向下滾動時，將內容轉為「橫向滑動」。
- **技巧 - 橫向滾動劫持**：當 `.sticky-container` 吸頂時，GSAP 會將內部內容往左平移 (translateX)，產生水平瀏覽的錯覺，適合展示系列作品卡片。

## 3. 進階使用者體驗技巧 (UX / UI Techniques)

### 16:9 劇院級彈出字卡 (Cinematic Modal)
- 點擊「六大領域」節點時，動態載入專屬的高畫質相片。
- **1/3 留白排版 (Quiet Luxury)**：卡片強制使用 `layout-one-third`，將照片放大至 2/3，文字區塊留白 1/3，加上漸層遮罩 (`mask-image`) 讓文字與背景柔和過渡，提升高級感。

### 浮動狀態列與計數器 (Floating Glass Widget)
- 在畫面右下角採用毛玻璃特效 (`backdrop-filter: blur(15px)`) 製作漂浮面板。
- **實時追蹤**：面板會根據滾動進度精準顯示當前章節。
## 4. 開發與除錯經驗談 (Debugging & Lessons Learned)

### HTML 標籤未閉合引發的「網頁空白」慘案
- **現象**：在進行 HTML 語意化重構時，將原本的 `<div id="loader">` 修改為 `<aside class="bime-loader" id="loader">`，卻遺漏了將結尾的 `</div>` 同步改為 `</aside>`。
- **後果**：瀏覽器具有自動容錯機制，遇到未正確閉合的 `<aside>` 以及無效的 `</div>` 時，會自動把後面所有的 DOM 節點（包括 `<main>`、`<header>` 等整個網頁內容）全部塞進這個 `<aside>` 裡面。
- **觸發點**：當 JavaScript 載入完成，執行 `loaderEl.style.display = "none";` 來隱藏載入畫面時，因為整個網頁都被誤判為載入畫面的子元素，導致**整個網頁瞬間消失，變成完全空白**。
- **解法與反思**：在更改 HTML 標籤結構時，務必確保起始標籤與結束標籤的成對性。若是大範圍重構，建議使用編輯器的 tag 自動同步修改功能（Auto Rename Tag）來避免這類低級卻致命的錯誤。

### CORS 錯誤的「紅鯡魚」(Red Herring) 效應
- **現象**：當上述網頁空白的情況發生時，開發者打開 Console 會看到一行醒目的紅字：`A cross-origin resource sharing (CORS) request was blocked...`。
- **真相**：這個 CORS 錯誤其實來自於 `counterapi.dev` 的 `fetch` 請求（因為本地 `file:///` 協定的 Origin 為 null 而被阻擋）。但這段 `fetch` 程式碼被包覆在 `try...catch` 並且帶有 `.catch()` 處理，**並不會中斷 JavaScript 的執行**。
- **反思**：在除錯時，Console 裡最顯眼的紅色錯誤不一定就是導致當前 Bug 的主因。需要釐清錯誤拋出的位置是否會阻斷主執行緒（例如 Promise Rejection 不會阻斷同步腳本，但 SyntaxError 或 ReferenceError 會）。

### 5. 最新除錯與優化經驗 (July 2026)

#### 透明 Canvas 的「黑底」Bug (Alpha Context 陷阱)
- **現象**：當上傳去背的透明 DNA 動畫圖片時，網頁背景會呈現一大片死黑，甚至蓋住 subtitles 與其他文字。
- **原因**：
  - 為了實現背景模糊，我們用了兩個 Canvas，其中 `bg-canvas` 負責渲染模糊的 Cover 背景。
  - 先前為了效能將 `bgCtx` 設定為不透明的 `{ alpha: false }`。當使用去背的透明圖片，或者圖片因為路徑錯誤未成功載入時，Canvas 的預設填充底色即是不透明的**純黑色**。
  - 當我們盲目嘗試將其改為 `alpha: true`（透明）時，卻又會因為邊緣的 `filter: blur(40px)` 模糊濾鏡產生透明度溢出，把網頁最底層的顏色渲染出髒黑的邊緣。
- **解法**：
  - 將 `bgCtx` 保持為不透明的 `alpha: false`，但必須在 JS 每次重設畫布尺寸 (Resize) 時，立刻使用 `bgCtx.fillStyle = "#fcfcfc"; bgCtx.fillRect(...)` 將底色塗滿羊皮紙白。這能保證不論圖片去背與否，背景都絕對是乾淨的白色。

#### BEM 命名不對稱引發的「節點跑版」
- **現象**：網頁在重構為 BEM 規範後，智慧農業 (Top) 與 AI 生物資訊 (Bottom) 這兩個節點飛到了左上角重疊，沒有正確排列在環狀軌道上。
- **原因**：HTML 已經重構為 `.bime-fields__node--top` 與 `.bime-fields__node--bottom`，但 `style.css` 仍保留舊的定位 class 名稱 `.node-top` 與 `.node-bottom`（缺少了 `bime-fields__` 前綴），導致定位屬性完全失效。
- **解法**：手動檢查並對齊 CSS 命名。注意避免使用粗暴的 Python 腳本對大型 CSS 進行盲目的字串取代，因為這極易截斷鄰近 CSS 選擇器的花括號 `{}`，造成嚴重的語法失效。

