/**
 * mark.js — объёмный знак клиники.
 *
 * Крест, сердце и зуб из логотипа собраны как три глянцевые керамические
 * детали, лежащие друг на друге. Знак медленно покачивается, поворачивается
 * за курсором и при прокрутке, его можно покрутить мышью или пальцем.
 *
 * На странице может быть несколько знаков: [data-kc-mark="logo"] — весь знак,
 * [data-kc-mark="tooth"] — только зуб. Все рисует один WebGL-контекст: кадр
 * готовится за экраном и копируется в обычный холст на странице. Так браузеру
 * не нужно держать отдельную видеопамять под каждую картинку.
 *
 * Формы повторяют логотип: зуб взят из фирменного значка (_src/icons.mjs),
 * крест и сердце построены по пропорциям знака.
 */
import {
  Scene, PerspectiveCamera, WebGLRenderer, Mesh, Group, Shape, ExtrudeGeometry, BoxGeometry,
  MeshPhysicalMaterial, MeshBasicMaterial, PMREMGenerator, DirectionalLight, Color, CanvasTexture,
  SRGBColorSpace, NeutralToneMapping, PCFSoftShadowMap, BackSide,
} from "../vendor/three.kc.min.js";

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
/** Пауза между тяжёлыми шагами запуска: браузер успевает отрисовать кадр и ответить на касание. */
const breathe = () => new Promise((resolve) => setTimeout(resolve, 0));

/** Ждёт, пока видеокарта выполнит всё отправленное ей, не останавливая страницу. */
function gpuDone(gl) {
  return new Promise((resolve) => {
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    let tries = 0;
    (function poll() {
      if (gl.clientWaitSync(sync, 0, 0) === gl.TIMEOUT_EXPIRED && tries++ < 120) {
        setTimeout(poll, 16);
        return;
      }
      gl.deleteSync(sync);
      resolve();
    })();
  });
}

/* ---------- Формы (единицы — как в исходном логотипе, y направлена вверх) ---------- */

function crossShape(arm, len) {
  // Плюс со скруглёнными концами: два «стадиона» крест-накрест
  const s = new Shape();
  const c = len - arm;
  s.moveTo(arm, arm);
  s.lineTo(c, arm);
  s.absarc(c, 0, arm, Math.PI / 2, -Math.PI / 2, true);
  s.lineTo(arm, -arm);
  s.lineTo(arm, -c);
  s.absarc(0, -c, arm, 0, -Math.PI, true);
  s.lineTo(-arm, -arm);
  s.lineTo(-c, -arm);
  s.absarc(-c, 0, arm, -Math.PI / 2, -Math.PI * 1.5, true);
  s.lineTo(-arm, arm);
  s.lineTo(-arm, c);
  s.absarc(0, c, arm, Math.PI, 0, true);
  s.lineTo(arm, arm);
  return s;
}

function heartShape(w, h) {
  const X = (v) => (v / 166) * (w / 2);
  const Y = (v) => (v / 150) * (h / 2);
  const s = new Shape();
  s.moveTo(X(0), Y(-150));
  s.bezierCurveTo(X(-60), Y(-95), X(-166), Y(-30), X(-166), Y(55));
  s.bezierCurveTo(X(-166), Y(120), X(-120), Y(150), X(-83), Y(150));
  s.bezierCurveTo(X(-45), Y(150), X(-15), Y(125), X(0), Y(95));
  s.bezierCurveTo(X(15), Y(125), X(45), Y(150), X(83), Y(150));
  s.bezierCurveTo(X(120), Y(150), X(166), Y(120), X(166), Y(55));
  s.bezierCurveTo(X(166), Y(-30), X(60), Y(-95), X(0), Y(-150));
  return s;
}

function toothShape(scale) {
  // Контур из фирменного значка, сетка 64×64, центр в (32, 35)
  const P = (x, y) => [(x - 32) * scale, (35 - y) * scale];
  const curves = [
    [28, 13, 24, 11, 20, 11.5], [13.5, 12, 9.5, 18, 10, 25], [10.4, 31, 13.5, 35.5, 14.5, 41],
    [15.5, 46.5, 16, 53, 19.5, 56], [22.5, 58.5, 25, 56, 25.8, 52], [26.6, 48, 27, 42.5, 32, 42.5],
    [37, 42.5, 37.4, 48, 38.2, 52], [39, 56, 41.5, 58.5, 44.5, 56], [48, 53, 48.5, 46.5, 49.5, 41],
    [50.5, 35.5, 53.6, 31, 54, 25], [54.5, 18, 50.5, 12, 44, 11.5], [40, 11, 36, 13, 32, 15.5],
  ];
  const s = new Shape();
  s.moveTo(...P(32, 15.5));
  for (const c of curves) s.bezierCurveTo(...P(c[0], c[1]), ...P(c[2], c[3]), ...P(c[4], c[5]));
  return s;
}

/** Сглаживает скруглённые края: без этого на глянце видны грани. Лицевые плоскости остаются ровными. */
function smoothSides(g) {
  const pos = g.attributes.position;
  const nor = g.attributes.normal;
  const { start, count } = g.groups[1];
  const key = (i) => Math.round(pos.getX(i) * 20) + "_" + Math.round(pos.getY(i) * 20) + "_" + Math.round(pos.getZ(i) * 20);
  const sums = new Map();
  for (let i = start; i < start + count; i++) {
    const k = key(i);
    const s = sums.get(k) || sums.set(k, [0, 0, 0]).get(k);
    s[0] += nor.getX(i);
    s[1] += nor.getY(i);
    s[2] += nor.getZ(i);
  }
  for (let i = start; i < start + count; i++) {
    const s = sums.get(key(i));
    const l = Math.hypot(s[0], s[1], s[2]) || 1;
    nor.setXYZ(i, s[0] / l, s[1] / l, s[2] / l);
  }
}

/** Размытие квадратной карты: три прохода усреднения дают мягкий колокол. */
function soften(field, size, radius) {
  const line = new Float32Array(size);
  const run = (offset, step) => {
    for (let i = 0; i < size; i++) line[i] = field[offset + i * step];
    let sum = 0;
    for (let i = -radius; i <= radius; i++) sum += line[clamp(i, 0, size - 1)];
    for (let i = 0; i < size; i++) {
      field[offset + i * step] = sum / (2 * radius + 1);
      sum += line[Math.min(size - 1, i + radius + 1)] - line[Math.max(0, i - radius)];
    }
  };
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < size; y++) run(y * size, 1);
    for (let x = 0; x < size; x++) run(x, size);
  }
}

/* Размеры детали в единицах логотипа */
const DEPTH = 22; // толщина ровной стенки
const RIM = 17; // на столько скруглённая кромка выступает за контур формы
const RIM_DEPTH = 15;

/**
 * «Подушка»: деталь освещается так, будто её надули. Лицевая грань остаётся ровной,
 * но отражает свет как выпуклая — блик перекатывается по ней при повороте.
 * Возвращает карту нормалей для грани и наклон подушки в любой точке (он нужен кромке,
 * чтобы та продолжала грань без шва).
 */
function pillow(shape) {
  const SIZE = 192;
  const SPREAD = 50; // на каком расстоянии от края подушка набирает высоту
  const PUFF = 26; // условная высота подушки
  const points = shape.getPoints(24);
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const p of points) {
    x0 = Math.min(x0, p.x);
    y0 = Math.min(y0, p.y);
    x1 = Math.max(x1, p.x);
    y1 = Math.max(y1, p.y);
  }
  const side = Math.max(x1 - x0, y1 - y0) + 2 * (RIM + 6);
  const left = (x0 + x1 - side) / 2;
  const bottom = (y0 + y1 - side) / 2;
  const scale = SIZE / side; // точек карты на единицу логотипа

  // Силуэт детали вместе с кромкой: контур формы, расширенный на её ширину
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.setTransform(scale, 0, 0, -scale, -left * scale, (bottom + side) * scale);
  ctx.beginPath();
  points.forEach((p, i) => ctx[i ? "lineTo" : "moveTo"](p.x, p.y));
  ctx.closePath();
  ctx.fillStyle = ctx.strokeStyle = "#fff";
  ctx.lineJoin = "round";
  ctx.lineWidth = RIM * 2;
  ctx.fill();
  ctx.stroke();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const image = ctx.getImageData(0, 0, SIZE, SIZE);

  // Высота: размытый силуэт (0 у края, 1 в глубине), собранный в выпуклый купол
  const height = new Float32Array(SIZE * SIZE);
  for (let i = 0; i < height.length; i++) height[i] = image.data[i * 4] / 255;
  soften(height, SIZE, Math.max(2, Math.round(SPREAD * scale - 0.5)));
  for (let i = 0; i < height.length; i++) {
    const p = clamp(height[i] * 2 - 1, 0, 1);
    height[i] = PUFF * (1 - (1 - p) * (1 - p));
  }

  // Наклон в каждой точке; он же, записанный цветом, — карта нормалей
  const slope = new Float32Array(SIZE * SIZE * 2);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = y * SIZE + x;
      const dx = (height[y * SIZE + Math.min(SIZE - 1, x + 1)] - height[y * SIZE + Math.max(0, x - 1)]) * scale * 0.5;
      const dy = (height[Math.max(0, y - 1) * SIZE + x] - height[Math.min(SIZE - 1, y + 1) * SIZE + x]) * scale * 0.5;
      slope[i * 2] = dx;
      slope[i * 2 + 1] = dy;
      const l = Math.hypot(dx, dy, 1);
      // Щепотка шума прячет ступеньки восьмибитного цвета на глянце
      image.data[i * 4] = (-dx / l) * 127.5 + 127.5 + Math.random() - 0.5;
      image.data[i * 4 + 1] = (-dy / l) * 127.5 + 127.5 + Math.random() - 0.5;
      image.data[i * 4 + 2] = (1 / l) * 127.5 + 127.5;
      image.data[i * 4 + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const map = new CanvasTexture(canvas);
  map.repeat.set(1 / side, 1 / side); // у лицевой грани координаты текстуры равны координатам формы
  map.offset.set(-left / side, -bottom / side);

  const slopeAt = (x, y) => {
    const u = clamp((x - left) * scale - 0.5, 0, SIZE - 1.001);
    const v = clamp((bottom + side - y) * scale - 0.5, 0, SIZE - 1.001);
    const i = Math.floor(u);
    const j = Math.floor(v);
    const fu = u - i;
    const fv = v - j;
    const at = (c) => {
      const a = (j * SIZE + i) * 2 + c;
      const b = a + SIZE * 2;
      return (slope[a] * (1 - fu) + slope[a + 2] * fu) * (1 - fv) + (slope[b] * (1 - fu) + slope[b + 2] * fu) * fv;
    };
    return [at(0), at(1)];
  };
  return { map, slopeAt };
}

/** Кромка продолжает подушку: её нормали от стенки плавно доходят до наклона лицевой грани. */
function blendRim(g, slopeAt) {
  const pos = g.attributes.position;
  const nor = g.attributes.normal;
  const { start, count } = g.groups[1];
  for (let i = start; i < start + count; i++) {
    const z = pos.getZ(i);
    const rise = (Math.abs(z) - DEPTH / 2) / RIM_DEPTH;
    if (rise <= 0) continue; // ровная стенка
    const turn = Math.asin(Math.min(1, rise)) / (Math.PI / 2); // 0 у стенки, 1 у лицевой грани
    const [sx, sy] = slopeAt(pos.getX(i), pos.getY(i));
    const s = Math.hypot(sx, sy);
    let nx = nor.getX(i);
    let ny = nor.getY(i);
    const flat = Math.hypot(nx, ny);
    if (flat > 1e-4) {
      nx /= flat;
      ny /= flat;
    }
    if (s > 1e-4) {
      // Ближе к грани кромка смотрит туда же, куда наклонена подушка
      const w = turn * turn;
      nx = nx * (1 - w) - (sx / s) * w;
      ny = ny * (1 - w) - (sy / s) * w;
      const l = Math.hypot(nx, ny) || 1;
      nx /= l;
      ny /= l;
    }
    const lift = turn * (Math.PI / 2 - Math.atan(s));
    nor.setXYZ(i, nx * Math.cos(lift), ny * Math.cos(lift), Math.sign(z) * Math.sin(lift));
  }
}

/** Деталь знака: выдавленная форма со скруглённой кромкой и «подушкой» на лицевых гранях. */
function piece(shape, material) {
  const g = new ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: true, bevelThickness: RIM_DEPTH, bevelSize: RIM, bevelSegments: 10, curveSegments: 40 });
  g.translate(0, 0, -DEPTH / 2);
  smoothSides(g);
  const puff = pillow(shape);
  blendRim(g, puff.slopeAt);
  const face = material.clone();
  face.normalMap = face.clearcoatNormalMap = puff.map;
  return { geometry: g, materials: [face, material] }; // грани и кромка: у выдавленной формы это две группы
}

/* ---------- Общие ресурсы: создаются один раз ---------- */

let shared = null;

function createShared() {
  const canvas = document.createElement("canvas");
  // Нужна настоящая видеокарта: на программной отрисовке знак шёл бы рывками
  const attributes = { antialias: true, alpha: true, powerPreference: "high-performance" };
  const gl = canvas.getContext("webgl2", { ...attributes, failIfMajorPerformanceCaveat: true });
  if (!gl) throw new Error("no gpu");
  const renderer = new WebGLRenderer({ canvas, context: gl, ...attributes });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setScissorTest(true);
  renderer.shadowMap.enabled = true; // детали отбрасывают мягкую тень друг на друга
  renderer.shadowMap.type = PCFSoftShadowMap;

  // Окружение для отражений: студия с серыми стенами и светящимися панелями.
  // Стены не тёмные: иначе по контуру белого зуба ложится тёмная кайма.
  const room = new Scene();
  const wall = new Mesh(new BoxGeometry(40, 40, 40), new MeshBasicMaterial({ color: new Color(0.46, 0.5, 0.56), side: BackSide }));
  room.add(wall);
  const panel = (w, h, color, x, y, z) => {
    const m = new Mesh(new BoxGeometry(w, h, 0.2), new MeshBasicMaterial({ color }));
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    room.add(m);
  };
  panel(22, 12, new Color(7, 7, 7.4), 0, 16, 6); // верхний софтбокс
  panel(10, 16, new Color(4.4, 3.4, 2.3), -17, 3, 9); // тёплый свет слева
  panel(8, 14, new Color(0.9, 2.2, 2.6), 17, -2, 4); // бирюзовый контровой справа
  panel(14, 6, new Color(1.6, 1.9, 2.4), 0, -16, 8); // слабая подсветка снизу
  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(room, 0.035).texture;
  pmrem.dispose();

  // Глазурованная керамика: яркий цвет под слоем лака
  const glaze = (color, roughness) => new MeshPhysicalMaterial({ color, roughness, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.0 });
  const materials = { cross: glaze(0x00a3bb, 0.34), heart: glaze(0x43b19a, 0.34), tooth: glaze(0xeef0ef, 0.3) };
  materials.tooth.envMapIntensity = 0.7; // белая эмаль не должна окрашиваться отражениями

  // Крест, сердце и зуб: размеры и места взяты из логотипа. Скруглённая кромка добавляет каждой детали RIM единиц.
  // Форма и материалы каждой детали строятся один раз и служат всем знакам на странице
  const built = {};
  const part = (name, shape, home) => () => {
    const made = built[name] || (built[name] = piece(shape(), materials[name]));
    const mesh = new Mesh(made.geometry, made.materials);
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.userData.home = home;
    return mesh;
  };
  const build = {
    cross: part("cross", () => crossShape(80, 240), [-67, 6.5, -58]),
    heart: part("heart", () => heartShape(298, 266), [31, -9.5, 0]),
    tooth: part("tooth", () => toothShape(5.85), [184.5, -107, 58]),
  };

  return { canvas, renderer, env, build, width: 0, height: 0 };
}

/* ---------- Один знак на странице ---------- */

async function createView(host, kind) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  const ctx = canvas.getContext("2d");
  host.appendChild(canvas);

  const scene = new Scene();
  scene.environment = shared.env;
  const key = new DirectionalLight(0xffffff, 1.9);
  key.position.set(-360, 620, 900);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = key.shadow.camera.bottom = -460;
  key.shadow.camera.right = key.shadow.camera.top = 460;
  key.shadow.camera.near = 300;
  key.shadow.camera.far = 2400;
  key.shadow.radius = 5;
  key.shadow.normalBias = 3;
  scene.add(key);

  const group = new Group();
  const parts = [];
  for (const name of kind === "tooth" ? ["tooth"] : ["cross", "heart", "tooth"]) {
    const mesh = shared.build[name]();
    if (kind === "tooth") mesh.userData.home = [0, 0, 0];
    group.add(mesh);
    parts.push(mesh);
    await breathe();
  }
  scene.add(group);

  const logo = kind !== "tooth";
  const radius = logo ? 372 : 178; // сколько места знак занимает вместе с поворотом
  const camera = new PerspectiveCamera(26, 1, 100, 6000);

  const view = {
    host, canvas, ctx, scene, camera, group, parts, logo,
    w: 0, h: 0, rw: 0, rh: 0, visible: false, ready: false, shown: false,
    hover: 0, px: 0, py: 0, spin: 0, velocity: 0, dragging: false, lastX: 0, rotY: 0, rotX: 0, open: 0,
  };

  view.resize = () => {
    const r = host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    view.w = Math.max(2, Math.round(r.width * dpr));
    view.h = Math.max(2, Math.round(r.height * dpr));
    // Маленький значок рисуется вдвое крупнее и уменьшается при копировании:
    // тонкий блик по контуру белого зуба иначе рассыпается на точки
    view.rw = view.w * (logo ? 1 : 2);
    view.rh = view.h * (logo ? 1 : 2);
    canvas.width = view.w;
    canvas.height = view.h;
    camera.aspect = view.w / view.h;
    // Знак целиком помещается и по ширине, и по высоте
    const fit = radius / Math.tan((camera.fov * Math.PI) / 360) / Math.min(1, camera.aspect);
    camera.position.set(0, 0, fit);
    camera.updateProjectionMatrix();
    shared.width = Math.max(shared.width, view.rw);
    shared.height = Math.max(shared.height, view.rh);
  };

  // Знак можно покрутить: мышью или пальцем по горизонтали (вертикальный жест остаётся прокруткой).
  // Внутри ссылки крутить нельзя: отпускание кнопки стало бы переходом по ссылке.
  const draggable = !host.closest("a");
  host.addEventListener("pointerdown", (e) => {
    if (!draggable) return;
    view.dragging = true;
    view.lastX = e.clientX;
    host.setPointerCapture(e.pointerId);
    host.classList.add("is-grabbing");
  });
  host.addEventListener("pointermove", (e) => {
    const r = host.getBoundingClientRect();
    view.px = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
    view.py = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
    if (view.dragging) {
      const dx = e.clientX - view.lastX;
      view.lastX = e.clientX;
      view.spin += dx * 0.012;
      view.velocity = dx * 0.012;
    }
  });
  const release = () => {
    view.dragging = false;
    host.classList.remove("is-grabbing");
  };
  host.addEventListener("pointerup", release);
  host.addEventListener("pointercancel", release);
  host.addEventListener("pointerenter", () => { view.hover = 1; });
  host.addEventListener("pointerleave", () => { view.hover = 0; view.px = view.py = 0; });

  return view;
}

function animate(view, t, dt) {
  // Раскрученный знак замедляется и возвращается в исходное положение
  if (!view.dragging) {
    view.spin += view.velocity;
    view.velocity *= Math.exp(-dt * 2.2);
    if (Math.abs(view.velocity) < 0.0004) view.spin *= Math.exp(-dt * 1.4);
  }

  // Прокрутка поворачивает знак: пока блок проходит по экрану, его видно с разных сторон
  const r = view.host.getBoundingClientRect();
  const pass = clamp((window.innerHeight - r.top) / (window.innerHeight + r.height), 0, 1) - 0.5;

  let yTo;
  let xTo;
  if (view.logo) {
    yTo = Math.sin(t * 0.5) * 0.2 + pass * 1.5 + view.px * 0.45 * view.hover + view.spin;
    xTo = Math.sin(t * 0.37) * 0.06 + view.py * 0.22 * view.hover + 0.06;
  } else {
    // Значок покачивается, а не вращается: ребром к зрителю он бы превращался в полоску
    yTo = Math.sin(t * 0.8) * 0.62 + view.px * 0.5 * view.hover + view.spin;
    xTo = Math.sin(t * 0.6) * 0.1 + view.py * 0.25 * view.hover;
  }
  const k = 1 - Math.exp(-dt * 6);
  view.rotY += (yTo - view.rotY) * k;
  view.rotX += (xTo - view.rotX) * k;
  view.open += ((view.hover || view.dragging ? 1 : 0.35 + Math.abs(pass) * 0.9) - view.open) * (1 - Math.exp(-dt * 4));

  view.group.rotation.set(view.rotX, view.rotY, 0);
  view.group.position.y = Math.sin(t * 0.8) * (view.logo ? 9 : 4);
  // Детали расходятся по глубине: видно, что знак собран из трёх слоёв
  for (const mesh of view.parts) {
    const [x, y, z] = mesh.userData.home;
    mesh.position.set(x, y, z * (1 + view.open * 0.9));
  }
}

/** Кадр знака на общем холсте за экраном. */
function paint(view) {
  const { renderer } = shared;
  renderer.setViewport(0, 0, view.rw, view.rh);
  renderer.setScissor(0, 0, view.rw, view.rh);
  renderer.clear();
  renderer.render(view.scene, view.camera);
}

/** Кадр знака и его копия в холст на странице. */
function render(view) {
  const { canvas } = shared;
  paint(view);
  view.ctx.clearRect(0, 0, view.w, view.h);
  view.ctx.drawImage(canvas, 0, shared.height - view.rh, view.rw, view.rh, 0, 0, view.w, view.h);
  if (!view.shown) {
    // Первый кадр готов: объёмный знак сменяет обычную картинку
    view.shown = true;
    view.host.classList.add("is-3d");
  }
}

/* ---------- Запуск ---------- */

export async function mountMarks(hosts) {
  try {
    shared = shared || createShared();
  } catch (e) {
    return null;
  }
  await breathe();

  // Знаки собираются по одному и с паузами: страница при этом не замирает
  const views = [];
  for (const host of hosts) {
    await breathe();
    views.push(await createView(host, host.getAttribute("data-kc-mark")));
  }
  const fitAll = () => {
    shared.width = shared.height = 0;
    views.forEach((v) => v.resize());
    shared.renderer.setSize(shared.width, shared.height, false);
  };
  fitAll();
  // Знак «прогревается» по одной детали: программы для видеокарты собираются в фоне,
  // а первый показ каждой детали идёт отдельным шагом. На страницу знак выходит уже готовым.
  const warmUp = async (view) => {
    view.parts.forEach((mesh) => {
      mesh.visible = false;
    });
    for (const mesh of view.parts) {
      mesh.visible = true;
      await shared.renderer.compileAsync(mesh, view.camera, view.scene).catch(() => {});
      paint(view);
      await gpuDone(shared.renderer.getContext());
    }
    view.ready = true;
  };
  (async () => {
    for (const view of views) await warmUp(view);
  })();

  let raf = 0;
  let last = 0;
  let clock = 0;
  const anyVisible = () => !document.hidden && views.some((v) => v.visible);

  function frame(ts) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (ts - last) / 1000);
    last = ts;
    clock += dt;
    for (const view of views) {
      if (!view.visible || !view.ready) continue;
      animate(view, clock, dt);
      render(view);
    }
  }
  function sync() {
    cancelAnimationFrame(raf);
    if (anyVisible()) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const view = views.find((v) => v.host === e.target);
      if (view) view.visible = e.isIntersecting;
    }
    sync();
  }, { rootMargin: "10% 0px" });
  views.forEach((v) => io.observe(v.host));
  document.addEventListener("visibilitychange", sync);

  let queued = false;
  const ro = new ResizeObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fitAll();
    });
  });
  views.forEach((v) => ro.observe(v.host));

  shared.canvas.addEventListener("webglcontextlost", (e) => {
    // Видеокарта недоступна: убираем холсты, на их месте остаются обычные картинки
    e.preventDefault();
    cancelAnimationFrame(raf);
    io.disconnect();
    views.forEach((v) => {
      v.canvas.remove();
      v.host.classList.remove("is-3d");
    });
  });

  return views;
}
