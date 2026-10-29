"use strict";

/* ==========================================================
   1) EDIT THIS SECTION — everything personal lives here
   ========================================================== */
const CONFIG = {
  // >>> HER NAME: shown on the intro screen and animated letter by letter
  name: "Sanelisiwe Dlusha",

  // >>> HER BIRTHDAY: shown under her name (any text you like)
  birthday: "29 October 2026",

  // >>> YOUR NAME: used in the letter signature below
  from: "Mduduzi Motloung",

  // >>> BIRTHDAY MESSAGE (typed on screen 3). Use \n for a new line.
  message:
    "Happy Birthday, my love. ❤️\n\n" +
    "On the day the world was given you, I'm reminded how lucky I am that our paths crossed. " +
    "You make my ordinary days feel magical and my hardest days feel lighter.\n\n" +
    "I hope today wraps you in everything you deserve: laughter, warmth and all the love in the world. " +
    "I made this little corner of the internet just for you, because you deserve something as special as you are.",

  // >>> LOVE LETTER. {name} and {from} are replaced automatically.
  letterGreeting: "My dearest {name},",
  letter:
    "I don't know how to put into words what you mean to me, but I'll try.\n\n" +
    "You are the first person I want to tell good news to, and the person I reach for when the day gets heavy. " +
    "Your laugh is my favourite sound, your kindness is my favourite thing about you, " +
    "and being loved by you is the greatest gift I have ever been given.\n\n" +
    "Thank you for every shared joke, every quiet moment and every adventure so far. " +
    "I promise to keep choosing you, today and every day after it.\n\n" +
    "Happy Birthday, my love. I hope 19 years treat you as beautifully as you are.",
  letterSignature: "Forever yours,\n{from}",

  // >>> FINAL SCREEN
  finalTitle: "You Are My Favourite Person ❤️",
  finalSubtitle: "Happy Birthday, my love. Here's to every adventure still waiting for us."
};

/* >>> PHOTOS: put your pictures in the "images" folder and list them here.
   - Keep file names lowercase, no spaces (photo1.jpg, photo2.jpg ...)
   - Add or remove lines freely. 6 to 12 photos looks best in the heart.
   - Change the caption text to anything you like.
   - If a file is missing, a pretty placeholder is shown instead. */
const PHOTOS = [
  { src: "WhatsApp Image 2026-10-29 at 03.10.45.jpeg", caption: "My favourite" },
  { src: "WhatsApp Image 2026-10-29 at 03.11.08.jpeg", caption: "Just the two of us" },
  { src: "WhatsApp Image 2026-10-29 at 03.12.32.jpeg", caption: "Nice Hair" },
  { src: "WhatsApp Image 2026-10-29 at 03.14.17.jpeg", caption: "☠️☠️☠️" },
  { src: "WhatsApp Image 2026-10-29 at 03.14.18 (1).jpeg", caption: "My favourite picture too" },
  { src: "WhatsApp Image 2026-10-29 at 03.14.18 (2).jpeg", caption: "Xhosa hun does it better" },
  { src: "WhatsApp Image 2026-10-29 at 03.14.18.jpeg", caption: "Opss :)" },
  { src: "WhatsApp Image 2026-10-29 at 03.14.19.jpeg", caption: "I Love you" }
];

// Typing speed in milliseconds per character (smaller = faster)
const SPEED = { message: 42, letter: 26 };

/* ==========================================================
   2) Helpers
   ========================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const IS_SMALL = window.matchMedia("(max-width: 600px)").matches;
const fill = (s) => s.replace(/\{name\}/g, CONFIG.name).replace(/\{from\}/g, CONFIG.from);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (a, b) => a + Math.random() * (b - a);

const HEART_D = "M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z";
const HEART_PATH = new Path2D(HEART_D);

// Types text into an element. Returns a promise with a .skip() method.
function typeText(el, text, speed) {
  const chars = Array.from(text);
  let i = 0, timer = null, resolveFn = () => {};
  const promise = new Promise((resolve) => {
    resolveFn = resolve;
    if (REDUCED) { el.textContent = text; resolve(); return; }
    el.textContent = "";
    el.classList.add("typing");
    (function step() {
      if (i >= chars.length) { el.classList.remove("typing"); resolve(); return; }
      const ch = chars[i++];
      el.textContent += ch;
      const pause = /[.,!?]/.test(ch) ? speed * 6 : (ch === "\n" ? speed * 8 : 0);
      timer = setTimeout(step, speed + pause);
    })();
  });
  promise.skip = () => {
    clearTimeout(timer);
    el.textContent = text;
    el.classList.remove("typing");
    resolveFn();
  };
  return promise;
}

let toastTimer = null;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3500);
}

/* ==========================================================
   3) Matrix-style falling pink code
   ========================================================== */
const mCanvas = $("#matrix");
const mctx = mCanvas.getContext("2d");
const GLYPHS = "♥01LOVE♡10ILOVEYOU♥01".split("");
const FS = 16;
let drops = [], lastM = 0;

function sizeMatrix() {
  mCanvas.width = window.innerWidth;
  mCanvas.height = window.innerHeight;
  const cols = Math.ceil(mCanvas.width / FS);
  drops = Array.from({ length: cols }, () => Math.floor(Math.random() * (mCanvas.height / FS)));
  mctx.fillStyle = "#0a0010";
  mctx.fillRect(0, 0, mCanvas.width, mCanvas.height);
  if (REDUCED) drawStaticMatrix();
}

function drawStaticMatrix() {
  mctx.font = FS + "px monospace";
  for (let n = 0; n < drops.length * 14; n++) {
    mctx.fillStyle = Math.random() > .5 ? "#ff4d8d" : "#b3123f";
    mctx.fillText(pick(GLYPHS), Math.floor(Math.random() * drops.length) * FS, Math.random() * mCanvas.height);
  }
}

function drawMatrix(ts) {
  requestAnimationFrame(drawMatrix);
  if (document.hidden || ts - lastM < 45) return;
  lastM = ts;
  mctx.fillStyle = "rgba(10, 0, 16, 0.12)";
  mctx.fillRect(0, 0, mCanvas.width, mCanvas.height);
  mctx.font = FS + "px monospace";
  for (let i = 0; i < drops.length; i++) {
    const x = i * FS, y = drops[i] * FS;
    const r = Math.random();
    mctx.fillStyle = r > .96 ? "#ffffff" : (r > .5 ? "#ff4d8d" : "#d6246e");
    mctx.fillText(pick(GLYPHS), x, y);
    if (y > mCanvas.height && Math.random() > .975) drops[i] = 0;
    drops[i]++;
  }
}

/* ==========================================================
   4) Ambient layer: stars, glowing orbs, floating hearts
   ========================================================== */
const ambient = $("#ambient");
let heartTimer = null;

function buildAmbient() {
  for (let i = 0; i < (IS_SMALL ? 45 : 80); i++) {
    const s = document.createElement("span");
    s.className = "star";
    const size = rand(1, 3);
    s.style.cssText = `left:${rand(0, 100)}%;top:${rand(0, 100)}%;width:${size}px;height:${size}px;--d:${rand(2, 5)}s;--delay:${rand(0, 4)}s`;
    ambient.appendChild(s);
  }
  const orbColors = ["#ff2d6f", "#7a3fc4", "#b3123f", "#ff7ab0", "#5c0a2a"];
  for (let i = 0; i < 7; i++) {
    const o = document.createElement("span");
    o.className = "orb";
    const size = rand(120, 280);
    o.style.cssText = `left:${rand(-5, 95)}%;top:${rand(-5, 95)}%;width:${size}px;height:${size}px;background:${pick(orbColors)};--d:${rand(10, 20)}s;--mx:${rand(-60, 60)}px;--my:${rand(-70, 70)}px`;
    ambient.appendChild(o);
  }
}

function spawnHeart() {
  if (document.hidden || $$(".float-heart", ambient).length > 38) return;
  const h = document.createElement("span");
  h.className = "float-heart";
  h.textContent = pick(["❤", "♥", "💗", "💖", "💕", "♥"]);
  h.style.cssText = `left:${rand(0, 98)}%;font-size:${rand(14, 40)}px;animation-duration:${rand(6, 12)}s;--dx:${rand(-60, 60)}px;color:${pick(["#ff4d8d", "#ff85b3", "#ffc2da", "#ff2d6f"])}`;
  ambient.appendChild(h);
  h.addEventListener("animationend", () => h.remove());
}

function setHearts(everyMs) {
  clearInterval(heartTimer);
  heartTimer = null;
  if (REDUCED || !everyMs) return;
  heartTimer = setInterval(spawnHeart, everyMs);
}

/* ==========================================================
   5) Screen navigation
   ========================================================== */
const screens = {
  "intro": $("#intro"),
  "name-screen": $("#name-screen"),
  "message-screen": $("#message-screen"),
  "memories-screen": $("#memories-screen"),
  "letter-screen": $("#letter-screen"),
  "final-screen": $("#final-screen")
};
let current = "intro";

Object.entries(screens).forEach(([id, el]) => { el.inert = id !== "intro"; });

function goTo(id) {
  if (id === current) return;
  screens[current].classList.remove("active");
  screens[current].inert = true;
  const next = screens[id];
  next.inert = false;
  next.classList.add("active");
  next.scrollTop = 0;
  current = id;
  setHearts(id === "intro" ? 0 : (id === "final-screen" ? 260 : 700));
  setTimeout(() => { if (enter[id]) enter[id](); }, REDUCED ? 0 : 450);
}

/* ==========================================================
   6) Screen 2 — her name, letter by letter
   ========================================================== */
function animateName() {
  const title = $("#name-title");
  title.innerHTML = "";
  title.setAttribute("aria-label", CONFIG.name);
  $("#birthday-line").classList.add("hidden");
  $("#btn-to-message").classList.add("hidden");

  let index = 0;
  CONFIG.name.split(" ").forEach((word, w, words) => {
    const wordEl = document.createElement("span");
    wordEl.className = "word";
    wordEl.setAttribute("aria-hidden", "true");
    Array.from(word).forEach((ch) => {
      const s = document.createElement("span");
      s.className = "ch " + (index % 2 ? "pk" : "wh");
      s.textContent = ch;
      s.style.animationDelay = (0.3 + index * 0.14) + "s";
      wordEl.appendChild(s);
      index++;
    });
    title.appendChild(wordEl);
    if (w < words.length - 1) title.appendChild(document.createTextNode(" "));
  });

  const total = REDUCED ? 0 : (0.3 + index * 0.14 + 0.9) * 1000;
  setTimeout(() => {
    const line = $("#birthday-line");
    line.textContent = CONFIG.birthday;
    line.classList.remove("hidden");
  }, total);
  setTimeout(() => $("#btn-to-message").classList.remove("hidden"), total + (REDUCED ? 0 : 700));
}

/* ==========================================================
   7) Screen 3 — typed message
   ========================================================== */
let msgTyper = null;
function startMessage() {
  const btn = $("#btn-to-memories");
  btn.classList.add("hidden");
  if (msgTyper) msgTyper.skip();
  msgTyper = typeText($("#message-text"), fill(CONFIG.message), SPEED.message);
  msgTyper.then(() => btn.classList.remove("hidden"));
}

/* ==========================================================
   8) Screen 4 — memories: heart collage + viewer
   ========================================================== */
function placeholder(label) {
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>" +
    "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#5c0a2a'/><stop offset='1' stop-color='#1a0524'/></linearGradient></defs>" +
    "<rect width='400' height='400' fill='url(#g)'/>" +
    "<path transform='translate(136 110) scale(4.2)' fill='#ff4d8d' opacity='.9' d='" + HEART_D + "'/>" +
    "<text x='200' y='340' text-anchor='middle' font-family='sans-serif' font-size='24' fill='#ffd6e7'>" + label + "</text></svg>";
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function setImage(img, src, label) {
  img.onerror = () => { img.onerror = null; img.src = placeholder(label); };
  img.src = src;
}

let photoIndex = 0, collageBuilt = false;

function buildCollage() {
  if (collageBuilt) return;
  collageBuilt = true;
  const box = $("#collage");
  const n = PHOTOS.length;
  const size = Math.min(24, Math.max(13, 150 / n + 6)); // tile width in % of the collage

  PHOTOS.forEach((p, i) => {
    const t = (i / n) * Math.PI * 2;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const cx = 50 + (hx / 16) * (50 - size / 2 - 1);
    const cy = size / 2 + 1 + ((12 - hy) / 29) * (100 - size - 2);

    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.setAttribute("aria-label", "Show photo " + (i + 1) + ": " + (p.caption || ""));
    tile.style.cssText = `--s:${size}%;left:${cx}%;top:${cy}%;animation-delay:${REDUCED ? 0 : i * 0.09}s`;
    const img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    setImage(img, p.src, "Add photo " + (i + 1));
    tile.appendChild(img);
    tile.addEventListener("click", () => showPhoto(i));
    box.appendChild(tile);
  });
}

function showPhoto(i) {
  const n = PHOTOS.length;
  photoIndex = (i + n) % n;
  const p = PHOTOS[photoIndex];
  const viewer = $("#viewer");
  viewer.classList.add("swap");
  setTimeout(() => {
    const img = $("#viewer-img");
    setImage(img, p.src, "Add photo " + (photoIndex + 1));
    img.alt = p.caption || "Photo " + (photoIndex + 1);
    $("#viewer-caption").textContent = p.caption || "";
    $("#counter").textContent = (photoIndex + 1) + " / " + n;
    viewer.classList.remove("swap");
  }, REDUCED ? 0 : 230);
  $$(".tile").forEach((t, k) => t.classList.toggle("active", k === photoIndex));
}

/* ==========================================================
   9) Screen 5 — love letter
   ========================================================== */
let letterTyper = null;
function resetLetter() {
  if (letterTyper) letterTyper.skip();
  $("#btn-read").classList.remove("hidden");
  $("#btn-read").style.display = "";
  $("#paper").classList.remove("show");
  $("#letter-text").textContent = "";
  $("#letter-sign").classList.add("hidden");
  $("#btn-to-final").classList.add("hidden");
  $("#skip-hint").style.display = "";
}

function readLetter() {
  $("#btn-read").style.display = "none";
  $("#letter-greeting").textContent = fill(CONFIG.letterGreeting);
  $("#letter-sign").textContent = fill(CONFIG.letterSignature);
  $("#paper").classList.add("show");
  setTimeout(() => {
    letterTyper = typeText($("#letter-text"), fill(CONFIG.letter), SPEED.letter);
    letterTyper.then(() => {
      $("#letter-sign").classList.remove("hidden");
      $("#skip-hint").style.display = "none";
      setTimeout(() => $("#btn-to-final").classList.remove("hidden"), REDUCED ? 0 : 900);
    });
  }, REDUCED ? 0 : 700);
}

/* ==========================================================
   10) Screen 6 — final surprise + heart-shaped confetti
   ========================================================== */
const cCanvas = $("#confetti");
const cctx = cCanvas.getContext("2d");
let DPR = 1, bits = [], confettiRaf = null;

function sizeConfetti() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  cCanvas.width = window.innerWidth * DPR;
  cCanvas.height = window.innerHeight * DPR;
}

function drawBit(p, alpha) {
  cctx.save();
  cctx.globalAlpha = alpha;
  cctx.translate(p.x * DPR, p.y * DPR);
  cctx.rotate(p.rot);
  const k = (p.size * DPR) / 32;
  cctx.scale(k, k);
  cctx.translate(-16, -14.8);
  cctx.fillStyle = p.color;
  cctx.shadowColor = p.color;
  cctx.shadowBlur = 12;
  cctx.fill(HEART_PATH);
  cctx.restore();
}

function launchConfetti() {
  const w = window.innerWidth, h = window.innerHeight;
  const cx = w / 2, cy = h * 0.46;
  const unit = Math.min(w, h) * 0.025;
  const drag = 0.93;
  const count = REDUCED ? 70 : 240;
  const palette = ["#ff4d8d", "#ff85b3", "#ffc2da", "#ffffff", "#b3123f", "#c084fc", "#7a3fc4"];
  const fresh = [];

  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const outline = i < count * 0.55;
    const r = outline ? rand(0.96, 1.04) : rand(0.15, 0.95);
    const fx = hx * unit * r;
    const fy = -(hy + 2.5) * unit * r;
    fresh.push({
      x: REDUCED ? cx + fx : cx, y: REDUCED ? cy + fy : cy,
      vx: fx * (1 - drag), vy: fy * (1 - drag),
      size: rand(10, 24), color: pick(palette),
      rot: rand(-0.5, 0.5), spin: rand(-0.04, 0.04),
      life: 0, max: rand(210, 290)
    });
  }

  if (REDUCED) {
    cctx.clearRect(0, 0, cCanvas.width, cCanvas.height);
    fresh.forEach((p) => drawBit(p, 0.95));
    setTimeout(() => cctx.clearRect(0, 0, cCanvas.width, cCanvas.height), 2600);
    return;
  }

  bits = bits.concat(fresh);
  if (!confettiRaf) confettiRaf = requestAnimationFrame(confettiLoop);
}

function confettiLoop() {
  cctx.clearRect(0, 0, cCanvas.width, cCanvas.height);
  bits = bits.filter((p) => p.life < p.max && p.y < window.innerHeight + 40);
  bits.forEach((p) => {
    const d = p.life < 70 ? 0.93 : 0.97;
    p.vx *= d; p.vy *= d;
    if (p.life >= 70) p.vy += 0.09;
    p.x += p.vx; p.y += p.vy;
    p.rot += p.spin;
    p.life++;
    drawBit(p, Math.min(1, (p.max - p.life) / 45));
  });
  if (bits.length) {
    confettiRaf = requestAnimationFrame(confettiLoop);
  } else {
    confettiRaf = null;
    cctx.clearRect(0, 0, cCanvas.width, cCanvas.height);
  }
}

/* ==========================================================
   11) Music (optional, starts only when she presses the button)
   ========================================================== */
const audio = $("#music");
const musicBtn = $("#music-btn");

function setMusicUI(on) {
  musicBtn.setAttribute("aria-pressed", on ? "true" : "false");
  musicBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
  $("#music-label").textContent = on ? "Music on" : "Music off";
}

musicBtn.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
      setMusicUI(true);
    } catch (err) {
      setMusicUI(false);
      toast("Add a file named music.mp3 next to index.html to enable music 🎵");
    }
  } else {
    audio.pause();
    setMusicUI(false);
  }
});
audio.addEventListener("error", () => setMusicUI(false));

/* ==========================================================
   12) Screen entry hooks + button wiring
   ========================================================== */
const enter = {
  "name-screen": animateName,
  "message-screen": startMessage,
  "memories-screen": () => { buildCollage(); showPhoto(photoIndex); },
  "letter-screen": resetLetter,
  "final-screen": () => {
    if (REDUCED) return;
    for (let i = 0; i < 18; i++) setTimeout(spawnHeart, i * 120);
  }
};

$("#btn-open").addEventListener("click", () => {
  document.body.classList.add("opened");
  goTo("name-screen");
});
$("#btn-to-message").addEventListener("click", () => goTo("message-screen"));
$("#btn-to-memories").addEventListener("click", () => goTo("memories-screen"));
$("#btn-to-letter").addEventListener("click", () => goTo("letter-screen"));
$("#btn-read").addEventListener("click", readLetter);
$("#btn-to-final").addEventListener("click", () => goTo("final-screen"));
$("#btn-confetti").addEventListener("click", launchConfetti);
$("#btn-replay").addEventListener("click", () => goTo("intro"));
$("#prev").addEventListener("click", () => showPhoto(photoIndex - 1));
$("#next").addEventListener("click", () => showPhoto(photoIndex + 1));

// Tap the letter to reveal all of it immediately
$("#paper").addEventListener("click", () => { if (letterTyper) letterTyper.skip(); });

// Keyboard: arrow keys flip photos on the memories screen
document.addEventListener("keydown", (e) => {
  if (current !== "memories-screen") return;
  if (e.key === "ArrowLeft") showPhoto(photoIndex - 1);
  if (e.key === "ArrowRight") showPhoto(photoIndex + 1);
});

/* ==========================================================
   13) Start
   ========================================================== */
function init() {
  document.title = "Happy Birthday, " + CONFIG.name + " ❤️";
  $$("[data-name]").forEach((el) => { el.textContent = CONFIG.name; });
  $("#final-title").textContent = CONFIG.finalTitle;
  $("#final-sub").textContent = CONFIG.finalSubtitle;

  sizeMatrix();
  sizeConfetti();
  buildAmbient();
  if (!REDUCED) requestAnimationFrame(drawMatrix);

  window.addEventListener("resize", () => { sizeMatrix(); sizeConfetti(); });
}
init();
