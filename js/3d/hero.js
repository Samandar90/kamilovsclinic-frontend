/**
 * hero.js — живая 3D-сцена первого экрана.
 *
 * Три светящиеся арки с врачами стоят в объёме: сцену можно «повернуть» мышью,
 * а на телефоне она поворачивается при прокрутке. За арками настоящее небо:
 * облака, звёзды, луна с кратерами, солнце. Время суток приходит из KC.sky
 * (js/kc-sky.js), поэтому ползунок времени управляет и этой сценой.
 *
 * Сцена собрана по разметке: размеры и места арок читаются из той же вёрстки,
 * что видна без 3D, цвета — из CSS-переменных. Первый кадр совпадает с плоской
 * версией, поэтому переход к объёму незаметен: арки просто «оживают».
 * Единица измерения сцены — CSS-пиксель, ось y направлена вверх от линии,
 * на которой стоят арки.
 *
 * Если что-то пошло не так (нет WebGL, потеряна видеокарта), остаётся
 * CSS-версия первого экрана: её рисует js/kc-sky.js.
 */
import {
  Scene, PerspectiveCamera, WebGLRenderer, Mesh, Group, Points,
  BufferGeometry, Float32BufferAttribute, PlaneGeometry, Shape, ExtrudeGeometry, TubeGeometry,
  CurvePath, LineCurve3, CubicBezierCurve3, ShaderMaterial, Texture, Vector2, Vector3, Vector4,
  AdditiveBlending, FrontSide, LinearSRGBColorSpace, NoColorSpace, NoToneMapping,
  LinearMipmapLinearFilter, LinearFilter,
} from "../vendor/three.kc.min.js";

const CAM_D = 1500; // расстояние от камеры до плоскости центральной арки
const SIDE_Z = -130; // боковые арки стоят глубже
const REST_YAW = 0.115; // поворот сцены в покое, радианы
const MAX_PIXELS = 3.4e6; // больше точек холст не рисует: дальше растёт только нагрузка

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
/** Сколько точек холста приходится на точку вёрстки: не больше полутора и не больше MAX_PIXELS на весь холст. */
const density = (w, h) => Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(MAX_PIXELS / (w * h)));
const hex3 = (hex) => {
  const n = parseInt(hex.trim().slice(1), 16);
  return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

/* ---------- Шейдеры ---------- */

const NOISE = /* glsl */ `
float hash21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + vec2(17.3, 9.1); a *= 0.5; }
  return s;
}`;

const VERT_SCREEN = /* glsl */ `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const FRAG_SKY = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime, uStars, uBase, uOrbR, uSun, uMoon, uDay, uWarm, uIntro, uGlow, uAspect;
uniform vec3 uA, uB, uC;
uniform vec2 uOrb, uPar;
uniform vec4 uShoot;
uniform vec3 uPoolX, uPoolW, uPool0, uPool1, uPool2;
${NOISE}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 col;
  if (uv.y < uBase) {
    // Под линией арок: тёмная поверхность с пятнами света. Её размывает панель со шкалой.
    col = vec3(0.035, 0.122, 0.220);
    float fall = exp(-(uBase - uv.y) / 0.075) * uGlow * 0.6;
    vec3 dx = (vec3(uv.x) - uPoolX) / uPoolW;
    vec3 pool = exp(-dx * dx * 2.4) * fall;
    col += uPool0 * pool.x + uPool1 * pool.y + uPool2 * pool.z;
  } else {
    float v = 1.0 - uv.y;
    col = v < 0.62 ? mix(uA, uB, v / 0.62) : mix(uB, uC, (v - 0.62) / 0.38);
    vec2 p = vec2(uv.x * uAspect, uv.y);
    vec2 par = uPar * vec2(uAspect, 1.0);

    // Зарево у горизонта справа, где стоят арки. Слева текст: там небо остаётся тёмным.
    float hx = smoothstep(0.28, 0.80, uv.x);
    float hy = exp(-pow((uv.y - uBase) / 0.22, 2.0));
    col = mix(col, uC, hx * hy * 0.55 * uIntro);

    // Звёзды
    if (uStars > 0.01) {
      vec2 sp = (p + par) * 36.0;
      vec2 id = floor(sp);
      float h = hash21(id);
      if (h > 0.84) {
        vec2 o = vec2(hash21(id + 3.1), hash21(id + 7.7)) - 0.5;
        float size = mix(0.03, 0.085, hash21(id + 1.3));
        float tw = 0.62 + 0.38 * sin(uTime * (0.8 + 2.6 * hash21(id + 5.5)) + h * 40.0);
        float s = smoothstep(size, 0.0, length(fract(sp) - 0.5 - o * 0.7)) * tw;
        col += s * uStars * smoothstep(uBase, uBase + 0.2, uv.y) * vec3(0.92, 0.96, 1.0);
      }
      // Падающая звезда
      if (uShoot.z >= 0.0) {
        vec2 dir = normalize(vec2(-0.86, -0.5));
        vec2 head = uShoot.xy + dir * uShoot.z * uShoot.w;
        vec2 q = p - head;
        float tail = 0.11;
        float along = clamp(dot(q, -dir), 0.0, tail);
        float dist = length(q + dir * along);
        float streak = smoothstep(0.0035, 0.0, dist) * (1.0 - along / tail) * sin(uShoot.z * 3.1416);
        col += streak * uStars * vec3(1.0, 0.97, 0.9);
      }
    }

    // Облака: плывут полосой над горизонтом, на заре окрашиваются
    float bandY = smoothstep(uBase - 0.02, uBase + 0.16, uv.y) * (1.0 - smoothstep(uBase + 0.36, uBase + 0.74, uv.y));
    float w = bandY * mix(0.14, 1.0, smoothstep(0.30, 0.66, uv.x)) * uIntro;
    if (w > 0.003) {
      vec2 cp = (p + par * 0.8) * vec2(1.3, 4.2) + vec2(uTime * 0.012, 7.0);
      float n = fbm(cp) * 0.72 + fbm(cp * 2.6 + 31.0) * 0.28;
      float cov = smoothstep(0.46, 0.72, n);
      vec3 night = col + vec3(0.045, 0.055, 0.085);
      vec3 day = mix(col, vec3(1.0), 0.62);
      vec3 dawn = mix(uC, vec3(1.0, 0.92, 0.84), 0.38);
      vec3 lit = mix(mix(night, day, uDay), dawn, uWarm);
      col = mix(col, lit, cov * w * mix(0.55, 0.78, max(uWarm, uDay)));
    }

    // Солнце и луна
    vec2 od = (uv - uOrb) * vec2(uAspect, 1.0);
    float r = length(od);
    if (uSun > 0.003) {
      float halo = exp(-r / (uOrbR * 2.4)) * 0.5 + exp(-r / (uOrbR * 8.0)) * 0.2;
      col += vec3(1.0, 0.86, 0.62) * halo * uSun;
      col = mix(col, vec3(1.0, 0.975, 0.91), smoothstep(uOrbR, uOrbR * 0.9, r) * uSun);
    }
    if (uMoon > 0.003) {
      col += vec3(0.78, 0.87, 1.0) * (exp(-r / (uOrbR * 2.2)) * 0.26 + exp(-r / (uOrbR * 7.0)) * 0.09) * uMoon;
      if (r < uOrbR) {
        // Луна — шар: свет падает сбоку, поверхность в «морях» и кратерах
        vec2 q = od / uOrbR;
        vec3 n = vec3(q, sqrt(max(0.0, 1.0 - dot(q, q))));
        float maria = smoothstep(0.42, 0.70, fbm(q * 1.7 + 4.0));
        float crater = fbm(q * 5.0 + 11.0);
        float diff = clamp(dot(n, normalize(vec3(-0.5, 0.42, 0.76))), 0.0, 1.0);
        vec3 m = mix(vec3(0.99, 1.0, 1.0), vec3(0.72, 0.79, 0.88), maria * 0.6) * (0.46 + 0.66 * diff) * (0.92 + 0.16 * crater);
        col = mix(col, m, smoothstep(1.0, 0.94, length(q)) * uMoon);
      }
    }

    // Слева небо плотнее: белый текст читается в любое время суток
    col = mix(col, vec3(0.020, 0.059, 0.125), 0.34 * (1.0 - smoothstep(0.0, 0.62, uv.x)));
  }
  // Лёгкий шум убирает полосы на плавных переходах цвета
  col += (hash21(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}`;

const VERT_UV = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const VERT_SLAB = /* glsl */ `
varying vec3 vP;
varying vec3 vN;
varying vec3 vNo;
void main() {
  vP = position;
  vNo = normal;
  vN = normalMatrix * normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const FRAG_SLAB = /* glsl */ `
precision highp float;
varying vec3 vP;
varying vec3 vN;
varying vec3 vNo;
uniform vec3 uT1, uT2, uGlowCol;
uniform vec2 uSize;
uniform float uYaw, uIntro, uOpacity;
void main() {
  float ty = clamp(vP.y / uSize.y, 0.0, 1.0);
  vec3 base = mix(uT2, uT1, ty);
  vec3 col;
  if (vNo.z > 0.85) {
    // Лицевая грань: светящееся стекло
    col = base;
    // Решётка-панджара под сводом
    float cell = uSize.x / 6.0;
    vec2 g = vP.xy / cell;
    vec2 a = abs(fract(g) - 0.5);
    vec2 b = abs(fract(vec2(g.x + g.y, g.x - g.y) * 0.5) - 0.5);
    float px = 1.4 / cell;
    float line = max(1.0 - smoothstep(0.0, px, min(a.x, a.y)), 1.0 - smoothstep(0.0, px, min(b.x, b.y) * 1.414));
    col = mix(col, vec3(1.0), line * smoothstep(0.60, 0.92, ty) * 0.15 * uIntro);
    // Блик: полоса света уходит по стеклу, когда сцена поворачивается
    float band = (vP.x / uSize.x + 0.5) * 0.85 + ty * 0.5 - uYaw * 3.2 - 0.45;
    float glint = smoothstep(0.0, 0.07, band) * (1.0 - smoothstep(0.10, 0.20, band));
    glint += 0.5 * smoothstep(0.26, 0.29, band) * (1.0 - smoothstep(0.30, 0.34, band));
    col += glint * 0.13 * uIntro;
  } else {
    // Фаска и торец: свет падает сверху слева
    float l = max(dot(normalize(vN), normalize(vec3(-0.5, 0.62, 0.6))), 0.0);
    float side = 1.0 - smoothstep(0.0, 0.6, vNo.z);
    col = base * mix(0.95, 0.46, side) * (0.70 + 0.62 * l);
    col += uGlowCol * 0.08 * (1.0 - side);
  }
  gl_FragColor = vec4(col * uOpacity, uOpacity);
}`;

const VERT_PLAIN = /* glsl */ `void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const FRAG_FLAT = /* glsl */ `
precision highp float;
uniform vec3 uCol;
uniform float uOpacity;
void main() { gl_FragColor = vec4(uCol * uOpacity, uOpacity); }`;

const FRAG_HALO = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec3 uCol;
uniform float uOpacity;
void main() {
  float a = max(0.0, 1.0 - length(vUv - 0.5) * 2.0) * uOpacity;
  gl_FragColor = vec4(uCol * a, a);
}`;

const FRAG_DOC = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uMap;
uniform vec3 uGrade;
uniform float uOpacity;
void main() {
  vec4 t = texture2D(uMap, vUv);
  gl_FragColor = vec4(t.rgb * uGrade, t.a) * uOpacity;
}`;

const VERT_DUST = /* glsl */ `
attribute vec4 aSeed;
uniform float uTime, uDpr, uCamD;
uniform vec3 uRange;
varying float vA;
void main() {
  vec3 p = position;
  p.y = mod(position.y + uTime * (6.0 + aSeed.x * 12.0), uRange.y);
  p.x += sin(uTime * (0.2 + aSeed.y * 0.4) + aSeed.z * 6.283) * 16.0;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (2.5 + aSeed.w * 8.0) * uDpr * uCamD / max(1.0, -mv.z);
  float life = p.y / uRange.y;
  vA = (0.25 + 0.75 * aSeed.x) * smoothstep(0.0, 0.12, life) * (1.0 - smoothstep(0.7, 1.0, life)) * (0.6 + 0.4 * sin(uTime * (0.6 + aSeed.z) + aSeed.w * 9.0));
}`;

const FRAG_DUST = /* glsl */ `
precision highp float;
uniform vec3 uCol;
uniform float uOpacity;
varying float vA;
void main() {
  float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
  gl_FragColor = vec4(uCol * a * a * vA * uOpacity, 0.0);
}`;

/* ---------- Геометрия арки: тот же контур, что в css/kc-tokens.css (--arch) ---------- */

function slabGeometry(w, h, depth, bevel) {
  const X = (u) => (u / 100 - 0.5) * w;
  const Y = (v) => (1 - v / 140) * h;
  const below = -30; // плита уходит под панель со шкалой: нижняя фаска не видна
  const s = new Shape();
  s.moveTo(X(0), below);
  s.lineTo(X(0), Y(48));
  s.bezierCurveTo(X(0), Y(28), X(20), Y(11), X(47), Y(1.3));
  s.bezierCurveTo(X(49), Y(0.6), X(51), Y(0.6), X(53), Y(1.3));
  s.bezierCurveTo(X(80), Y(11), X(100), Y(28), X(100), Y(48));
  s.lineTo(X(100), below);
  s.lineTo(X(0), below);
  const g = new ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: -bevel, // силуэт плиты совпадает с контуром, лицевая грань чуть меньше
    bevelSegments: 3,
    curveSegments: 28,
    steps: 1,
  });
  g.translate(0, 0, -(depth + bevel)); // лицевая грань в плоскости z = 0
  return g;
}

/** Тонкая светящаяся линия вокруг арки (--arch-line): справа не доходит до низа. */
function outlineGeometry(w, h, radius) {
  const P = (u, v) => new Vector3((u / 100 - 0.5) * w, (1 - v / 140) * h, 0);
  const path = new CurvePath();
  path.add(new LineCurve3(P(0.5, 140), P(0.5, 48)));
  path.add(new CubicBezierCurve3(P(0.5, 48), P(0.5, 28.3), P(20.3, 11.5), P(47.2, 1.8)));
  path.add(new CubicBezierCurve3(P(47.2, 1.8), P(49, 1.1), P(51, 1.1), P(52.8, 1.8)));
  path.add(new CubicBezierCurve3(P(52.8, 1.8), P(79.7, 11.5), P(99.5, 28.3), P(99.5, 48)));
  path.add(new LineCurve3(P(99.5, 48), P(99.5, 116)));
  return new TubeGeometry(path, 110, radius, 5, false);
}

function dustGeometry(count, range, zFrom, zTo) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * range.x;
    pos[i * 3 + 1] = Math.random() * range.y;
    pos[i * 3 + 2] = zFrom + Math.random() * (zTo - zFrom);
    for (let k = 0; k < 4; k++) seed[i * 4 + k] = Math.random();
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("aSeed", new Float32BufferAttribute(seed, 4));
  return g;
}

/* ---------- Сцена ---------- */

/** Пауза между тяжёлыми шагами запуска: браузер успевает отрисовать кадр и ответить на касание. */
const breathe = () => new Promise((resolve) => setTimeout(resolve, 0));

export async function mountHero(hero, sky) {
  const stage = hero.querySelector(".kc-hero__stage");
  const ground = hero.querySelector(".kc-ground");
  const figures = [].slice.call(hero.querySelectorAll(".kc-arch"));
  if (!stage || !ground || figures.length !== 3) return null;

  // Картинки врачей уже на странице: берём их же, второй раз ничего не качаем.
  const images = figures.map((f) => f.querySelector("img"));
  await Promise.all(images.map((img) => (img.decode ? img.decode().catch(() => {}) : null)));
  if (images.some((img) => !img.naturalWidth)) return null;

  const canvas = document.createElement("canvas");
  canvas.className = "kc-hero__gl";
  canvas.setAttribute("aria-hidden", "true");

  // Холст сразу получает рабочий размер: менять его потом — значит заново выделять память видеокарты
  const box = hero.getBoundingClientRect();
  const first = density(Math.max(1, box.width), Math.max(1, box.height));
  canvas.width = Math.round(Math.max(1, box.width) * first);
  canvas.height = Math.round(Math.max(1, box.height) * first);

  // Нужна настоящая видеокарта: на программной отрисовке сцена шла бы рывками
  const attributes = { antialias: true, alpha: false, depth: false, stencil: false, powerPreference: "high-performance" };
  const gl = canvas.getContext("webgl2", { ...attributes, failIfMajorPerformanceCaveat: true });
  if (!gl) return null;
  await breathe();
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, context: gl, ...attributes });
  } catch (e) {
    return null;
  }
  await breathe();
  // Цвета в сцене заданы так же, как в CSS, и выводятся на экран без преобразований.
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.toneMapping = NoToneMapping;
  let shaderFailed = false;
  renderer.debug.onShaderError = () => {
    shaderFailed = true;
  };
  const maxAniso = Math.min(4, renderer.capabilities.getMaxAnisotropy());

  const scene = new Scene();
  const camera = new PerspectiveCamera();
  camera.matrixAutoUpdate = true;

  const flat = { transparent: true, premultipliedAlpha: true, depthTest: false, depthWrite: false };

  /* Небо */
  const uSky = {
    uRes: { value: new Vector2(1, 1) },
    uTime: { value: 0 }, uStars: { value: 1 }, uBase: { value: 0.1 }, uOrbR: { value: 0.04 },
    uSun: { value: 0 }, uMoon: { value: 1 }, uDay: { value: 0 }, uWarm: { value: 0 },
    uIntro: { value: 0 }, uGlow: { value: 1 }, uAspect: { value: 1.6 },
    uA: { value: new Vector3() }, uB: { value: new Vector3() }, uC: { value: new Vector3() },
    uOrb: { value: new Vector2(0.7, 0.8) }, uPar: { value: new Vector2() },
    uShoot: { value: new Vector4(0, 0, -1, 0.5) },
    uPoolX: { value: new Vector3() }, uPoolW: { value: new Vector3(1, 1, 1) },
    uPool0: { value: new Vector3() }, uPool1: { value: new Vector3() }, uPool2: { value: new Vector3() },
  };
  const screen = new BufferGeometry();
  screen.setAttribute("position", new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const skyMesh = new Mesh(screen, new ShaderMaterial({ uniforms: uSky, vertexShader: VERT_SCREEN, fragmentShader: FRAG_SKY, depthTest: false, depthWrite: false }));
  skyMesh.frustumCulled = false;
  skyMesh.renderOrder = -10;
  scene.add(skyMesh);

  /* Арки */
  const world = new Group(); // поворачивается целиком вокруг вертикальной оси
  scene.add(world);
  const plane = new PlaneGeometry(1, 1);
  const standing = new PlaneGeometry(1, 1);
  standing.translate(0, 0.5, 0); // низ картинки на линии арок

  const arches = figures.map((fig, i) => {
    const cs = getComputedStyle(fig);
    const t1 = hex3(cs.getPropertyValue("--t1"));
    const t2 = hex3(cs.getPropertyValue("--t2"));
    const glow = hex3(cs.getPropertyValue("--t-glow"));
    const center = fig.classList.contains("kc-arch--center");
    const order = center ? 30 : 10 + i * 4;

    const halo = new Mesh(plane, new ShaderMaterial({ ...flat, uniforms: { uCol: { value: glow }, uOpacity: { value: 0.5 } }, vertexShader: VERT_UV, fragmentShader: FRAG_HALO }));
    halo.renderOrder = 1 + i;

    const slab = new Mesh(new BufferGeometry(), new ShaderMaterial({
      ...flat, side: FrontSide, vertexShader: VERT_SLAB, fragmentShader: FRAG_SLAB,
      uniforms: { uT1: { value: t1 }, uT2: { value: t2 }, uGlowCol: { value: glow }, uSize: { value: new Vector2(1, 1) }, uYaw: { value: 0 }, uIntro: { value: 0 }, uOpacity: { value: 1 } },
    }));
    slab.renderOrder = order;

    const line = new Mesh(new BufferGeometry(), new ShaderMaterial({ ...flat, side: FrontSide, uniforms: { uCol: { value: glow }, uOpacity: { value: 0.75 } }, vertexShader: VERT_PLAIN, fragmentShader: FRAG_FLAT }));
    line.renderOrder = order + 1;

    const tex = new Texture(images[i]);
    tex.colorSpace = NoColorSpace;
    tex.premultiplyAlpha = true;
    tex.minFilter = LinearMipmapLinearFilter;
    tex.magFilter = LinearFilter;
    tex.anisotropy = maxAniso;
    tex.needsUpdate = true;
    const doctor = new Mesh(standing, new ShaderMaterial({ ...flat, uniforms: { uMap: { value: tex }, uGrade: { value: new Vector3(1, 1, 1) }, uOpacity: { value: 1 } }, vertexShader: VERT_UV, fragmentShader: FRAG_DOC }));
    doctor.renderOrder = order + 2;
    const pivot = new Group(); // врач поворачивается слабее арки: плоская фигура не выдаёт себя
    pivot.add(doctor);

    const group = new Group();
    group.add(halo, slab, line, pivot);
    world.add(group);
    return { fig, center, glow, group, halo, slab, line, doctor, pivot, image: images[i] };
  });

  /* Пылинки в свете окон: дальние за арками, ближние перед ними */
  const uDust = {
    uTime: uSky.uTime, uDpr: { value: 1 }, uCamD: { value: CAM_D }, uRange: { value: new Vector3(1, 1, 1) },
    uCol: { value: new Vector3(1.0, 0.86, 0.62) }, uOpacity: { value: 0 },
  };
  const dustMaterial = new ShaderMaterial({ uniforms: uDust, vertexShader: VERT_DUST, fragmentShader: FRAG_DUST, transparent: true, premultipliedAlpha: true, blending: AdditiveBlending, depthTest: false, depthWrite: false });
  const dustBack = new Points(new BufferGeometry(), dustMaterial);
  dustBack.renderOrder = 5;
  const dustFront = new Points(new BufferGeometry(), dustMaterial);
  dustFront.renderOrder = 50;
  dustBack.frustumCulled = dustFront.frustumCulled = false;
  world.add(dustBack, dustFront);

  /* ---------- Размеры: всё берётся из вёрстки ---------- */
  const L = { W: 1, H: 1 };
  let dpr = 1;
  const stripSolid = () => !window.matchMedia("(hover: hover) and (min-width: 1000px)").matches;

  /** Всё, от чего зависит расстановка сцены: по этой строке видно, изменилась ли вёрстка. */
  const measure = () => {
    const hr = hero.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    return [hr.width, hr.height, sr.left - hr.left, sr.top - hr.top, sr.width, sr.height, window.devicePixelRatio, stripSolid()]
      .concat(figures.map((f) => f.offsetLeft + "x" + f.offsetWidth + "x" + f.offsetHeight))
      .join();
  };
  let layoutKey = "";

  /** Расстановка целиком. При запуске её части выполняются по отдельности, с паузами. */
  function layout() {
    layoutFrame();
    arches.forEach(placeArch);
    placeDust();
  }

  function layoutFrame() {
    layoutKey = measure();
    const hr = hero.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    L.W = Math.max(1, hr.width);
    L.H = Math.max(1, hr.height);
    L.sx = sr.left - hr.left;
    L.sy = sr.top - hr.top;
    L.sw = sr.width;
    L.sh = sr.height;
    L.base = L.sy + L.sh; // линия, на которой стоят арки, от верха первого экрана
    L.mid = L.sx + L.sw / 2; // ось поворота сцены
    L.turn = clamp((L.sw - 320) / 260, 0.3, 1); // на узком экране арки стоят у самых краёв: поворот меньше
    L.strip = stripSolid() ? Math.max(0, L.H - L.base) : 0;

    // Размер холста задаётся сразу в его точках (плотность движка остаётся единицей)
    dpr = density(L.W, L.H) * quality;
    const pw = Math.round(L.W * dpr);
    const ph = Math.round(L.H * dpr);
    if (canvas.width !== pw || canvas.height !== ph) renderer.setSize(pw, ph, false);
    // Под непрозрачной панелью рисовать нечего
    const cut = Math.round(L.strip * dpr);
    renderer.setScissorTest(cut > 0);
    if (cut > 0) renderer.setScissor(0, cut, pw, ph - cut);

    uSky.uRes.value.set(canvas.width, canvas.height);
    uSky.uAspect.value = L.W / L.H;
    uSky.uBase.value = 1 - L.base / L.H;
    uDust.uDpr.value = dpr;
  }

  function placeArch(a, i) {
    const z = a.center ? 0 : SIDE_Z;
    const s = (CAM_D - z) / CAM_D; // дальние предметы крупнее ровно настолько, чтобы на экране совпасть с вёрсткой
    const w = a.fig.offsetWidth * s;
    const h = a.fig.offsetHeight * s;
    const x = (L.sx + a.fig.offsetLeft + a.fig.offsetWidth / 2 - L.mid) * s;
    const depth = Math.round(w * 0.2);
    a.group.position.set(x, 0, z);

    a.slab.geometry.dispose();
    a.slab.geometry = slabGeometry(w, h, depth, Math.max(3, w * 0.02));
    a.slab.material.uniforms.uSize.value.set(w, h);

    a.line.geometry.dispose();
    a.line.geometry = outlineGeometry(w + 18 * s, h + 9 * s, 1.15 * s);

    a.halo.scale.set(w * 1.52, h * 1.24, 1);
    a.halo.position.set(0, h * 0.56, -depth - 40);
    a.haloBase = [w * 1.52, h * 1.24];

    const dh = h * 0.84;
    a.doctor.scale.set(dh * (a.image.naturalWidth / a.image.naturalHeight), dh, 1);
    a.pivot.position.set(0, 0, w * 0.06 + 4);

    const cx = (L.sx + a.fig.offsetLeft + a.fig.offsetWidth / 2) / L.W;
    uSky.uPoolX.value.setComponent(i, cx);
    uSky.uPoolW.value.setComponent(i, (a.fig.offsetWidth / L.W) * 0.7);
    uSky["uPool" + i].value.copy(a.glow);
  }

  function placeDust() {
    const range = new Vector3(L.sw * 1.3, L.sh * 1.05, 1);
    uDust.uRange.value.copy(range);
    const count = L.W < 700 ? 26 : 44;
    dustBack.geometry.dispose();
    dustBack.geometry = dustGeometry(count, range, -420, -180);
    dustFront.geometry.dispose();
    dustFront.geometry = dustGeometry(Math.round(count * 0.6), range, 30, 260);
  }

  /** Камера смотрит прямо на арки. Плоскость центральной арки ложится на экран пиксель в пиксель. */
  function setCamera(dx, dy) {
    const near = 20;
    const k = near / CAM_D;
    camera.position.set(dx, dy, CAM_D);
    camera.projectionMatrix.makePerspective((-L.mid - dx) * k, (L.W - L.mid - dx) * k, (L.base - dy) * k, (L.base - L.H - dy) * k, near, 30000);
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  }

  /* ---------- Движение ---------- */
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const pointer = { x: 0, y: 0 };
  let quality = 1;
  let yaw = 0;
  let camX = 0;
  let camY = 0;
  let intro = 0;
  let clock = 0;
  let manual = null;
  let lastInput = -1e9;
  let shootAt = 6 + Math.random() * 6;
  let shootFrom = null;

  function update(dt) {
    const m = manual || {};
    clock = m.clock !== undefined ? m.clock : clock + dt;
    intro = m.intro !== undefined ? m.intro : Math.min(1, intro + dt / 1.8);
    const ease = 1 - Math.pow(1 - intro, 3);
    const px = m.px !== undefined ? m.px : pointer.x;
    const py = m.py !== undefined ? m.py : pointer.y;
    const scroll = m.scroll !== undefined ? m.scroll : clamp(window.scrollY / L.H, 0, 1.2);

    // Сцена чуть покачивается сама, следует за мышью и поворачивается при прокрутке
    const sway = Math.sin(clock * 0.37) * 0.022 + Math.sin(clock * 0.19) * 0.012;
    const yawTo = (REST_YAW * L.turn + sway * (fine ? 1 : 1.8) * Math.sqrt(L.turn)) * ease - px * 0.15 - scroll * 0.24;
    const follow = manual ? 1 : 1 - Math.exp(-dt * 4.5);
    yaw += (yawTo - yaw) * follow;
    camX += (-px * 34 - camX) * follow;
    camY += (-py * 12 + scroll * 70 - camY) * follow;
    world.rotation.y = yaw;
    setCamera(camX, camY);

    const st = sky.state(m.minutes !== undefined ? m.minutes : sky.minutes);
    uSky.uTime.value = clock;
    uSky.uIntro.value = ease;
    uSky.uA.value.set(st.top[0] / 255, st.top[1] / 255, st.top[2] / 255);
    uSky.uB.value.set(st.mid[0] / 255, st.mid[1] / 255, st.mid[2] / 255);
    uSky.uC.value.set(st.low[0] / 255, st.low[1] / 255, st.low[2] / 255);
    uSky.uStars.value = st.stars;
    uSky.uGlow.value = st.glow;
    uSky.uDay.value = 1 - st.stars;
    uSky.uWarm.value = clamp(((st.low[0] - st.low[2]) / 255) * 1.6, 0, 1);
    uSky.uSun.value = st.day ? st.rise : 0;
    uSky.uMoon.value = st.day ? 0 : st.rise;
    // Дальние слои смещаются вместе с камерой: звёзды целиком, светило чуть меньше
    uSky.uPar.value.set(-camX / L.W, -camY / L.H);
    const ox = L.sx + L.sw * (0.04 + 0.92 * st.path) + camX * 0.72;
    const oy = L.sy + L.sh * (-0.02 + 0.34 * (1 - Math.sin(st.path * Math.PI))) - camY * 0.72;
    uSky.uOrb.value.set(ox / L.W, 1 - oy / L.H);
    uSky.uOrbR.value = clamp(window.innerWidth * 0.054, 44, 76) / 2 / L.H;

    // Падающая звезда: изредка и только ночью
    if (!manual && st.stars > 0.5) {
      if (shootFrom === null && clock > shootAt) shootFrom = clock;
      if (shootFrom !== null) {
        const p = (clock - shootFrom) / 0.9;
        if (p >= 1) {
          shootFrom = null;
          shootAt = clock + 9 + Math.random() * 12;
          uSky.uShoot.value.z = -1;
        } else {
          if (p < 0.02) uSky.uShoot.value.set((0.5 + Math.random() * 0.45) * uSky.uAspect.value, 0.72 + Math.random() * 0.22, 0, 0.3);
          uSky.uShoot.value.z = p;
        }
      }
    } else {
      uSky.uShoot.value.z = -1;
    }

    // Ночью врачей освещают только окна, днём — небо
    const night = st.stars;
    const warm = uSky.uWarm.value;
    arches.forEach((a, i) => {
      const u = a.slab.material.uniforms;
      u.uYaw.value = yaw;
      u.uIntro.value = ease;
      a.pivot.rotation.y = -yaw * 0.6;
      a.doctor.material.uniforms.uGrade.value.set(1 - night * 0.1 + warm * 0.03, 1 - night * 0.07, 1 - night * 0.01 - warm * 0.05);
      const breath = 1 + 0.06 * (0.5 + 0.5 * Math.sin(clock * 0.9 + i * 1.7));
      a.halo.scale.set(a.haloBase[0] * breath, a.haloBase[1] * breath, 1);
      a.halo.material.uniforms.uOpacity.value = st.glow * 0.5;
    });
    uDust.uOpacity.value = (0.18 + st.glow * 0.5) * ease;
  }

  function draw() {
    renderer.render(scene, camera);
  }

  /* ---------- Цикл отрисовки ---------- */
  let raf = 0;
  let running = false;
  let visible = true;
  let last = 0;
  let slow = 0;
  let frames = 0;

  function frame(ts) {
    raf = requestAnimationFrame(frame);
    const gap = ts - last;
    const busy = ts - lastInput < 2500 || intro < 1;
    // Пока ничего не происходит, хватает 30 кадров в секунду: облака плывут медленно
    if (!busy && gap < 31) return;
    last = ts;
    update(Math.min(0.05, gap / 1000));
    draw();

    // Если устройство не успевает, уменьшаем число точек, а не плавность
    if (busy && gap < 200) {
      frames++;
      if (gap > 27) slow++;
      if (frames >= 50) {
        if (slow > 30 && quality > 0.55) {
          quality -= 0.2;
          layout();
        }
        frames = slow = 0;
      }
    }
  }

  function setRunning(on) {
    if (on === running) return;
    running = on;
    cancelAnimationFrame(raf);
    if (on) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }
  const sync = () => setRunning(visible && !document.hidden && !manual && !dead);

  let dead = false;
  function fallback() {
    // Возвращаем CSS-версию первого экрана
    dead = true;
    setRunning(false);
    hero.classList.remove("is-3d");
    canvas.remove();
    if (sky.restoreCss) sky.restoreCss();
  }

  /* ---------- Запуск: по шагам, чтобы страница не замирала ---------- */
  await breathe();
  hero.insertBefore(canvas, hero.querySelector(".kc-sky").nextSibling);
  layoutFrame();
  await breathe();
  for (let i = 0; i < arches.length; i++) {
    placeArch(arches[i], i);
    await breathe();
    renderer.initTexture(arches[i].doctor.material.uniforms.uMap.value); // портрет уходит в видеокарту
    await breathe();
  }
  placeDust();
  update(0);
  // Сцена «прогревается» по частям: холст ещё невидим, и каждая часть рисуется отдельным шагом,
  // а программы для видеокарты собираются в фоне
  const pieces = [skyMesh, ...arches.map((a) => a.group), dustBack, dustFront];
  pieces.forEach((piece) => {
    piece.visible = false;
  });
  for (const piece of pieces) {
    piece.visible = true;
    try {
      await renderer.compileAsync(piece, camera, scene);
    } catch (e) {
      shaderFailed = true;
    }
    if (shaderFailed || gl.isContextLost()) break;
    draw();
    await breathe();
  }
  if (!shaderFailed && !gl.isContextLost()) {
    if (measure() !== layoutKey) layout(); // пока сцена готовилась, окно могли изменить
    update(0);
    draw();
  }
  if (shaderFailed || gl.isContextLost()) {
    fallback();
    return null;
  }
  // Первый кадр совпадает с плоской версией: её слои можно тихо погасить
  canvas.classList.add("is-on");
  hero.classList.add("is-3d");
  sky.cssOff = true;

  const touch = () => {
    lastInput = performance.now();
  };
  if (fine) {
    hero.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = hero.getBoundingClientRect();
      pointer.x = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
      pointer.y = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
      touch();
    }, { passive: true });
    hero.addEventListener("pointerleave", () => {
      pointer.x = pointer.y = 0;
      touch();
    });
  }
  window.addEventListener("scroll", touch, { passive: true });
  sky.on(touch);

  let resizeQueued = false;
  new ResizeObserver(() => {
    if (resizeQueued || dead) return;
    resizeQueued = true;
    requestAnimationFrame(() => {
      resizeQueued = false;
      if (dead || measure() === layoutKey) return;
      layout();
      if (!running) {
        update(0);
        draw();
      }
    });
  }).observe(hero);

  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    sync();
  }).observe(hero);
  document.addEventListener("visibilitychange", sync);
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    fallback();
  });
  sync();

  return {
    canvas,
    /** Ручное управление для съёмки видео: все параметры кадра задаются снаружи. */
    manual(params) {
      manual = params;
      sync();
      if (manual) {
        update(0);
        draw();
      }
    },
  };
}
