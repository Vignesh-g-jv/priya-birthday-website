/* ============================================================
   ✏️ QUICK CUSTOMIZATION
   ============================================================ */
const HER_NAME = "Birthday girl";                 // <-- her name
const YOUR_SIGNOFF = "Your best friend Vicky";   // <-- how you sign off

document.getElementById("her-name-hero").textContent = HER_NAME;

/* ============================================================
   PROGRESS BAR
   ============================================================ */
const progressBar = document.getElementById("progress-bar");
function updateProgress() {
  const site = document.getElementById("site");
  if (site.hidden) { progressBar.style.width = "0%"; return; }
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = scrolled + "%";
}
document.addEventListener("scroll", updateProgress, { passive: true });

/* ============================================================
   INTERACTIVE BACKGROUND PARTICLES (constellation-style)
   ============================================================ */
const bgCanvas = document.getElementById("bg-canvas");
const bgCtx = bgCanvas.getContext("2d");
let particles = [];
let mouse = { x: -9999, y: -9999 };

function resizeBg() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  const count = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 18000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    r: Math.random() * 1.8 + 1
  }));
}
window.addEventListener("resize", resizeBg);
resizeBg();

window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });

function drawBg() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  particles.forEach(p => {
    // gentle drift
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > bgCanvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > bgCanvas.height) p.vy *= -1;

    // mild repulsion from cursor
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 90) {
      const force = (90 - dist) / 90;
      p.x += (dx / dist) * force * 1.6;
      p.y += (dy / dist) * force * 1.6;
    }

    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fillStyle = "rgba(216, 162, 74, 0.45)";
    bgCtx.fill();
  });

  // connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist < 110) {
        bgCtx.beginPath();
        bgCtx.moveTo(particles[i].x, particles[i].y);
        bgCtx.lineTo(particles[j].x, particles[j].y);
        bgCtx.strokeStyle = `rgba(255, 111, 89, ${0.12 * (1 - dist / 110)})`;
        bgCtx.lineWidth = 1;
        bgCtx.stroke();
      }
    }
  }
  requestAnimationFrame(drawBg);
}
requestAnimationFrame(drawBg);

/* ============================================================
   CURSOR TRAIL (little emoji sparkles)
   ============================================================ */
const cursorLayer = document.getElementById("cursor-layer");
const trailEmojis = ["✨", "💛", "🎈", "⭐"];
let lastTrail = 0;
window.addEventListener("pointermove", (e) => {
  const now = Date.now();
  if (now - lastTrail < 70) return;
  lastTrail = now;
  const bit = document.createElement("span");
  bit.className = "cursor-bit";
  bit.textContent = trailEmojis[Math.floor(Math.random() * trailEmojis.length)];
  bit.style.left = e.clientX + "px";
  bit.style.top = e.clientY + "px";
  cursorLayer.appendChild(bit);
  setTimeout(() => bit.remove(), 900);
});

/* ============================================================
   GATE FLOW: envelope -> hero -> question -> (yes) site
   ============================================================ */
function showGateScreen(id) {
  document.querySelectorAll(".gate-screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

const envelope = document.getElementById("envelope");
envelope.addEventListener("click", () => {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");
  setTimeout(() => showGateScreen("hero-screen"), 1100);
});

document.getElementById("go-question").addEventListener("click", () => {
  showGateScreen("question-screen");
});

/* ---------------- dodging "No" button ---------------- */
const noBtn = document.getElementById("btn-no");
const yesBtn = document.getElementById("btn-yes");
const taunt = document.getElementById("no-taunt");

const taunts = [
  "nice try 😏",
  "nope, not today",
  "keep trying, I dare you",
  "you can't catch me",
  "wrong answer, try again",
  "getting smaller and smaller...",
  "this button has left the chat"
];
let noDodgeCount = 0;
const NO_MIN_SCALE = 0.45;

function dodge() {
  noBtn.classList.add("dodging");
  const scale = Math.max(NO_MIN_SCALE, 1 - noDodgeCount * 0.08);
  noBtn.style.fontSize = (1 * scale) + "rem";
  noBtn.style.padding = `${15 * scale}px ${30 * scale}px`;

  const margin = 50;
  const w = noBtn.offsetWidth || 100;
  const h = noBtn.offsetHeight || 50;
  const maxX = window.innerWidth - w - margin;
  const maxY = window.innerHeight - h - margin;
  const newX = Math.max(margin, Math.random() * maxX);
  const newY = Math.max(margin, Math.random() * maxY);
  noBtn.style.left = newX + "px";
  noBtn.style.top = newY + "px";

  noDodgeCount++;
  taunt.textContent = taunts[Math.min(noDodgeCount - 1, taunts.length - 1)];

  if (noDodgeCount >= 8) {
    noBtn.style.opacity = "0";
    noBtn.style.pointerEvents = "none";
    taunt.textContent = "yeah, that button's gone. only one option left.";
  }
}

noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); }, { passive: false });
noBtn.addEventListener("click", (e) => { e.preventDefault(); dodge(); });

yesBtn.addEventListener("click", () => {
  document.getElementById("gate").style.display = "none";
  const site = document.getElementById("site");
  site.hidden = false;
  document.body.style.overflow = "auto";
  window.scrollTo({ top: 0, behavior: "instant" });

 /* document.getElementById("birthday-message").textContent =
    `Happy Birthday to my favorite human! Thank you for every inside joke, every 2am call, ` +
    `every "we're not going but okay fine we're going," and every memory below. ` +
    `I hope this year gives you everything you deserve. I love you, ${HER_NAME}. 🎉💗`;*/
  document.querySelector(".signoff").textContent = `— ${YOUR_SIGNOFF}`;

  burstConfetti(220);
  tryAutoplayMusic();
  updateProgress();

  // the scratch card canvas has real dimensions only once #site is visible
  requestAnimationFrame(initScratch);
});

/* ============================================================
   DOT NAV — active section highlight + smooth click scroll
   ============================================================ */
const dots = document.querySelectorAll("#dot-nav .dot");
const pages = document.querySelectorAll("#site .page");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      dots.forEach(d => d.classList.toggle("active", d.getAttribute("href") === "#" + id));
    }
  });
}, { threshold: 0.5 });
pages.forEach(p => sectionObserver.observe(p));

/* ============================================================
   TIMELINE SCROLL REVEAL
   ============================================================ */
const tlItems = document.querySelectorAll(".tl-item");
const tlObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      tlObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
tlItems.forEach(item => tlObserver.observe(item));

/* ============================================================
   GALLERY: 3D tilt on hover + click-to-lightbox
   ============================================================ */
const polaroids = document.querySelectorAll(".polaroid");
polaroids.forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotate(0deg) perspective(600px) rotateX(${-py * 18}deg) rotateY(${px * 18}deg) scale(1.06)`;
  });
  card.addEventListener("mouseleave", () => { card.style.transform = ""; });

  card.addEventListener("click", () => {
    const img = card.querySelector("img").src;
    const caption = card.querySelector("figcaption").textContent;
    openLightbox(img, caption);
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxCaption.textContent = caption;
  lightbox.hidden = false;
}
lightbox.addEventListener("click", () => { lightbox.hidden = true; });

/* ============================================================
   SCRATCH CARD
   ============================================================ */
const scratchCanvas = document.getElementById("scratch-canvas");
const sCtx = scratchCanvas.getContext("2d");
let scratchRevealed = false;

function initScratch() {
  const wrap = scratchCanvas.parentElement;
  scratchCanvas.width = wrap.clientWidth;
  scratchCanvas.height = wrap.clientHeight;
  sCtx.globalCompositeOperation = "source-over";

  const grad = sCtx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
  grad.addColorStop(0, "#F3B6C4");
  grad.addColorStop(1, "#A9C7D8");
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

  sCtx.fillStyle = "#3A2A1E";
  sCtx.font = "600 20px Inter, sans-serif";
  sCtx.textAlign = "center";
  sCtx.textBaseline = "middle";
  sCtx.fillText("✨ scratch here ✨", scratchCanvas.width / 2, scratchCanvas.height / 2);
  scratchRevealed = false;
}
window.addEventListener("resize", initScratch);
initScratch();

let scratching = false;
function scratchAt(x, y) {
  sCtx.globalCompositeOperation = "destination-out";
  sCtx.beginPath();
  sCtx.arc(x, y, 26, 0, Math.PI * 2);
  sCtx.fill();
}
function getPos(e) {
  const rect = scratchCanvas.getBoundingClientRect();
  const point = e.touches ? e.touches[0] : e;
  return { x: point.clientX - rect.left, y: point.clientY - rect.top };
}
function checkScratchProgress() {
  if (scratchRevealed || scratchCanvas.width === 0 || scratchCanvas.height === 0) return;
  const data = sCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
  let cleared = 0;
  for (let i = 3; i < data.length; i += 4 * 12) {
    if (data[i] === 0) cleared++;
  }
  const total = data.length / (4 * 12);
  if (cleared / total > 0.45) {
    scratchRevealed = true;
    scratchCanvas.style.transition = "opacity 0.5s ease";
    scratchCanvas.style.opacity = "0";
    setTimeout(() => { scratchCanvas.style.pointerEvents = "none"; }, 500);
    burstConfetti(80);
  }
}
scratchCanvas.addEventListener("pointerdown", (e) => { scratching = true; const p = getPos(e); scratchAt(p.x, p.y); });
scratchCanvas.addEventListener("pointermove", (e) => { if (!scratching) return; const p = getPos(e); scratchAt(p.x, p.y); checkScratchProgress(); });
window.addEventListener("pointerup", () => { scratching = false; checkScratchProgress(); });

/* ============================================================
   CAKE CANDLES + FIREWORKS FINALE
   ============================================================ */
const candles = document.querySelectorAll(".candle");
const finalNote = document.getElementById("final-note");
let litCount = candles.length;

candles.forEach(candle => {
  candle.addEventListener("click", () => {
    if (candle.dataset.lit === "false") return;
    candle.dataset.lit = "false";
    const smoke = document.createElement("span");
    smoke.className = "smoke";
    candle.appendChild(smoke);
    setTimeout(() => smoke.remove(), 1100);
    litCount--;
    if (litCount === 0) {
      finalNote.textContent = `Happy Birthday ${HER_NAME}! I love you so much — here's to another year of us being unstoppable. 💗`;
      launchFireworks();
      burstConfetti(160);
    } else {
      finalNote.textContent = `${litCount} candle${litCount > 1 ? "s" : ""} left...`;
    }
  });
});

/* ============================================================
   CONFETTI
   ============================================================ */
const confettiCanvas = document.getElementById("confetti-canvas");
const cCtx = confettiCanvas.getContext("2d");
let confettiPieces = [];
let confettiRunning = false;
const confettiColors = ["#FF6F59", "#FFA552", "#7FA37A", "#D8A24A", "#F3B6C4", "#A9C7D8"];

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeConfetti);
resizeConfetti();

function burstConfetti(count = 150) {
  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: -20 - Math.random() * 200,
      w: 6 + Math.random() * 6,
      h: 10 + Math.random() * 6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      vy: 2 + Math.random() * 3,
      vx: -1.5 + Math.random() * 3,
      rot: Math.random() * 360,
      vr: -6 + Math.random() * 12,
      life: 0
    });
  }
  if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(animateConfetti); }
}
function animateConfetti() {
  cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
    cCtx.save();
    cCtx.translate(p.x, p.y);
    cCtx.rotate((p.rot * Math.PI) / 180);
    cCtx.fillStyle = p.color;
    cCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    cCtx.restore();
  });
  confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height + 40 && p.life < 600);
  if (confettiPieces.length > 0) requestAnimationFrame(animateConfetti);
  else confettiRunning = false;
}

/* ============================================================
   FIREWORKS
   ============================================================ */
const fwCanvas = document.getElementById("fireworks-canvas");
const fwCtx = fwCanvas.getContext("2d");
let fwParticles = [];
let fwRunning = false;
function resizeFw() { fwCanvas.width = window.innerWidth; fwCanvas.height = window.innerHeight; }
window.addEventListener("resize", resizeFw);
resizeFw();

function spawnShell() {
  const cx = 100 + Math.random() * (fwCanvas.width - 200);
  const cy = 100 + Math.random() * (fwCanvas.height * 0.45);
  const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
  const count = 42;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 2 + Math.random() * 3;
    fwParticles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color, life: 0, maxLife: 60 + Math.random() * 20
    });
  }
}
function launchFireworks() {
  let bursts = 0;
  const interval = setInterval(() => {
    spawnShell();
    bursts++;
    if (bursts >= 5) clearInterval(interval);
  }, 350);
  if (!fwRunning) { fwRunning = true; requestAnimationFrame(animateFireworks); }
}
function animateFireworks() {
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  fwParticles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life++;
    const alpha = Math.max(0, 1 - p.life / p.maxLife);
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
    fwCtx.fillStyle = p.color.replace(")", "").replace("rgb", "rgba");
    fwCtx.globalAlpha = alpha;
    fwCtx.fillStyle = p.color;
    fwCtx.fill();
    fwCtx.globalAlpha = 1;
  });
  fwParticles = fwParticles.filter(p => p.life < p.maxLife);
  if (fwParticles.length > 0) requestAnimationFrame(animateFireworks);
  else fwRunning = false;
}

/* ============================================================
   SECRET EASTER EGG
   ============================================================ */
const secretBtn = document.getElementById("secret-btn");
const secretModal = document.getElementById("secret-modal");
secretBtn.addEventListener("click", () => { secretModal.hidden = false; });
document.getElementById("secret-close").addEventListener("click", () => { secretModal.hidden = true; });

/* ============================================================
   MUSIC
   ============================================================ */
const bgm = document.getElementById("bgm");
const musicToggle = document.getElementById("music-toggle");
let musicOn = false;
function setMusicUI() { musicToggle.classList.toggle("playing", musicOn); }
musicToggle.addEventListener("click", () => {
  musicOn = !musicOn;
  if (musicOn) bgm.play().catch(() => { musicOn = false; setMusicUI(); });
  else bgm.pause();
  setMusicUI();
});
function tryAutoplayMusic() {
  if (musicOn) return;
  bgm.play().then(() => { musicOn = true; setMusicUI(); }).catch(() => {});
}
