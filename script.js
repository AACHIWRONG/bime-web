/* global gsap, ScrollTrigger */

(() => {
  gsap.registerPlugin(ScrollTrigger);

  const START_FRAME = 59;
  const FRAME_COUNT = 1;
  const FRAME_STEP = 3; // 跳幀設定：每 2 張挑 1 張
  const frameSequence = [];
  const canvas = document.getElementById("animation-canvas");
  const ctx = canvas.getContext("2d");
  const loaderEl = document.getElementById("loader");
  const loaderBarEl = document.getElementById("loaderBar");
  const loaderPctEl = document.getElementById("loaderPct");
  const pageEl = document.getElementById("page");

  const frames = {}; // Use object for sparse array
  const airship = { index: 0 }; // 使用序列索引而非直接幀數

  // 1. Preload Images
  async function preloadImages() {
    const promises = [];

    // 根據步長建立幀序列 (支援正向或反向)
    if (START_FRAME <= FRAME_COUNT) {
      for (let i = START_FRAME; i <= FRAME_COUNT; i += FRAME_STEP) {
        frameSequence.push(i);
      }
    } else {
      for (let i = START_FRAME; i >= FRAME_COUNT; i -= FRAME_STEP) {
        frameSequence.push(i);
      }
    }

    frameSequence.forEach((i) => {
      const n = String(i).padStart(3, "0");
      const path = `./ezgif-frame-${n}.jpg`;

      const promise = new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
          frames[i] = img;
          const loadedCount = Object.values(frames).filter(x => x).length;
          const totalToLoad = frameSequence.length;
          const progress = Math.round((loadedCount / totalToLoad) * 100);
          loaderBarEl.style.width = `${progress}%`;
          loaderPctEl.textContent = progress;
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load: ${path}`);
          resolve();
        };
      });
      promises.push(promise);
    });
    await Promise.all(promises);
  }

  // 2. Canvas Rendering (object-fit: contain logic)
  function render() {
    const frameNum = frameSequence[Math.floor(airship.index)];
    const img = frames[frameNum];
    if (!img) return;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const imgWidth = img.width;
    const imgHeight = img.height;

    // Calculate aspect ratios
    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = imgWidth / imgHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
      // Image is wider than canvas proportionately
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      // Image is taller than canvas proportionately
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  // 3. Physics Integration (Matter.js)
  let engine, renderPhysics, runner, world;
  const physicsCanvas = document.getElementById("physics-canvas");

  function initPhysics() {
    console.log("Initializing Physics v2...");
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Vector } = Matter;

    engine = Engine.create();
    world = engine.world;

    renderPhysics = Render.create({
      canvas: physicsCanvas,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: "transparent",
        wireframes: false
      }
    });

    Render.run(renderPhysics);
    runner = Runner.create();
    Runner.run(runner, engine);

    // Create Walls
    const wallOptions = { isStatic: true, render: { visible: false } };
    const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, wallOptions);
    const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, wallOptions);
    const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, wallOptions);
    Composite.add(world, [ground, leftWall, rightWall]);

    // Initial Caramels (Rectangular Wrapped Candies)
    for (let i = 0; i < 30; i++) {
      spawnCaramel();
    }

    function handleRepulsion(x, y) {
      const pos = { x, y };
      const bodies = Composite.allBodies(world);

      bodies.forEach(body => {
        if (body.isStatic) return;

        const forceMagnitude = 0.015;
        const dist = Vector.magnitude(Vector.sub(body.position, pos));

        if (dist < 160) {
          const force = Vector.mult(Vector.normalise(Vector.sub(body.position, pos)), forceMagnitude);
          Matter.Body.applyForce(body, body.position, force);
        }
      });
    }

    // Universal Pointer Interaction (Mouse & Touch)
    window.addEventListener("pointermove", (e) => {
      handleRepulsion(e.clientX, e.clientY);
    });

    // Interaction: Spawn on click/tap
    function handleSpawn(e) {
      // Prevent multiple spawns from ghost clicks if needed, 
      // but for pointerdown/click it's usually fine.
      spawnCaramel();
      spawnCaramel();
    }

    window.addEventListener("pointerdown", handleSpawn);

    // Sidebar Spawn Button
    const spawnBtn = document.getElementById("spawn-button");
    if (spawnBtn) {
      spawnBtn.addEventListener("pointerdown", (e) => {
        e.stopPropagation(); // Avoid double spawn from window pointerdown
        for(let i=0; i<3; i++) spawnCaramel();
      });
    }

    window.addEventListener("resize", () => {
      renderPhysics.canvas.width = window.innerWidth;
      renderPhysics.canvas.height = window.innerHeight;
      Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 50 });
      Matter.Body.setPosition(rightWall, { x: window.innerWidth + 50, y: window.innerHeight / 2 });
    });
  }

  async function removeBackground(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // More aggressive edge removal (focusing on white/light fringes)
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // 1. Aggressive White/Light-Grey Removal
          // If all channels are bright, it's likely background or fringe
          const isBright = r > 210 && g > 210 && b > 210;

          // 2. Luminance-based check for light fringes
          const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          const isLightFringe = luminance > 220;

          // 3. Dark edges/black artifacts (R, G, B all very low)
          const isBlack = r < 35 && g < 35 && b < 35;

          // 4. Improved Neutral Grey Check (very close to each other)
          const diff = Math.max(r, g, b) - Math.min(r, g, b);
          const isNeutral = diff < 15 && (r > 190 || r < 60);

          if (isBright || isLightFringe || isBlack || isNeutral) {
            data[i + 3] = 0; // Transparent
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
    });
  }

  let caramelTextureUrl = "";
  let morinagaTextureUrl = "";

  async function boot() {
    try {
      await preloadImages();

      console.log("Processing textures...");
      // CARAMEL_BASE64 and MORINAGA_BOX_BASE64 are from caramel_data.js
      // caramelTextureUrl = await removeBackground(CARAMEL_BASE64);
      caramelTextureUrl = "./square_caramel_v2.png";
      morinagaTextureUrl = await removeBackground(MORINAGA_BOX_BASE64);

      loaderEl.style.opacity = "0";
      setTimeout(() => {
        loaderEl.style.display = "none";
        pageEl.classList.remove("is-hidden");
        initGSAP();
        initPhysics();
      }, 500);
    } catch (err) {
      console.error("Boot failed:", err);
    }
  }

  function spawnCaramel() {
    const { Bodies, Composite } = Matter;
    const x = Math.random() * window.innerWidth;
    const y = -150 - Math.random() * 400;

    // 1:9 ratio for Morinaga box
    const isRare = Math.random() < 0.1;

    if (isRare) {
      // Rare Morinaga Box
      const width = 80 + Math.random() * 20;
      const height = width * 1.0; // The icon generated is roughly square/upright

      const box = Bodies.rectangle(x, y, width, height, {
        restitution: 0.3,
        friction: 0.3,
        chamfer: { radius: 5 },
        render: {
          sprite: {
            texture: morinagaTextureUrl,
            xScale: width / 1024,
            yScale: height / 1024
          }
        }
      });
      Composite.add(world, box);
    } else {
      // Standard Caramel
      const size = 45 + Math.random() * 10;
      const caramel = Bodies.rectangle(x, y, size, size, {
        restitution: 0.3,
        friction: 0.3,
        chamfer: { radius: 10 },
        render: {
          sprite: {
            texture: caramelTextureUrl,
            xScale: size / 1024,
            yScale: size / 1024
          }
        }
      });
      Composite.add(world, caramel);
    }
  }

  // 4. GSAP Initialization
  function initGSAP() {
    gsap.to(airship, {
      index: frameSequence.length - 1,
      snap: "index",
      ease: "none",
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
      onUpdate: () => {
        render();
        // Toggle Scroll Helper Visibility
        const helper = document.getElementById('scroll-helper');
        if (helper) {
          if (progress > 0.95) {
            helper.classList.add('is-hidden');
          } else {
            helper.classList.remove('is-hidden');
          }
        }
      }
    });

    // Add click-to-scroll functionality for the scroll helper
    const scrollHelper = document.getElementById('scroll-helper');
    if (scrollHelper) {
      scrollHelper.addEventListener('click', () => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      });
    }

    window.addEventListener("resize", render);
    render(); // Initial render
  }

  boot();
})();
