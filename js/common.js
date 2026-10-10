/* ==========================================================================
   CarBook 공통 스크립트 — 전역 객체 CB
   - 레이아웃(상단바, 목차, 이전/다음, 테마) 자동 생성
   - 시뮬레이터 헬퍼: canvas, chart, range, seg, 색/난수/포맷, 자동차 그리기(2D·3D), three.js 씬
   이 파일은 <head>에서 defer 없이 로드된다. 페이지 스크립트는 </body> 직전에 둔다.
   ========================================================================== */
(function () {
  "use strict";

  const CHAPTERS = [
    { slug: "overview",     num: "01", title: "자동차의 전체 그림",        desc: "엔진에서 바퀴까지 힘이 흐르는 길. 주요 구성 요소와 레이아웃을 3D로 훑는다.", tags: ["기초", "3d", "sim"] },
    { slug: "dynamics",     num: "02", title: "달리는 힘, 막는 힘",        desc: "구름 저항, 공기 저항, 등판 저항과 구동력. 최고 속도와 가속을 계산한다.", tags: ["기초", "sim"] },
    { slug: "engine",       num: "03", title: "내연기관",                 desc: "4행정 사이클, 크랭크 기구, P–V 선도, 토크와 출력 곡선.", tags: ["파워트레인", "3d", "sim"] },
    { slug: "combustion",   num: "04", title: "흡기·연료·점화·배기",       desc: "공연비, 연료 분사, 점화 시기, 터보차저, 삼원 촉매와 배출가스.", tags: ["파워트레인", "sim"] },
    { slug: "transmission", num: "05", title: "클러치와 변속기",           desc: "기어비가 필요한 이유. 수동·자동·DCT·CVT와 유성 기어, 변속 선도.", tags: ["파워트레인", "sim"] },
    { slug: "driveline",    num: "06", title: "구동계와 디퍼렌셜",         desc: "FF·FR·AWD, 드라이브 샤프트, 디퍼렌셜과 LSD, 토크 벡터링.", tags: ["파워트레인", "3d", "sim"] },
    { slug: "tire",         num: "07", title: "타이어와 접지",            desc: "슬립률과 슬립각, 마찰원, 하중 이동. 차가 할 수 있는 모든 것은 접지면에서 정해진다.", tags: ["섀시", "sim"] },
    { slug: "brake",        num: "08", title: "브레이크",                 desc: "유압 배력, 디스크와 패드, 제동 거리, 열 페이드, ABS.", tags: ["섀시", "sim"] },
    { slug: "suspension",   num: "09", title: "서스펜션",                 desc: "스프링과 댐퍼, 쿼터카 모델, 맥퍼슨·더블 위시본·멀티링크, 롤과 지오메트리.", tags: ["섀시", "3d", "sim"] },
    { slug: "steering",     num: "10", title: "조향과 차량 거동",          desc: "애커먼 조향, 자전거 모델, 언더스티어·오버스티어, EPS와 ESC.", tags: ["섀시", "sim"] },
    { slug: "body",         num: "11", title: "차체와 충돌 안전",          desc: "모노코크, 강성, 크럼플 존, 안전벨트와 에어백, 충돌 시험.", tags: ["차체", "sim"] },
    { slug: "aero",         num: "12", title: "공기역학",                 desc: "항력 계수, 박리와 후류, 양력과 다운포스, 냉각과 풍절음.", tags: ["차체", "sim"] },
    { slug: "electrical",   num: "13", title: "전장과 차량 네트워크",       desc: "12 V 전원, ECU, 센서와 액추에이터, CAN 버스, 존 아키텍처와 SDV.", tags: ["전장", "sim"] },
    { slug: "hybrid",       num: "14", title: "하이브리드",               desc: "직렬·병렬·동력 분기, 회생 제동, 엔진 운전점 최적화, PHEV.", tags: ["전동화", "sim"] },
    { slug: "motor",        num: "15", title: "전기차: 모터와 인버터",      desc: "회전 자기장, PMSM과 유도 모터, 토크–속도 특성, 인버터와 PWM, 감속기.", tags: ["전동화", "3d", "sim"] },
    { slug: "battery",      num: "16", title: "배터리와 충전",            desc: "리튬 이온 셀, 팩과 BMS, 열 관리, 충전 곡선, 주행 거리와 전비.", tags: ["전동화", "sim"] },
    { slug: "adas",         num: "17", title: "ADAS: 운전자 보조",         desc: "자동화 레벨, ACC, AEB, 차로 유지, 주차 보조와 제어 루프.", tags: ["자율주행", "sim"] },
    { slug: "sensors",      num: "18", title: "자율주행의 눈: 센서",        desc: "카메라, 레이더, 라이다, 초음파, GNSS·IMU. 원리와 한계, 센서 배치.", tags: ["자율주행", "3d", "sim"] },
    { slug: "perception",   num: "19", title: "인지와 측위",              desc: "객체 검출, 추적과 칼만 필터, 센서 융합, 정밀 지도와 위치 추정.", tags: ["자율주행", "sim"] },
    { slug: "planning",     num: "20", title: "예측·계획·제어",            desc: "주변 차량 예측, 경로 탐색, 궤적 생성, 퓨어 퍼슈트와 MPC.", tags: ["자율주행", "sim"] },
    { slug: "autonomy",     num: "21", title: "자율주행 시스템과 안전",     desc: "전체 스택, 엔드투엔드 학습, 기능 안전과 SOTIF, 이중화, V2X, 검증.", tags: ["자율주행", "sim"] },
    { slug: "glossary",     num: "22", title: "용어집 & 종합 퀴즈",        desc: "핵심 용어를 검색하고, 전체 내용을 퀴즈로 점검한다.", tags: ["정리"] },
  ];

  const CB = (window.CB = {});
  CB.CHAPTERS = CHAPTERS;

  /* ------------------------------------------------------------ math utils */
  CB.clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  CB.lerp = (a, b, t) => a + (b - a) * t;
  CB.map = (x, a, b, c, d) => c + ((x - a) * (d - c)) / (b - a);
  CB.randn = function () {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  CB.poisson = function (lambda) {
    if (lambda <= 0) return 0;
    if (lambda > 40) return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * CB.randn()));
    const L = Math.exp(-lambda);
    let k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
  };
  /** 숫자 포맷: 유효 자리 */
  CB.fmt = function (x, digits = 3) {
    if (!isFinite(x)) return "—";
    if (x === 0) return "0";
    const a = Math.abs(x);
    if (a >= 1e5 || a < 1e-3) return x.toExponential(digits - 1).replace("e+", "e");
    return Number(x.toPrecision(digits)).toLocaleString("en-US", { maximumFractionDigits: 6 });
  };
  /** SI 접두사 포맷: CB.si(2.3e-9,'m') → "2.3 nm" */
  CB.si = function (x, unit = "", digits = 3) {
    if (!isFinite(x)) return "—";
    if (x === 0) return "0 " + unit;
    const pre = [[1e12, "T"], [1e9, "G"], [1e6, "M"], [1e3, "k"], [1, ""], [1e-3, "m"], [1e-6, "µ"], [1e-9, "n"], [1e-12, "p"], [1e-15, "f"]];
    const a = Math.abs(x);
    for (const [v, p] of pre) if (a >= v * 0.9995) return Number((x / v).toPrecision(digits)) + " " + p + unit;
    return x.toExponential(digits - 1) + " " + unit;
  };

  /* ------------------------------------------------------------ physics consts */
  CB.G = 9.81;      // 중력 가속도 m/s²
  CB.RHO = 1.225;   // 공기 밀도 kg/m³ (15 °C, 해수면)
  CB.kmh = (ms) => ms * 3.6;
  CB.ms = (kmh) => kmh / 3.6;

  /* ------------------------------------------------------------ drawing helpers */
  /** 화살표: CB.arrow(ctx, x1,y1, x2,y2, color, width) */
  CB.arrow = function (ctx, x1, y1, x2, y2, color, width = 2) {
    const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1);
    if (L < 1) return;
    const h = Math.min(10 + width, L * 0.6);
    ctx.save();
    ctx.strokeStyle = ctx.fillStyle = color; ctx.lineWidth = width; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * h * 0.7, y2 - Math.sin(a) * h * 0.7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - Math.cos(a - 0.42) * h, y2 - Math.sin(a - 0.42) * h);
    ctx.lineTo(x2 - Math.cos(a + 0.42) * h, y2 - Math.sin(a + 0.42) * h);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  };
  /**
   * 위에서 본 차. (x,y)=차 중심 px, heading=진행 방향(rad, 캔버스 좌표계: 0은 오른쪽, +는 시계 방향)
   * opts: { len:px(기본 46), wid:px(기본 20), color, steer:앞바퀴 조향각(rad), wheels:true, alpha, brake:true }
   */
  CB.carTop = function (ctx, x, y, heading, opts = {}) {
    const L = opts.len || 46, W = opts.wid || L * 0.43, P = CB.palette();
    ctx.save();
    ctx.translate(x, y); ctx.rotate(heading);
    if (opts.alpha != null) ctx.globalAlpha = opts.alpha;
    if (opts.wheels) {
      ctx.fillStyle = "#1c2028";
      const wl = L * 0.2, ww = W * 0.2, ax = L * 0.3;
      [[ax, -W / 2, opts.steer || 0], [ax, W / 2, opts.steer || 0], [-ax, -W / 2, 0], [-ax, W / 2, 0]].forEach(([wx, wy, st]) => {
        ctx.save(); ctx.translate(wx, wy); ctx.rotate(st); ctx.fillRect(-wl / 2, -ww / 2, wl, ww); ctx.restore();
      });
    }
    const r = W * 0.28;
    ctx.fillStyle = opts.color || P.accent;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-L / 2, -W / 2, L, W, [r, r * 1.5, r * 1.5, r]); else ctx.rect(-L / 2, -W / 2, L, W);
    ctx.fill();
    ctx.fillStyle = "rgba(15,22,36,0.55)";
    ctx.beginPath(); ctx.moveTo(L * 0.2, -W * 0.38); ctx.lineTo(L * 0.06, -W * 0.33); ctx.lineTo(L * 0.06, W * 0.33); ctx.lineTo(L * 0.2, W * 0.38); ctx.closePath(); ctx.fill();
    ctx.fillRect(-L * 0.32, -W * 0.33, L * 0.1, W * 0.66);
    if (opts.brake) { ctx.fillStyle = "#ff3b30"; ctx.fillRect(-L / 2, -W / 2 + 1, 3, W * 0.25); ctx.fillRect(-L / 2, W / 2 - 1 - W * 0.25, 3, W * 0.25); }
    ctx.restore();
  };
  /** 측면 프로파일(단위 m, x 앞쪽 +, y 위쪽 +). 2D/3D가 같은 윤곽을 쓴다. */
  CB.CAR = { L: 4.5, W: 1.8, H: 1.45, wb: 2.7, track: 1.56, r: 0.33, axF: 1.35, axR: -1.35,
    top: [[2.22, 0.28], [2.25, 0.6], [1.95, 0.85], [0.95, 1.0], [0.25, 1.45], [-0.85, 1.42], [-1.45, 1.05], [-2.05, 0.95], [-2.25, 0.75], [-2.2, 0.28]],
    glass: [[0.85, 1.0], [0.24, 1.4], [-0.8, 1.37], [-1.3, 1.03]] };
  /**
   * 옆에서 본 차. (x,y)=바닥 중앙(지면) px, s=px/m.
   * opts: { color, wheelAngle:바퀴 회전(rad), pitch:rad(+면 앞이 숙여짐), flip:true(왼쪽 향함), alpha, ghost:true(윤곽선만) }
   */
  CB.carSide = function (ctx, x, y, s, opts = {}) {
    const C = CB.CAR, P = CB.palette();
    ctx.save();
    ctx.translate(x, y); ctx.scale(opts.flip ? -1 : 1, 1);
    if (opts.alpha != null) ctx.globalAlpha = opts.alpha;
    ctx.save();
    ctx.translate(0, -C.r * s); ctx.rotate(opts.pitch || 0); ctx.translate(0, C.r * s);
    ctx.beginPath();
    ctx.moveTo(-2.2 * s, -0.28 * s);
    ctx.lineTo((C.axR - 0.42) * s, -0.28 * s); ctx.arc(C.axR * s, -0.28 * s, 0.42 * s, Math.PI, 0, false);
    ctx.lineTo((C.axF - 0.42) * s, -0.28 * s); ctx.arc(C.axF * s, -0.28 * s, 0.42 * s, Math.PI, 0, false);
    C.top.forEach(([px, py]) => ctx.lineTo(px * s, -py * s));
    ctx.closePath();
    if (opts.ghost) { ctx.strokeStyle = opts.color || P.dim; ctx.lineWidth = 1.5; ctx.stroke(); }
    else {
      ctx.fillStyle = opts.color || P.accent; ctx.fill();
      ctx.fillStyle = "rgba(15,22,36,0.55)";
      ctx.beginPath(); C.glass.forEach(([px, py], i) => (i ? ctx.lineTo(px * s, -py * s) : ctx.moveTo(px * s, -py * s))); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    [C.axF, C.axR].forEach((ax) => {
      ctx.save(); ctx.translate(ax * s, -C.r * s); ctx.rotate(opts.wheelAngle || 0);
      ctx.fillStyle = "#1c2028"; ctx.beginPath(); ctx.arc(0, 0, C.r * s, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#aeb6c6"; ctx.beginPath(); ctx.arc(0, 0, C.r * s * 0.58, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#1c2028"; ctx.lineWidth = Math.max(1, s * 0.035);
      for (let k = 0; k < 5; k++) { const a = (k * Math.PI * 2) / 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * C.r * s * 0.58, Math.sin(a) * C.r * s * 0.58); ctx.stroke(); }
      ctx.restore();
    });
    ctx.restore();
  };
  /**
   * 포인터 드래그: CB.drag(el, { down(p,e), move(p,e), up(p,e) }), p = {x,y} (요소 기준 CSS px)
   * down이 false를 반환하면 그 드래그는 무시한다. 터치 스크롤을 막으려면 el에 touch-action:none.
   */
  CB.drag = function (el, h) {
    const pos = (e) => { const r = el.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    let active = false;
    el.addEventListener("pointerdown", (e) => {
      if (h.down && h.down(pos(e), e) === false) return;
      active = true; try { el.setPointerCapture(e.pointerId); } catch (err) {}
    });
    el.addEventListener("pointermove", (e) => { if (active && h.move) h.move(pos(e), e); });
    const end = (e) => { if (!active) return; active = false; if (h.up) h.up(pos(e), e); };
    el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
  };

  /* ------------------------------------------------------------ theme */
  const themeCbs = [];
  CB.onTheme = (cb) => themeCbs.push(cb);
  CB.isDark = function () {
    const t = document.documentElement.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  };
  /** CSS 변수 값 읽기: CB.color('accent') */
  CB.color = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue("--" + name).trim();
  };
  /** 자주 쓰는 색 묶음 (테마 변경 시 다시 호출할 것) */
  CB.palette = function () {
    const c = CB.color;
    return {
      bg: c("canvas-bg"), text: c("text"), dim: c("text-dim"), faint: c("text-faint"),
      grid: c("grid"), axis: c("axis"), border: c("border"), surface: c("surface"),
      accent: c("accent"), accent2: c("accent-2"), ok: c("ok"), warn: c("warn"), bad: c("bad"),
      red: c("red"), green: c("green"), blue: c("blue"),
      // 데이터 시리즈용 기본 순서
      series: [c("accent"), c("accent-2"), c("warn"), c("ok"), c("bad"), c("text-dim")],
    };
  };
  function applyTheme(t) {
    if (t) document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
    themeCbs.forEach((cb) => { try { cb(); } catch (e) { console.error(e); } });
  }
  try { const saved = localStorage.getItem("cb-theme"); if (saved) document.documentElement.setAttribute("data-theme", saved); } catch (e) {}
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
      if (!document.documentElement.getAttribute("data-theme")) applyTheme(null);
    });
  }

  /* ------------------------------------------------------------ canvas helper */
  /**
   * HiDPI 캔버스. 폭은 부모 폭을 따르고 높이는 aspect(높이/폭) 또는 height(px)로 결정.
   * draw(ctx, w, h)는 리사이즈·테마 변경 시 자동 호출된다. 애니메이션이면 직접 redraw() 호출.
   *   const cv = CB.canvas(el, (ctx,w,h)=>{...}, {aspect:0.5, maxHeight: 420});
   *   cv.redraw(); cv.ctx; cv.w; cv.h
   */
  CB.canvas = function (canvas, draw, opts = {}) {
    if (typeof canvas === "string") canvas = document.querySelector(canvas);
    const ctx = canvas.getContext("2d");
    const st = { ctx, w: 0, h: 0, canvas, dpr: 1 };
    function resize() {
      const parent = canvas.parentElement;
      const w = Math.max(200, Math.floor(opts.width || parent.clientWidth || 600));
      let h = opts.height || Math.round(w * (opts.aspect || 0.5));
      if (opts.minHeight) h = Math.max(h, opts.minHeight);
      if (opts.maxHeight) h = Math.min(h, opts.maxHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.w = w; st.h = h; st.dpr = dpr;
      st.redraw();
    }
    st.redraw = function () {
      if (!st.w) return;
      ctx.save();
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      if (!opts.noClear) {
        ctx.clearRect(0, 0, st.w, st.h);
        ctx.fillStyle = CB.color("canvas-bg");
        ctx.fillRect(0, 0, st.w, st.h);
      }
      try { draw && draw(ctx, st.w, st.h); } finally { ctx.restore(); }
    };
    st.resize = resize;
    if (window.ResizeObserver) {
      let lastW = -1;
      new ResizeObserver(() => { const w = canvas.parentElement.clientWidth; if (w !== lastW) { lastW = w; resize(); } }).observe(canvas.parentElement);
    } else window.addEventListener("resize", resize);
    CB.onTheme(() => st.redraw());
    // 첫 그리기가 아직 초기화되지 않은 페이지 상태를 참조해 실패하면, 페이지 스크립트가 끝난 뒤 다시 그린다.
    try { resize(); } catch (e) { setTimeout(() => st.redraw(), 0); }
    return st;
  };

  /**
   * 화면에 보일 때만 도는 애니메이션 루프. fn(dt초, t초)
   *   const loop = CB.loop(el, (dt,t)=>{...}); loop.stop(); loop.start();
   */
  CB.loop = function (el, fn) {
    let raf = 0, last = 0, t = 0, visible = true, running = true;
    function frame(ts) {
      raf = 0;
      if (!running || !visible) return;
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
      last = ts; t += dt;
      fn(dt, t);
      raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf && running && visible) { last = 0; raf = requestAnimationFrame(frame); } }
    if (window.IntersectionObserver && el) {
      new IntersectionObserver((es) => { visible = es[0].isIntersecting; kick(); }).observe(el);
    }
    kick();
    return {
      start() { running = true; kick(); },
      stop() { running = false; },
      get running() { return running; },
      toggle() { running ? (running = false) : ((running = true), kick()); return running; },
    };
  };

  /* ------------------------------------------------------------ chart helper */
  /**
   * 간단한 선 그래프. box = {x,y,w,h}(생략 시 캔버스 전체에 여백 자동)
   * opts: { x:[min,max], y:[min,max], logX, logY, xLabel, yLabel, xTicks, yTicks,
   *         xFmt, yFmt, series:[{data:[[x,y],...], color, width, dash, fill, label}],
   *         vlines:[{x,color,label,dash}], hlines:[{y,color,label,dash}], points:[{x,y,color,r,label}],
   *         bands:[{x0,x1,color}] }
   * 반환: { X(v)->px, Y(v)->px, box }
   */
  CB.chart = function (ctx, box, opts) {
    const P = CB.palette();
    const dpr = (ctx.getTransform && ctx.getTransform().a) || 1;
    const W = ctx.canvas.width / dpr, H = ctx.canvas.height / dpr;
    if (!box) box = { x: 58, y: 16, w: W - 58 - 18, h: H - 16 - 46 };
    const [x0, x1] = opts.x, [y0, y1] = opts.y;
    const lx = (v) => (opts.logX ? Math.log10(v) : v);
    const ly = (v) => (opts.logY ? Math.log10(v) : v);
    const X = (v) => box.x + ((lx(v) - lx(x0)) / (lx(x1) - lx(x0))) * box.w;
    const Y = (v) => box.y + box.h - ((ly(v) - ly(y0)) / (ly(y1) - ly(y0))) * box.h;
    const ticks = (a, b, log, n) => {
      if (log) { const out = []; for (let e = Math.ceil(Math.log10(a) - 1e-9); e <= Math.log10(b) + 1e-9; e++) out.push(Math.pow(10, e)); return out; }
      const span = b - a, raw = span / (n || 5), mag = Math.pow(10, Math.floor(Math.log10(raw)));
      const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= (n || 5) + 0.5) || raw;
      const out = []; for (let v = Math.ceil(a / step - 1e-9) * step; v <= b + step * 1e-6; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
      return out;
    };
    const defFmt = (v) => (Math.abs(v) >= 1e4 || (Math.abs(v) < 1e-2 && v !== 0) ? v.toExponential(0).replace("e+", "e") : String(Number(v.toPrecision(4))));
    const xFmt = opts.xFmt || defFmt, yFmt = opts.yFmt || defFmt;
    ctx.save();
    ctx.font = "11px " + getComputedStyle(document.body).getPropertyValue("--mono");
    ctx.lineWidth = 1;
    // bands
    (opts.bands || []).forEach((b) => { ctx.fillStyle = b.color; ctx.fillRect(X(b.x0), box.y, X(b.x1) - X(b.x0), box.h); });
    // grid + ticks
    const xt = opts.xTicks || ticks(x0, x1, opts.logX, 6);
    const yt = opts.yTicks || ticks(y0, y1, opts.logY, 5);
    ctx.strokeStyle = P.grid; ctx.fillStyle = P.dim;
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    xt.forEach((v) => { const px = X(v); if (px < box.x - 1 || px > box.x + box.w + 1) return; ctx.beginPath(); ctx.moveTo(px, box.y); ctx.lineTo(px, box.y + box.h); ctx.stroke(); ctx.fillText(xFmt(v), px, box.y + box.h + 6); });
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yt.forEach((v) => { const py = Y(v); if (py < box.y - 1 || py > box.y + box.h + 1) return; ctx.beginPath(); ctx.moveTo(box.x, py); ctx.lineTo(box.x + box.w, py); ctx.stroke(); ctx.fillText(yFmt(v), box.x - 6, py); });
    ctx.strokeStyle = P.axis;
    ctx.beginPath(); ctx.moveTo(box.x, box.y); ctx.lineTo(box.x, box.y + box.h); ctx.lineTo(box.x + box.w, box.y + box.h); ctx.stroke();
    // labels
    ctx.fillStyle = P.dim; ctx.font = "12px " + getComputedStyle(document.body).getPropertyValue("--font");
    if (opts.xLabel) { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(opts.xLabel, box.x + box.w / 2, box.y + box.h + 40); }
    if (opts.yLabel) { ctx.save(); ctx.translate(14, box.y + box.h / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(opts.yLabel, 0, 0); ctx.restore(); }
    // clip plot area
    ctx.save(); ctx.beginPath(); ctx.rect(box.x, box.y - 2, box.w + 2, box.h + 4); ctx.clip();
    (opts.series || []).forEach((s, i) => {
      if (!s.data || !s.data.length) return;
      ctx.strokeStyle = s.color || P.series[i % P.series.length];
      ctx.lineWidth = s.width || 2; ctx.setLineDash(s.dash || []);
      ctx.beginPath();
      let started = false;
      s.data.forEach(([x, y]) => { if (!isFinite(y) || (opts.logY && y <= 0) || (opts.logX && x <= 0)) { started = false; return; } const px = X(x), py = Y(y); started ? ctx.lineTo(px, py) : ctx.moveTo(px, py); started = true; });
      ctx.stroke();
      if (s.fill) {
        ctx.lineTo(X(s.data[s.data.length - 1][0]), Y(opts.logY ? y0 : Math.max(y0, 0)));
        ctx.lineTo(X(s.data[0][0]), Y(opts.logY ? y0 : Math.max(y0, 0)));
        ctx.closePath(); ctx.fillStyle = s.fill; ctx.fill();
      }
      ctx.setLineDash([]);
    });
    (opts.vlines || []).forEach((l) => { ctx.strokeStyle = l.color || P.faint; ctx.setLineDash(l.dash || [4, 4]); ctx.lineWidth = l.width || 1.2; ctx.beginPath(); ctx.moveTo(X(l.x), box.y); ctx.lineTo(X(l.x), box.y + box.h); ctx.stroke(); ctx.setLineDash([]); if (l.label) { ctx.fillStyle = l.color || P.dim; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(l.label, X(l.x) + 4, box.y + 4); } });
    (opts.hlines || []).forEach((l) => { ctx.strokeStyle = l.color || P.faint; ctx.setLineDash(l.dash || [4, 4]); ctx.lineWidth = l.width || 1.2; ctx.beginPath(); ctx.moveTo(box.x, Y(l.y)); ctx.lineTo(box.x + box.w, Y(l.y)); ctx.stroke(); ctx.setLineDash([]); if (l.label) { ctx.fillStyle = l.color || P.dim; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(l.label, box.x + box.w - 4, Y(l.y) - 3); } });
    (opts.points || []).forEach((p) => { ctx.fillStyle = p.color || P.accent; ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), p.r || 4, 0, Math.PI * 2); ctx.fill(); if (p.label) { ctx.fillStyle = P.text; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(p.label, X(p.x) + 6, Y(p.y) - 4); } });
    ctx.restore();
    ctx.restore();
    return { X, Y, box };
  };

  /* ------------------------------------------------------------ controls */
  /**
   * range 입력 바인딩. output은 id+"-out" 요소 또는 <output for=id>.
   *   const get = CB.range('wl', v => v+' nm', v => redraw());  get() → 현재 값(Number)
   */
  CB.range = function (id, fmt, onInput) {
    const el = typeof id === "string" ? document.getElementById(id) : id;
    const out = document.getElementById(el.id + "-out") || document.querySelector(`output[for="${el.id}"]`);
    const update = (fire) => {
      const v = Number(el.value);
      const pct = ((v - Number(el.min || 0)) / (Number(el.max || 100) - Number(el.min || 0))) * 100;
      el.style.setProperty("--fill", pct + "%");
      if (out) out.textContent = fmt ? fmt(v) : String(v);
      if (fire && onInput) onInput(v);
    };
    el.addEventListener("input", () => update(true));
    update(false);
    const get = () => Number(el.value);
    get.set = (v) => { el.value = v; update(true); };
    get.el = el;
    return get;
  };
  /**
   * 세그먼트 버튼: <div class="seg" id="mode"><button data-value="a" class="on">A</button>...</div>
   *   const mode = CB.seg('mode', v => redraw());  mode() → 현재 값
   */
  CB.seg = function (id, onChange) {
    const el = typeof id === "string" ? document.getElementById(id) : id;
    const btns = [...el.querySelectorAll("button")];
    let cur = (btns.find((b) => b.classList.contains("on")) || btns[0]).dataset.value;
    const set = (v, fire = true) => {
      cur = v;
      btns.forEach((b) => { const on = b.dataset.value === v; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
      if (fire && onChange) onChange(v);
    };
    btns.forEach((b) => b.addEventListener("click", () => set(b.dataset.value)));
    set(cur, false);
    const get = () => cur;
    get.set = set;
    return get;
  };
  /** 통계 표시: CB.stat('snr', '32.1 dB') → id 요소의 textContent 설정(HTML 허용) */
  CB.stat = function (id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; };

  /* ------------------------------------------------------------ three.js helper */
  /**
   * three.js 씬 준비 (전역 THREE, THREE.OrbitControls 필요).
   *   const T = CB.three(containerEl, { camera:[x,y,z], target:[x,y,z], fov:40, autoRotate:false });
   *   T.scene, T.camera, T.renderer, T.controls, T.THREE
   *   T.onFrame((dt,t)=>{...});   T.label('텍스트', new THREE.Vector3(...)) → HTML 라벨(자동 투영)
   *   T.material(color, opts)  → MeshStandardMaterial 헬퍼
   * 조명(환경광+방향광 2개), 리사이즈, 화면 밖 일시정지, 테마 대응 포함.
   */
  CB.three = function (container, opts = {}) {
    if (typeof container === "string") container = document.querySelector(container);
    if (!window.THREE) { container.innerHTML = '<p style="padding:20px;color:var(--text-dim)">3D 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인하세요.</p>'; return null; }
    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(opts.fov || 40, 1, 0.01, 2000);
    camera.position.set(...(opts.camera || [6, 5, 8]));
    const controls = THREE.OrbitControls ? new THREE.OrbitControls(camera, renderer.domElement) : null;
    if (controls) {
      controls.target.set(...(opts.target || [0, 0, 0]));
      controls.enableDamping = true; controls.dampingFactor = 0.08;
      controls.autoRotate = !!opts.autoRotate; controls.autoRotateSpeed = opts.autoRotateSpeed || 0.8;
      controls.enablePan = opts.pan !== false;
      if (opts.minDistance) controls.minDistance = opts.minDistance;
      if (opts.maxDistance) controls.maxDistance = opts.maxDistance;
      controls.update();
    } else camera.lookAt(...(opts.target || [0, 0, 0]));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x445066, 0.75));
    const d1 = new THREE.DirectionalLight(0xffffff, 0.85); d1.position.set(5, 10, 7); scene.add(d1);
    const d2 = new THREE.DirectionalLight(0xbfd7ff, 0.35); d2.position.set(-6, 4, -5); scene.add(d2);

    const labelLayer = document.createElement("div");
    labelLayer.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden";
    container.appendChild(labelLayer);
    const labels = [];
    const frameCbs = [];
    const T = { THREE, scene, camera, renderer, controls, container, labels };
    T.onFrame = (cb) => frameCbs.push(cb);
    T.label = function (text, pos, cls) {
      const el = document.createElement("div");
      el.className = "overlay-label" + (cls ? " " + cls : "");
      el.innerHTML = text;
      labelLayer.appendChild(el);
      const L = { el, pos: pos.clone ? pos.clone() : new THREE.Vector3(...pos), visible: true, obj: null };
      L.setVisible = (v) => { L.visible = v; el.style.display = v ? "" : "none"; };
      L.remove = () => { el.remove(); labels.splice(labels.indexOf(L), 1); };
      labels.push(L);
      return L;
    };
    T.material = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55, metalness: 0.05 }, o));
    function resize() {
      const w = container.clientWidth, h = container.clientHeight || 400;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = w + "px"; renderer.domElement.style.height = h + "px";
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    if (window.ResizeObserver) new ResizeObserver(resize).observe(container); else window.addEventListener("resize", resize);
    resize();
    const v = new THREE.Vector3();
    T.loop = CB.loop(container, (dt, t) => {
      frameCbs.forEach((cb) => cb(dt, t));
      if (controls) controls.update();
      renderer.render(scene, camera);
      const w = container.clientWidth, h = container.clientHeight;
      labels.forEach((L) => {
        if (!L.visible) return;
        v.copy(L.pos); if (L.obj) L.obj.localToWorld(v);
        v.project(camera);
        const behind = v.z > 1;
        L.el.style.display = behind ? "none" : "";
        L.el.style.left = ((v.x + 1) / 2) * w + "px";
        L.el.style.top = ((1 - v.y) / 2) * h + "px";
      });
    });
    return T;
  };

  /**
   * 공용 3D 승용차(단위 m, +x 전방, +y 위, +z 우측, 바닥 y=0). 치수는 CB.CAR.
   *   const car = CB.car3d(T, { color, opacity, glass:true });
   *   car.group, car.body(Mesh), car.glass, car.wheels = [FL, FR, RL, RR] 각 { pivot(조향: rotation.y), spin(회전: rotation.z) }
   *   주행 거리 d만큼 굴리기: w.spin.rotation.z = -d / CB.CAR.r
   */
  CB.car3d = function (T, opts = {}) {
    const THREE = T.THREE, C = CB.CAR, g = new THREE.Group();
    const sh = new THREE.Shape();
    sh.moveTo(-2.2, 0.28);
    sh.lineTo(C.axR - 0.42, 0.28); sh.absarc(C.axR, 0.28, 0.42, Math.PI, 0, true);
    sh.lineTo(C.axF - 0.42, 0.28); sh.absarc(C.axF, 0.28, 0.42, Math.PI, 0, true);
    C.top.forEach(([x, y]) => sh.lineTo(x, y));
    const w = C.W - 0.16;
    const geo = new THREE.ExtrudeGeometry(sh, { depth: w, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.08, bevelSegments: 3, curveSegments: 16 });
    geo.translate(0, 0, -w / 2);
    const mat = T.material(opts.color != null ? opts.color : 0xdd5a16, { roughness: 0.35, metalness: 0.45 });
    if (opts.opacity != null && opts.opacity < 1) { mat.transparent = true; mat.opacity = opts.opacity; mat.depthWrite = false; }
    const body = new THREE.Mesh(geo, mat); g.add(body);
    let glass = null;
    if (opts.glass !== false) {
      const gs = new THREE.Shape();
      C.glass.forEach(([x, y], i) => (i ? gs.lineTo(x, y) : gs.moveTo(x, y)));
      const gg = new THREE.ExtrudeGeometry(gs, { depth: w + 0.18, bevelEnabled: false });
      gg.translate(0, 0, -(w + 0.18) / 2);
      glass = new THREE.Mesh(gg, new THREE.MeshStandardMaterial({ color: 0x18222f, roughness: 0.1, metalness: 0.6, transparent: true, opacity: opts.opacity != null && opts.opacity < 1 ? Math.min(0.35, opts.opacity) : 0.85 }));
      g.add(glass);
    }
    const tireGeo = new THREE.CylinderGeometry(C.r, C.r, 0.22, 28); tireGeo.rotateX(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(C.r * 0.6, C.r * 0.6, 0.24, 20); rimGeo.rotateX(Math.PI / 2);
    const spokeGeo = new THREE.BoxGeometry(C.r * 1.1, 0.05, 0.25);
    const tireMat = T.material(0x1c2028, { roughness: 0.9 }), rimMat = T.material(0xb8c0cf, { roughness: 0.3, metalness: 0.8 }), spokeMat = T.material(0x4a5266, { metalness: 0.6 });
    const wheels = [[C.axF, -1], [C.axF, 1], [C.axR, -1], [C.axR, 1]].map(([x, side]) => {
      const pivot = new THREE.Group(); pivot.position.set(x, C.r, (side * C.track) / 2);
      const spin = new THREE.Group(); pivot.add(spin);
      spin.add(new THREE.Mesh(tireGeo, tireMat), new THREE.Mesh(rimGeo, rimMat), new THREE.Mesh(spokeGeo, spokeMat));
      const s2 = new THREE.Mesh(spokeGeo, spokeMat); s2.rotation.z = Math.PI / 2; spin.add(s2);
      g.add(pivot);
      return { pivot, spin };
    });
    T.scene.add(g);
    return { group: g, body, glass, wheels, dims: C };
  };
  /** 바닥 격자: CB.ground3d(T, size=20) → GridHelper (테마 색) */
  CB.ground3d = function (T, size = 20, div = 20) {
    const grid = new T.THREE.GridHelper(size, div, 0x8892a6, 0x8892a6);
    grid.material.transparent = true; grid.material.opacity = 0.28;
    T.scene.add(grid);
    return grid;
  };

  /* ------------------------------------------------------------ layout build */
  const LOGO = `<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="sbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--accent-2)"/></linearGradient></defs><rect x="2" y="2" width="28" height="28" rx="8" fill="url(#sbg)"/><path d="M6 20v-3.2c0-.9.6-1.6 1.5-1.8l3-.6 2.6-3.3c.4-.5 1-.8 1.6-.8h5c.7 0 1.3.3 1.7.9l2 3 1.6.5c.8.3 1.3 1 1.3 1.800V20z" fill="#fff"/><circle cx="11" cy="20.5" r="2.6" fill="#fff" stroke="url(#sbg)" stroke-width="1.4"/><circle cx="21.500" cy="20.5" r="2.6" fill="#fff" stroke="url(#sbg)" stroke-width="1.4"/></svg>`;
  const ICON_MENU = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
  const ICON_MOON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`;
  const ICON_SUN = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;

  function build() {
    const body = document.body;
    const root = body.dataset.root != null ? body.dataset.root : body.dataset.chapter ? "../" : "";
    const curSlug = body.dataset.chapter || "";
    const href = (slug) => (slug ? `${root}chapters/${slug}.html` : `${root}index.html`);
    const feedbackUrl = "https://books.euiyun.com/feedback.html?book=carbook&page=" + encodeURIComponent(location.href);

    // top bar
    const bar = document.createElement("header");
    bar.className = "sb-topbar";
    bar.innerHTML = `
      <button class="sb-btn icon" id="sb-menu" aria-label="챕터 목록">${ICON_MENU}</button>
      <a class="sb-logo" href="${href("")}">${LOGO}<span>CarBook <small>자동차 교과서</small></span></a>
      <span class="spacer"></span>
      <a class="sb-btn series-link" href="https://books.euiyun.com/" aria-label="전체 책 보기" title="전체 책 보기"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5h6v14H4zM10 5.5h6v14h-6zM17 7l3-1 2 13-3 1z"/></svg><span>전체 책</span></a>
      <button class="sb-btn icon" id="cb-theme" aria-label="테마 전환"></button>
      <div class="sb-progress" id="sb-progress"></div>`;
    const feedbackButton = document.createElement("a");
    feedbackButton.className = bar.className.replace("-topbar", "-btn") + " icon feedback-button";
    feedbackButton.href = feedbackUrl;
    feedbackButton.target = "_blank";
    feedbackButton.rel = "noopener";
    feedbackButton.setAttribute("aria-label", "독자 의견 보내기");
    feedbackButton.title = "독자 의견 보내기";
    feedbackButton.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6 4V6a2 2 0 0 1 2-2z"/><path d="M8 9h8M8 13h5"/></svg>';
    bar.querySelector("[id$='-theme']").before(feedbackButton);
    body.prepend(bar);

    // Search chapter metadata immediately; load section and visual titles on demand.
    const progressBar = bar.querySelector("[id$='-progress']");
    const spacer = bar.querySelector(".spacer");
    const leftNav = document.createElement("div");
    leftNav.className = "book-nav-left";
    leftNav.append(bar.querySelector("[id$='-menu']"), bar.querySelector("a[class$='-logo']"));
    const rightNav = document.createElement("div");
    rightNav.className = "book-nav-right";
    [...bar.children].filter((el) => el !== spacer && el !== progressBar).forEach((el) => rightNav.appendChild(el));
    spacer.remove();
    const search = document.createElement("div");
    search.className = "book-search";
    search.innerHTML = '<svg class="book-search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg><input type="search" aria-label="이 책의 챕터, 섹션, 시뮬레이터, 그림 검색" placeholder="이 책 검색" autocomplete="off"><div class="book-search-results" aria-live="polite"></div>';
    bar.prepend(leftNav);
    bar.insertBefore(search, progressBar);
    bar.insertBefore(rightNav, progressBar);
    const searchInput = search.querySelector("input");
    const searchResults = search.querySelector(".book-search-results");
    const closeSearch = () => { search.classList.remove("open"); searchResults.replaceChildren(); };
    let detailEntries = [];
    let detailsLoaded = false;
    let detailPromise;
    function loadDetails() {
      if (detailPromise) return detailPromise;
      detailPromise = Promise.all(CHAPTERS.map(async (chapter) => {
        try {
          const response = await fetch(href(chapter.slug));
          if (!response.ok) return [];
          const doc = new DOMParser().parseFromString(await response.text(), "text/html");
          const main = doc.querySelector("main.chapter");
          if (!main) return [];
          const entries = [];
          [...main.querySelectorAll("section > h2")].forEach((heading, i) => {
            entries.push({ type: "섹션", title: heading.textContent.trim(), chapter, hash: heading.parentElement.id || `s${i + 1}` });
          });
          [...main.querySelectorAll(".sim")].filter((sim) => sim.querySelector(".sim-head h3")).forEach((sim, i) => {
            entries.push({ type: "시뮬레이터", title: sim.querySelector(".sim-head h3").textContent.trim(), chapter, hash: sim.id || `search-sim-${i + 1}` });
          });
          [...main.querySelectorAll("figure")].filter((figure) => figure.querySelector("figcaption")).forEach((figure, i) => {
            const caption = figure.querySelector("figcaption").textContent.replace(/\s+/g, " ").trim();
            entries.push({ type: "그림", title: caption.slice(0, 140), chapter, hash: figure.id || `search-fig-${i + 1}` });
          });
          return entries;
        } catch (error) { return []; }
      })).then((parts) => { detailEntries = parts.flat(); detailsLoaded = true; renderSearch(); });
      return detailPromise;
    }
    function renderSearch() {
      const words = searchInput.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
      searchResults.replaceChildren();
      if (!words.length) { closeSearch(); return; }
      const includesWords = (value) => words.every((word) => value.toLocaleLowerCase().includes(word));
      const chapterMatches = CHAPTERS.filter((c) => includesWords([c.num, c.title, c.desc, ...(c.tags || [])].join(" ")))
        .map((c) => ({ type: "챕터", title: c.title, chapter: c, hash: "" }));
      const detailMatches = detailEntries.filter((entry) => includesWords(entry.title));
      const matches = [
        ...chapterMatches.slice(0, 4),
        ...detailMatches.filter((entry) => entry.type === "섹션").slice(0, 5),
        ...detailMatches.filter((entry) => entry.type === "시뮬레이터").slice(0, 4),
        ...detailMatches.filter((entry) => entry.type === "그림").slice(0, 4),
      ];
      matches.forEach((entry) => {
        const link = document.createElement("a");
        link.href = href(entry.chapter.slug) + (entry.hash ? `#${entry.hash}` : "");
        const title = document.createElement("strong");
        title.textContent = entry.title;
        const context = document.createElement("small");
        context.textContent = `${entry.chapter.num} · ${entry.chapter.title} · ${entry.type}`;
        link.append(title, context);
        searchResults.appendChild(link);
      });
      if (chapterMatches.length + detailMatches.length > matches.length) {
        const more = document.createElement("p");
        more.textContent = `상위 ${matches.length}개 표시 · 검색어를 더 구체적으로 입력해 보세요`;
        searchResults.appendChild(more);
      }
      if (detailPromise && !detailsLoaded) {
        const status = document.createElement("p");
        status.textContent = "섹션·시뮬레이터·그림 목록을 불러오는 중…";
        searchResults.appendChild(status);
      } else if (!matches.length) {
        const empty = document.createElement("p");
        empty.textContent = "검색 결과가 없습니다";
        searchResults.appendChild(empty);
      }
      search.classList.add("open");
    }
    searchInput.addEventListener("input", () => { if (searchInput.value.trim()) loadDetails(); renderSearch(); });
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeSearch(); searchInput.blur(); }
      else if (e.key === "ArrowDown") { const first = searchResults.querySelector("a"); if (first) { e.preventDefault(); first.focus(); } }
      else if (e.key === "Enter") { const first = searchResults.querySelector("a"); if (first) { e.preventDefault(); first.click(); } }
    });
    searchResults.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeSearch(); searchInput.focus(); }
      else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const links = [...searchResults.querySelectorAll("a")];
        const next = links.indexOf(document.activeElement) + (e.key === "ArrowDown" ? 1 : -1);
        e.preventDefault();
        (links[next] || searchInput).focus();
      }
    });
    document.addEventListener("pointerdown", (e) => { if (!search.contains(e.target)) closeSearch(); });


    // drawer
    const drawer = document.createElement("nav");
    drawer.className = "sb-drawer";
    drawer.innerHTML = `<h4>Chapters</h4><ul class="sb-chlist">
      <li><a href="${href("")}" class="${curSlug ? "" : "active"}"><span class="num">00</span><span>홈 · 로드맵</span></a></li>
      ${CHAPTERS.map((c) => `<li><a href="${href(c.slug)}" class="${c.slug === curSlug ? "active" : ""}"><span class="num">${c.num}</span><span>${c.title}</span></a></li>`).join("")}
    </ul>`;
    const backdrop = document.createElement("div");
    backdrop.className = "sb-drawer-backdrop";
    body.append(backdrop, drawer);
    const toggleDrawer = (o) => body.classList.toggle("drawer-open", o);
    bar.querySelector("#sb-menu").addEventListener("click", () => toggleDrawer(true));
    backdrop.addEventListener("click", () => toggleDrawer(false));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleDrawer(false); });

    // theme toggle
    const tbtn = bar.querySelector("#cb-theme");
    const setIcon = () => (tbtn.innerHTML = CB.isDark() ? ICON_SUN : ICON_MOON);
    setIcon();
    tbtn.addEventListener("click", () => {
      const next = CB.isDark() ? "light" : "dark";
      try { localStorage.setItem("cb-theme", next); } catch (e) {}
      applyTheme(next); setIcon();
    });

    // progress
    const prog = bar.querySelector("#sb-progress");
    const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; prog.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%"; };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();

    // chapter page extras
    const main = document.querySelector("main.chapter");
    if (main) {
      // Give search results stable anchors even when the source has no id.
      [...main.querySelectorAll(".sim")].filter((sim) => sim.querySelector(".sim-head h3")).forEach((sim, i) => { if (!sim.id) sim.id = `search-sim-${i + 1}`; });
      [...main.querySelectorAll("figure")].filter((figure) => figure.querySelector("figcaption")).forEach((figure, i) => { if (!figure.id) figure.id = `search-fig-${i + 1}`; });
      if (/^#(?:s\d+|search-(?:sim|fig)-)/.test(location.hash)) {
        requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
      }
      // numbered h2 + TOC
      const layout = document.createElement("div");
      layout.className = "sb-layout";
      main.parentNode.insertBefore(layout, main);
      layout.appendChild(main);
      const toc = document.createElement("aside");
      toc.className = "sb-toc";
      const h2s = [...main.querySelectorAll("section > h2")];
      let n = 0;
      toc.innerHTML = "<h4>ON THIS PAGE</h4>" + h2s.map((h, i) => {
        const sec = h.parentElement;
        if (!sec.id) sec.id = "s" + (i + 1);
        const numbered = !sec.classList.contains("keypoints") && !sec.classList.contains("quiz-sec") && !sec.hasAttribute("data-nonum");
        if (numbered && !h.querySelector(".h-num")) { n++; h.insertAdjacentHTML("afterbegin", `<span class="h-num">${String(n).padStart(2, "0")}</span>`); }
        return `<a href="#${sec.id}">${h.textContent.replace(/^\d\d/, "").trim()}</a>`;
      }).join("");
      layout.appendChild(toc);
      const links = [...toc.querySelectorAll("a")];
      if (window.IntersectionObserver && h2s.length) {
        const io = new IntersectionObserver((es) => {
          es.forEach((e) => { if (e.isIntersecting) { links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)); } });
        }, { rootMargin: "-20% 0px -70% 0px" });
        h2s.forEach((h) => io.observe(h.parentElement));
      }

      // pager
      const idx = CHAPTERS.findIndex((c) => c.slug === curSlug);
      const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
      const next = idx >= 0 && idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;
      const pager = document.createElement("nav");
      pager.className = "sb-pager";
      pager.innerHTML =
        (prev ? `<a class="prev" href="${href(prev.slug)}"><small>← 이전 · ${prev.num}</small>${prev.title}</a>` : `<a class="prev" href="${href("")}"><small>← 처음으로</small>홈 · 로드맵</a>`) +
        (next ? `<a class="next" href="${href(next.slug)}"><small>다음 · ${next.num} →</small>${next.title}</a>` : "");
      layout.after(pager);
    }
    const foot = document.createElement("footer");
    foot.className = "sb-foot";
    foot.innerHTML = `CarBook — 기초부터 자율주행까지, 인터랙티브 자동차 교과서 · 수치는 교육용 근사 모델입니다.
      <br>© 2026 <a href="https://github.com/geniuskey">geniuskey</a> ·
      콘텐츠 <a href="https://creativecommons.org/licenses/by/4.0/deed.ko" rel="license">CC BY 4.0</a> ·
      코드 <a href="https://github.com/geniuskey/carbook/blob/main/LICENSE-MIT">MIT</a> ·
      <a href="https://github.com/geniuskey/carbook/blob/main/LICENSE.md">라이선스 안내</a>`;
    const feedbackLink = document.createElement("a");
    feedbackLink.href = feedbackUrl;
    feedbackLink.target = "_blank";
    feedbackLink.rel = "noopener";
    feedbackLink.textContent = "독자 의견";
    foot.append(" · ", feedbackLink);
    body.appendChild(foot);

    // quiz
    document.querySelectorAll(".quiz-q").forEach((q) => {
      const opts = [...q.querySelectorAll("button.opt")];
      opts.forEach((b) => b.addEventListener("click", () => {
        opts.forEach((o) => { o.disabled = true; if (o.hasAttribute("data-correct")) o.classList.add("right"); });
        if (!b.hasAttribute("data-correct")) b.classList.add("wrong");
        q.classList.add("done");
        q.dispatchEvent(new CustomEvent("answered", { bubbles: true, detail: { correct: b.hasAttribute("data-correct") } }));
      }));
    });

    // KaTeX
    const renderMath = () => {
      if (window.renderMathInElement) {
        renderMathInElement(document.body, {
          delimiters: [{ left: "$$", right: "$$", display: true }, { left: "\\(", right: "\\)", display: false }, { left: "\\[", right: "\\]", display: true }],
          throwOnError: false,
          ignoredClasses: ["no-math"],
        });
      }
    };
    if (window.renderMathInElement) renderMath();
    else window.addEventListener("load", renderMath);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();

// Simulator deep links: add a shareable # link to each simulator heading.
(function () {
  function addSimulatorLinks() {
    document.querySelectorAll(".sim[id] > .sim-head").forEach((head) => {
      if (head.querySelector(".sim-link")) return;
      const link = document.createElement("a");
      link.className = "sim-link";
      link.href = "#" + head.parentElement.id;
      link.textContent = "#";
      link.title = "이 시뮬레이터로 가는 링크";
      link.setAttribute("aria-label", "이 시뮬레이터로 가는 링크");
      head.appendChild(link);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addSimulatorLinks, { once: true });
  } else {
    addSimulatorLinks();
  }
})();
