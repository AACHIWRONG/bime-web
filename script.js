/* global gsap, ScrollTrigger */

(() => {
  gsap.registerPlugin(ScrollTrigger);

  const FRAME_COUNT = 220;
  const canvas = document.getElementById("animation-canvas");
  const ctx = canvas.getContext("2d");
  const loaderEl = document.getElementById("loader");
  const loaderPctEl = document.getElementById("loaderPct");
  const loaderHex = document.getElementById("loaderHex");
  const loaderLine = document.getElementById("loaderLine");
  const loaderDot = document.getElementById("loaderDot");
  const pageEl = document.getElementById("page");

  const frames = [];
  const airship = { frame: 0, offsetX: 0 };

  // 1. Preload Images
  async function preloadImages() {
    let firstFrameLoaded = false;
    let loadedCount = 0;

    return new Promise((resolve) => {
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const n = String(i).padStart(3, "0");
        const path = `./ezgif-565c1a79dcc771c1-png-split/ezgif-frame-${n}.png`;

        const img = new Image();
        img.src = path;
        img.onload = () => {
          frames[i - 1] = img;
          loadedCount++;

          const progress = Math.round((loadedCount / FRAME_COUNT) * 100);
          if (loaderPctEl) loaderPctEl.textContent = progress;

          if (loaderHex) loaderHex.style.strokeDashoffset = 270 - (270 * progress / 100);
          if (loaderLine) loaderLine.style.strokeDashoffset = 100 - (100 * progress / 100);
          if (progress > 80 && loaderDot) loaderDot.style.opacity = 1;

          // 如果是第一幀載入完成，就先允許網站啟動
          if (i === 1 && !firstFrameLoaded) {
            firstFrameLoaded = true;
            resolve();
          }
          // 如果第一幀沒抓到，但已經載入超過 10% 的幀，也強制啟動
          if (!firstFrameLoaded && progress > 10) {
            firstFrameLoaded = true;
            resolve();
          }
        };
        img.onerror = () => {
          console.warn(`Failed to load: ${path}`);
          loadedCount++; // 避免卡進度條
          if (i === 1 && !firstFrameLoaded) {
            firstFrameLoaded = true;
            resolve();
          }
        };
      }

      // Fallback: 如果網路太慢，最多等 2 秒就強制啟動
      setTimeout(() => {
        if (!firstFrameLoaded) {
          firstFrameLoaded = true;
          resolve();
        }
      }, 2000);
    });
  }

  const bgCanvas = document.getElementById("bg-canvas");
  const bgCtx = bgCanvas ? bgCanvas.getContext("2d", { alpha: false }) : null;

  // 2. Canvas Rendering (object-fit: contain for main, cover for bg)
  function render() {
    const img = frames[airship.frame];
    if (!img) return;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    // Main Canvas Setup
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Background Canvas Setup
    if (bgCanvas && bgCtx) {
      bgCanvas.width = canvasWidth;
      bgCanvas.height = canvasHeight;
      // Fill white so alpha:false canvas never shows black before first draw
      bgCtx.fillStyle = "#fcfcfc";
      bgCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    const imgWidth = img.width;
    const imgHeight = img.height;
    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = imgWidth / imgHeight;

    // --- Draw Main Foreground (Contain on Desktop, Cover on Mobile) ---
    let fgWidth, fgHeight, fgOffsetX, fgOffsetY;
    let isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Mobile: Cover behavior (Zoom in DNA)
      if (imgRatio > canvasRatio) {
        // Fit height, bleed width
        fgHeight = canvasHeight;
        fgWidth = canvasHeight * imgRatio;
        fgOffsetX = (canvasWidth - fgWidth) / 2;
        fgOffsetY = 0;
      } else {
        // Fit width, bleed height
        fgWidth = canvasWidth;
        fgHeight = canvasWidth / imgRatio;
        fgOffsetX = 0;
        fgOffsetY = (canvasHeight - fgHeight) / 2;
      }
    } else {
      // Desktop: Contain behavior
      if (imgRatio > canvasRatio) {
        // Fit width, letterbox height
        fgWidth = canvasWidth;
        fgHeight = canvasWidth / imgRatio;
        fgOffsetX = 0;
        fgOffsetY = (canvasHeight - fgHeight) / 2;
      } else {
        // Fit height, pillarbox width
        fgHeight = canvasHeight;
        fgWidth = canvasHeight * imgRatio;
        fgOffsetX = (canvasWidth - fgWidth) / 2;
        fgOffsetY = 0;
      }
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 用羊皮紙白色填滿 Canvas 背景，確保 DNA 向右畫時，左側有完美的底色不會露白邊
    ctx.fillStyle = "#fcfcfc";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 將計算好的繪圖起點 X 座標加上 airship.offsetX 平移量
    ctx.drawImage(img, fgOffsetX + airship.offsetX, fgOffsetY, fgWidth, fgHeight);

    // --- Draw Ambient Background (Cover) ---
    if (bgCtx) {
      let bgWidth, bgHeight, bgOffsetX, bgOffsetY;
      if (imgRatio > canvasRatio) {
        // Fit height, bleed width
        bgHeight = canvasHeight;
        bgWidth = canvasHeight * imgRatio;
        bgOffsetX = (canvasWidth - bgWidth) / 2;
        bgOffsetY = 0;
      } else {
        // Fit width, bleed height
        bgWidth = canvasWidth;
        bgHeight = canvasWidth / imgRatio;
        bgOffsetX = 0;
        bgOffsetY = (canvasHeight - bgHeight) / 2;
      }

      // ctx is initialized with alpha false or we clearrect, but bgCanvas is fully covered
      bgCtx.drawImage(img, bgOffsetX, bgOffsetY, bgWidth, bgHeight);
    }
  }

  // Physics removed

  // 4. GSAP Initialization
  function initGSAP() {
    // Core Elements (DNA) Sequence Timeline
    const dnaTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#core-elements",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      }
    });

    let bioVisible = false;
    let text2Visible = false;
    let text3Visible = false;
    let text4Visible = false;

    const currentSectionText = document.getElementById("current-section-text");

    const checkOverlay = () => {
      render();
      const frame = Math.round(airship.frame);

      if (currentSectionText) {
        currentSectionText.textContent = `第 ${frame} / ${FRAME_COUNT} 幀`;
      }

      // PPT Overlay pops out at frame 16
      if (frame >= 16 && frame <= 29) {
        if (!bioVisible) {
          gsap.to(".bime-overlay--bio", { autoAlpha: 1, y: 0, duration: 0.5 });
          bioVisible = true;
        }
      } else {
        if (bioVisible) {
          gsap.to(".bime-overlay--bio", { autoAlpha: 0, y: 20, duration: 0.5 });
          bioVisible = false;
        }
      }

      // 2. Overlay Mechanics (frames 120 - 135)
      if (frame >= 120 && frame <= 135) {
        if (!text2Visible) {
          gsap.to(".bime-overlay--mechanics", { autoAlpha: 1, y: 0, duration: 0.5 });
          document.getElementById("overlay-mechanics").classList.add("bime-overlay--visible");
          text2Visible = true;
        }
      } else {
        if (text2Visible) {
          gsap.to(".bime-overlay--mechanics", { autoAlpha: 0, y: 20, duration: 0.5 });
          document.getElementById("overlay-mechanics").classList.remove("bime-overlay--visible");
          text2Visible = false;
        }
      }


      // DNA Text 3 (Frame 195 to 215 - fades out before end)
      if (frame >= 200 && frame <= 219) {
        if (!text3Visible) {
          gsap.to(".bime-overlay--electricity", { autoAlpha: 1, y: 0, duration: 0.5 });
          document.getElementById("overlay-electricity").classList.add("bime-overlay--visible");
          text3Visible = true;
        }
      } else {
        if (text3Visible) {
          gsap.to(".bime-overlay--electricity", { autoAlpha: 0, y: 20, duration: 0.5 });
          document.getElementById("overlay-electricity").classList.remove("bime-overlay--visible");
          text3Visible = false;
        }
      }
    };

    // 0. Fade out the landing static bg and text BEFORE animation starts
    dnaTl.to([".bime-overlay--landing", ".bime-dna__landing-bg"], {
      autoAlpha: 0,
      ease: "none",
      duration: 0.3
    }, 0);

    // 1. Animate to frame 22 (fast)
    dnaTl.to(airship, {
      frame: 22,
      snap: "frame",
      ease: "none",
      onUpdate: checkOverlay,
      duration: 1
    });
    // 2. Pause / lower vh sensitivity at frame 22 (act as a node)
    dnaTl.to(airship, {
      frame: 22,
      ease: "none",
      onUpdate: checkOverlay,
      duration: 1.5
    });
    // 3. Continue to frame 128 (從這一步開始，一邊往第 128 影格跑，主 DNA 畫布一邊右移，背景 #bg-canvas 不動)
    // 僅限手機版右移 30% 螢幕寬度，桌機版保持原地對齊（0px）
    dnaTl.to(airship, {
      offsetX: () => window.innerWidth <= 768 ? window.innerWidth * 0.18 : 0,
      ease: "power1.inOut",
      duration: 1.0
    }, "move-to-128");

    dnaTl.to(airship, {
      frame: 128,
      snap: "frame",
      ease: "none",
      onUpdate: checkOverlay,
      duration: 1.0
    }, "move-to-128");
    // 4. Pause at frame 128
    dnaTl.to(airship, {
      frame: 128,
      ease: "none",
      onUpdate: checkOverlay,
      duration: 1.5
    });
    // 5. Continue to frame 200
    dnaTl.to(airship, {
      frame: 215,
      snap: "frame",
      ease: "none",
      onUpdate: checkOverlay,
      duration: 1.0
    });
    // 6. Pause at frame 200 to give Electronics text time to be read
    dnaTl.to(airship, {
      frame: 200,
      ease: "none",
      onUpdate: checkOverlay,
      duration: 1.5
    });
    // 7. Continue to the end
    dnaTl.to(airship, {
      frame: FRAME_COUNT - 1,
      snap: "frame",
      ease: "none",
      onUpdate: checkOverlay,
      duration: 0.5
    });
    // 8. Pause at the end to give fade out some scroll space
    dnaTl.to(airship, {
      frame: FRAME_COUNT - 1,
      ease: "none",
      onUpdate: checkOverlay,
      duration: 1.5
    });

    // Initial setup for Overlays
    gsap.set(".bime-overlay--bio", { autoAlpha: 0, y: 20 });
    gsap.set([".bime-overlay--mechanics", ".bime-overlay--electricity"], { autoAlpha: 0, y: 20 });

    // Azalea Works Horizontal Scroll
    const horizontalWrapper = document.querySelector(".horizontal-scroll-wrapper");
    if (horizontalWrapper) {
      const getScrollAmount = () => -(horizontalWrapper.scrollWidth - window.innerWidth);

      const worksTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".bime-works",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true
        }
      });

      worksTl.to(horizontalWrapper, {
        x: getScrollAmount,
        ease: "none"
      }, 0);

      const dataLine = document.getElementById("worksDataLine");
      if (dataLine) {
        worksTl.to(dataLine, {
          width: "100%",
          ease: "none"
        }, 0);
      }
    }

    // Vertical Nav Active State & Floating Widget State
    const sections = ["#core-elements", "#six-fields", ".bime-works"];
    const sectionNames = ["生物", "六大領域", "杜鵑花節作品展"];
    const navItems = document.querySelectorAll(".bime-sidebar__item");

    sections.forEach((sec, i) => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top center",
        end: "bottom center",
        onToggle: self => {
          if (self.isActive) {
            navItems.forEach(item => item.classList.remove("bime-sidebar__item--active"));
            if (navItems[i]) navItems[i].classList.add("bime-sidebar__item--active");
            // Only overwrite the text for sections other than the first (DNA animation)
            if (currentSectionText && i > 0) {
              currentSectionText.textContent = sectionNames[i];
            }
          }
        }
      });
    });

    // --- Six Fields Modal Logic ---
    const fieldCards = document.querySelectorAll(".bime-fields__node");
    const fieldModal = document.getElementById("field-modal");
    const modalCloseBtn = fieldModal ? fieldModal.querySelector(".modal-close-btn") : null;
    const modalBackdrop = fieldModal ? fieldModal.querySelector(".modal-backdrop") : null;
    const modalTitle = document.getElementById("modal-title");
    const modalSubtitle = document.getElementById("modal-subtitle");
    const modalIcon = document.getElementById("modal-icon");
    const modalContent = document.querySelector(".modal-content");
    const modalImage = document.getElementById("modal-image");
    const modalBody = document.querySelector(".modal-body");

    // Preload images for faster modal opening
    fieldCards.forEach(card => {
      const imgSrc = card.getAttribute("data-img");
      if (imgSrc) {
        const img = new Image();
        img.src = imgSrc;
      }
    });

    const openModal = (title, subtitle, icon, imgSrc, desc, layout) => {
      if (modalTitle) modalTitle.textContent = title;
      if (modalSubtitle) modalSubtitle.textContent = subtitle;
      if (modalIcon) modalIcon.textContent = icon;
      if (modalImage && imgSrc) modalImage.src = imgSrc;

      if (modalBody && desc) {
        modalBody.innerHTML = `<p>${desc}</p>`;
      }

      if (layout === "one-third") {
        fieldModal.classList.add("bime-card--one-third");
        fieldModal.classList.remove("bime-card--dark-mask");
      } else if (layout === "dark-mask") {
        fieldModal.classList.add("bime-card--dark-mask");
        fieldModal.classList.remove("bime-card--one-third");
      } else {
        fieldModal.classList.remove("bime-card--one-third", "bime-card--dark-mask");
      }

      fieldModal.classList.remove("modal-hidden");
    };

    const closeModal = () => {
      if (fieldModal) fieldModal.classList.add("modal-hidden");
    };

    fieldCards.forEach(card => {
      card.addEventListener("click", () => {
        const titleEl = card.querySelector("h3");
        const subtitleEl = card.querySelector("p");
        const iconEl = card.querySelector(".bime-fields__node-icon");
        const imgSrc = card.getAttribute("data-img");
        const desc = card.getAttribute("data-desc");
        const layout = card.getAttribute("data-layout");

        if (titleEl && subtitleEl && iconEl) {
          openModal(titleEl.textContent, subtitleEl.textContent, iconEl.textContent, imgSrc, desc, layout);
        }
      });
    });
    // (Removed duplicate variable declarations that were causing a SyntaxError)

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

    // --- About Author Modal Triggering ---
    const authorModal = document.getElementById("author-modal");
    const aboutAuthorBtn = document.getElementById("about-author-btn");
    const authorCloseBtn = document.getElementById("author-close-btn");
    const authorBackdrop = authorModal ? authorModal.querySelector(".modal-backdrop") : null;

    const openAuthorModal = (e) => {
      if (e) e.preventDefault();
      if (!authorModal) return;

      authorModal.classList.remove("modal-hidden");

      // Close mobile dropdown if active
      const menuBtn = document.getElementById("menu-btn");
      const dropdownMenu = document.getElementById("dropdown-menu");
      if (menuBtn && dropdownMenu) {
        menuBtn.classList.remove("active");
        dropdownMenu.classList.remove("active");
      }
    };

    const closeAuthorModal = () => {
      if (!authorModal) return;
      authorModal.classList.add("modal-hidden");
    };

    if (aboutAuthorBtn) aboutAuthorBtn.addEventListener("click", openAuthorModal);
    if (authorCloseBtn) authorCloseBtn.addEventListener("click", closeAuthorModal);
    if (authorBackdrop) authorBackdrop.addEventListener("click", closeAuthorModal);

    // --- Header Dropdown Menu Logic ---
    const menuBtn = document.getElementById("menu-btn");
    const dropdownMenu = document.getElementById("dropdown-menu");
    if (menuBtn && dropdownMenu) {
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        menuBtn.classList.toggle("active");
        dropdownMenu.classList.toggle("active");
      });
      // Close when clicking outside
      document.addEventListener("click", (e) => {
        if (!menuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
          menuBtn.classList.remove("active");
          dropdownMenu.classList.remove("active");
        }
      });
    }

    // --- Simple Visitor Counter (counterapi.dev) ---
    const visitorCountText = document.getElementById("visitor-count-text");
    try {
      const namespace = "ezgif-bime-dna-demo"; // Unique namespace for your project
      const hasVisited = localStorage.getItem("hasVisited");

      let url = `https://api.counterapi.dev/v1/${namespace}/visits`;
      if (!hasVisited) {
        url += "/up"; // Increment if first time
        localStorage.setItem("hasVisited", "true");
      }

      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (visitorCountText && data.count) {
            visitorCountText.textContent = data.count.toLocaleString();
          }
        })
        .catch(err => {
          console.error("Counter API failed", err);
          if (visitorCountText) visitorCountText.textContent = "無法取得";
        });

    } catch (err) {
      if (visitorCountText) visitorCountText.textContent = "無法取得";
    }

    // --- Page-Flip Transition: DNA → Six Fields ---
    const sixFieldsEl = document.getElementById("six-fields");
    const dnaCanvasWrapper = document.querySelector(".bime-dna__canvas-wrapper");
    const flipTrigger = document.getElementById("flip-trigger");

    if (sixFieldsEl && dnaCanvasWrapper && flipTrigger) {
      // Reset six-fields to its initial hidden state
      gsap.set(sixFieldsEl, { y: "100vh" });

      // Track whether flip has completed so we don't run it twice
      let flipDone = false;

      ScrollTrigger.create({
        trigger: "#flip-trigger",
        start: "top 80%",       // 當 flip-trigger 的頂部進入視窗 80% 位置
        end: "bottom top",
        onEnter: () => {
          if (flipDone) return;
          flipDone = true;

          // 1. 先確保 six-fields 是 fixed / translateY(100vh) 狀態
          gsap.set(sixFieldsEl, {
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            y: "100vh",
            zIndex: 20,
          });

          // 2. 翻頁動畫：six-fields 從底部滑上來，DNA canvas 同時向上淡出
          const flipTl = gsap.timeline({
            onComplete: () => {
              // 翻頁完成：解除 fixed 定位，改為正常文件流
              // 步驟：
              //   1. 暫時鎖定 body 不可滾動
              //   2. 將 six-fields 切換為 relative
              //   3. ScrollTrigger.refresh() 讓 ST 重算距離
              //   4. 把 window.scrollY 跳到 six-fields 的 offsetTop
              //   5. 解鎖滾動

              // 1. 鎖定 body 滾動（防止瞬移抖動）
              document.body.style.overflow = "hidden";

              // 2. 切換 six-fields 回正常流
              gsap.set(sixFieldsEl, {
                position: "relative",
                transform: "none",
                height: "auto",
                minHeight: "100vh",
                bottom: "auto",
                left: "auto",
                width: "100%",
                y: 0,
                zIndex: 10,
              });
              sixFieldsEl.classList.add("is-landed");

              // 隱藏 DNA canvas wrapper
              gsap.set(dnaCanvasWrapper, { display: "none" });

              // 3. 告知 ScrollTrigger 重新計算佈局
              ScrollTrigger.refresh();

              // 4. 滾動到 six-fields 頂部（讓視窗與正常流位置同步）
              requestAnimationFrame(() => {
                const targetY = sixFieldsEl.offsetTop;
                window.scrollTo({ top: targetY, behavior: "instant" });

                // 5. 解鎖滾動
                document.body.style.overflow = "";

                // 再次 refresh 確保 ST triggers 與新位置同步
                ScrollTrigger.refresh();
              });
            }
          });

          // Six-fields 從 translateY(100vh) 滑上來
          flipTl.to(sixFieldsEl, {
            y: 0,
            duration: 0.85,
            ease: "power3.inOut",
          }, 0);

          // DNA canvas wrapper 同時向上退場（淡出 + 稍微上移）
          flipTl.to(dnaCanvasWrapper, {
            y: "-8vh",
            autoAlpha: 0,
            duration: 0.6,
            ease: "power2.in",
          }, 0);
        },
        onLeaveBack: () => {
          // 使用者往回滾：無論 flipDone 狀態都要重置
          flipDone = false;

          // 恢復 DNA canvas wrapper（清除 display:none 與位移）
          gsap.set(dnaCanvasWrapper, { clearProps: "display,y,opacity,visibility" });
          gsap.set(dnaCanvasWrapper, { autoAlpha: 1, y: 0 });

          // 若 six-fields 已切換為正常流（is-landed）
          const wasLanded = sixFieldsEl.classList.contains("is-landed");

          if (wasLanded) {
            // 記下 six-fields 在正常流中佔用的高度，用來補償滾動位置
            const sixFieldsHeight = sixFieldsEl.getBoundingClientRect().height;
            const currentScrollY = window.scrollY;

            // 移除 is-landed class
            sixFieldsEl.classList.remove("is-landed");

            // 將 six-fields 切回 fixed 底部隱藏
            gsap.set(sixFieldsEl, {
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              y: "100vh",
              zIndex: 20,
              clearProps: "minHeight,transform"
            });

            // 補償滾動位置（文件縮短後，往上滾補回 six-fields 的高度）
            document.body.style.overflow = "hidden";
            window.scrollTo({ top: Math.max(0, currentScrollY - sixFieldsHeight), behavior: "instant" });
            document.body.style.overflow = "";
          } else {
            // 翻頁動畫中途就回滾（還沒 landed）
            gsap.set(sixFieldsEl, {
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              y: "100vh",
              zIndex: 20,
            });
          }

          // 重新計算 ScrollTrigger
          ScrollTrigger.refresh();
        }
      });
    }

    window.addEventListener("resize", render);

    render(); // Initial render
  }

  async function boot() {
    try {
      await preloadImages();

      loaderEl.style.opacity = "0";
      setTimeout(() => {
        loaderEl.style.display = "none";
        pageEl.classList.remove("is-hidden");
        initGSAP();
      }, 500);
    } catch (err) {
      console.error("Boot failed:", err);
    }
  }

  boot();
})();



