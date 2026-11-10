/**
 * depth.js — объёмная фотография.
 *
 * Обычный снимок кабинета оживает: при движении мыши ближние предметы
 * смещаются сильнее дальних, как будто на комнату смотрят через окно.
 * Для этого рядом со снимком лежит карта глубины (её строит
 * _src/tools/make_depth_maps.py): белое — близко, чёрное — далеко.
 *
 * Разметка: <img src="…" data-kc-depth="карта-глубины.webp">. Холст встаёт
 * поверх картинки и повторяет её кадрирование (object-fit: cover).
 * Движок three.js здесь не нужен: хватает одного небольшого шейдера.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uImg, uDepth;
uniform vec2 uShift;   // сдвиг «камеры» в долях кадра
uniform vec4 uCrop;    // видимая часть снимка: начало и размер
uniform float uZoom;
void main() {
  vec2 uv = (vUv - 0.5) / uZoom + 0.5;
  // Сдвиг зависит от глубины в той точке, куда мы в итоге попадём: уточняем за несколько шагов
  vec2 p = uv;
  for (int i = 0; i < 4; i++) {
    float d = texture2D(uDepth, uCrop.xy + p * uCrop.zw).r - 0.3;
    p = uv - d * uShift;
  }
  gl_FragColor = texture2D(uImg, uCrop.xy + p * uCrop.zw);
}`;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function texture(gl, unit, image) {
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

async function mountOne(img) {
  const depth = await loadImage(img.getAttribute("data-kc-depth"));
  if (img.decode) await img.decode().catch(() => {});
  if (!img.naturalWidth) return;

  const canvas = document.createElement("canvas");
  canvas.className = "kc-depth";
  canvas.setAttribute("aria-hidden", "true");
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power", failIfMajorPerformanceCaveat: true });
  if (!gl) return;

  const program = gl.createProgram();
  for (const [type, source] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]]) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  texture(gl, 0, img);
  texture(gl, 1, depth);
  gl.uniform1i(gl.getUniformLocation(program, "uImg"), 0);
  gl.uniform1i(gl.getUniformLocation(program, "uDepth"), 1);
  gl.uniform1f(gl.getUniformLocation(program, "uZoom"), 1.06); // запас по краям под сдвиг
  const uShift = gl.getUniformLocation(program, "uShift");
  const uCrop = gl.getUniformLocation(program, "uCrop");

  /** Та же обрезка, что у картинки с object-fit: cover. */
  function resize() {
    const r = img.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(2, Math.round(r.width * dpr));
    canvas.height = Math.max(2, Math.round(r.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    const scale = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
    const sx = r.width / (img.naturalWidth * scale);
    const sy = r.height / (img.naturalHeight * scale);
    const pos = getComputedStyle(img).objectPosition.split(" ").map((v) => parseFloat(v) / 100);
    const ox = (1 - sx) * (isNaN(pos[0]) ? 0.5 : pos[0]);
    const oy = (1 - sy) * (isNaN(pos[1]) ? 0.5 : pos[1]);
    gl.uniform4f(uCrop, ox, 1 - oy - sy, sx, sy); // текстура перевёрнута: её начало внизу
  }

  const area = img.closest("a, article, figure, section") || img.parentNode;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let tx = 0;
  let ty = 0;
  let x = 0;
  let y = 0;
  if (fine) {
    area.addEventListener("pointermove", (e) => {
      const r = area.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    }, { passive: true });
    area.addEventListener("pointerleave", () => { tx = ty = 0; });
  }

  let raf = 0;
  let visible = false;
  let last = 0;
  function frame(ts) {
    raf = requestAnimationFrame(frame);
    if (ts - last < 31) return; // 30 кадров в секунду достаточно
    last = ts;
    const t = ts / 1000;
    // Без мыши кадр едва заметно «дышит», на телефоне ещё и следует за прокруткой
    const r = area.getBoundingClientRect();
    const pass = (r.top + r.height / 2) / window.innerHeight - 0.5;
    const toX = tx + Math.sin(t * 0.5) * 0.35;
    const toY = ty + (fine ? Math.cos(t * 0.4) * 0.2 : pass * 2.4);
    x += (toX - x) * 0.07;
    y += (toY - y) * 0.07;
    gl.uniform2f(uShift, x * 0.034, -y * 0.022);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  const sync = () => {
    cancelAnimationFrame(raf);
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  };

  resize();
  gl.uniform2f(uShift, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  img.parentNode.insertBefore(canvas, img.nextSibling);
  img.classList.add("is-depth"); // картинка остаётся для поисковиков и чтения с экрана, но не рисуется

  new ResizeObserver(resize).observe(img);
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    sync();
  }).observe(canvas);
  document.addEventListener("visibilitychange", sync);
  canvas.addEventListener("webglcontextlost", () => {
    cancelAnimationFrame(raf);
    canvas.remove();
    img.classList.remove("is-depth");
  });
}

export function mountDepth(images) {
  return Promise.all(images.map((img) => mountOne(img).catch(() => {})));
}
